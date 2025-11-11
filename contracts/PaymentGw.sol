// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PaymentGw is Ownable, Pausable, ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;
    struct TokenConfig {
        bool enabled; // Whether the token is supported
        uint256 feeBps; // Fee in basis points, e.g., 100 = 1%
        uint256 minFeeAmount; // Minimum fee amount
        uint256 maxFeeAmount; // Maximum fee amount
    }

    mapping(address => TokenConfig) public merchantConfigs; // Merchant address => configuration
    bytes32 public constant MERCHANT_EDITOR_ROLE =
        keccak256("MERCHANT_EDITOR_ROLE");

    // Token address => configuration
    mapping(address => TokenConfig) public supportedTokens;

    // Fee collector address (can be empty)
    address public feeCollector;
    event TokenSupported(
        address indexed token,
        bool enabled,
        uint256 feeBps,
        uint256 minFeeAmount,
        uint256 maxFeeAmount
    );
    event FeeCollectorUpdated(address indexed collector);
    event MerchantTokenConfigUpdated(
        address indexed merchant,
        bool enabled,
        uint256 feeBps,
        uint256 minFeeAmount,
        uint256 maxFeeAmount
    );
    event Payment(
        bytes32 indexed orderId,
        address payer,
        address indexed token,
        address indexed to,
        uint256 amount,
        uint256 fee
    );
    event Refund(
        bytes32 indexed orderId,
        address payer,
        address indexed token,
        address indexed to,
        uint256 amount
    );
    event FeesWithdrawn(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    constructor(address initialOwner) Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MERCHANT_EDITOR_ROLE, initialOwner);
    }

    /// @notice Set fee collector address
    function setFeeCollector(address collector) external onlyOwner {
        feeCollector = collector;
        emit FeeCollectorUpdated(collector);
    }

    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Configure supported token and fee settings
    /// @param token ERC20 token address
    /// @param enabled Whether to enable the token
    /// @param feeBps Fee percentage in basis points, 100 = 1%
    /// @param _minFeeAmount Minimum fee amount
    /// @param _maxFeeAmount Maximum fee amount
    function setTokenConfig(
        address token,
        bool enabled,
        uint256 feeBps,
        uint256 _minFeeAmount,
        uint256 _maxFeeAmount
    ) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(feeBps <= 10_000, "Invalid feeBps"); // <= 100%
        require(
            (_maxFeeAmount == 0) ||
                (_maxFeeAmount > 0 && _minFeeAmount <= _maxFeeAmount),
            "Invalid fee amount configuration"
        );

        supportedTokens[token] = TokenConfig(
            enabled,
            feeBps,
            _minFeeAmount,
            _maxFeeAmount
        );
        emit TokenSupported(
            token,
            enabled,
            feeBps,
            _minFeeAmount,
            _maxFeeAmount
        );
    }

    /// @notice Configure merchant-specific token fee settings (takes priority over global)
    function setMerchantTokenConfig(
        address merchant,
        bool enabled,
        uint256 feeBps,
        uint256 _minFeeAmount,
        uint256 _maxFeeAmount
    ) external onlyRole(MERCHANT_EDITOR_ROLE) {
        require(merchant != address(0), "Invalid merchant");
        require(feeBps <= 10_000, "Invalid feeBps");
        require(
            (_maxFeeAmount == 0) ||
                (_maxFeeAmount > 0 && _minFeeAmount <= _maxFeeAmount),
            "Invalid fee amount configuration"
        );

        merchantConfigs[merchant] = TokenConfig(
            enabled,
            feeBps,
            _minFeeAmount,
            _maxFeeAmount
        );

        emit MerchantTokenConfigUpdated(
            merchant,
            enabled,
            feeBps,
            _minFeeAmount,
            _maxFeeAmount
        );
    }

    /// @notice Returns effective config for merchant+token; falls back to global if merchant config disabled
    function getEffectiveTokenConfig(
        address merchant,
        address token
    ) public view returns (TokenConfig memory config, bool isMerchantConfig) {
        require(token != address(0), "Invalid token");
        require(merchant != address(0), "Invalid merchant");
        require(supportedTokens[token].enabled, "Token not supported");

        TokenConfig memory mcfg = merchantConfigs[merchant];
        if (mcfg.enabled) {
            return (mcfg, true);
        }
        return (supportedTokens[token], false);
    }

    /// @notice User payment
    /// @param orderId Order ID
    /// @param token Token address
    /// @param to Target recipient account
    /// @param amount Payment amount
    function pay(
        bytes32 orderId,
        address token,
        address to,
        uint256 amount
    ) external whenNotPaused nonReentrant {
        (TokenConfig memory cfg, ) = getEffectiveTokenConfig(to, token);
        require(cfg.enabled, "Token not supported");
        require(amount > 0, "Invalid amount");

        // Transfer from user to this contract (using SafeERC20, calculated by actual received amount)
        uint256 beforeBal = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 afterBal = IERC20(token).balanceOf(address(this));
        uint256 received = afterBal - beforeBal;
        require(received > 0, "No tokens received");

        // Calculate fee (based on actual received amount)
        uint256 calculatedFee = (received * cfg.feeBps) / 10_000;

        // Apply fee ceiling and floor limits
        uint256 fee;
        if (calculatedFee < cfg.minFeeAmount) {
            fee = cfg.minFeeAmount;
        } else if (calculatedFee > cfg.maxFeeAmount && cfg.maxFeeAmount > 0) {
            fee = cfg.maxFeeAmount;
        } else {
            fee = calculatedFee;
        }

        // Ensure fee does not exceed payment amount
        require(fee <= received, "Fee exceeds payment amount");

        uint256 netAmount = received - fee;

        // Transfer to target user
        if (netAmount > 0) {
            IERC20(token).safeTransfer(to, netAmount);
        }

        // Transfer fee to collector address (if exists)
        if (fee > 0) {
            if (feeCollector != address(0)) {
                IERC20(token).safeTransfer(feeCollector, fee);
            }
            // Otherwise, fee remains in contract
        }

        emit Payment(orderId, msg.sender, token, to, amount, fee);
    }

    function refund(
        bytes32 orderId,
        address token,
        address to,
        uint256 amount
    ) external whenNotPaused nonReentrant {
        (TokenConfig memory cfg, ) = getEffectiveTokenConfig(to, token);
        require(cfg.enabled, "Token not supported");
        require(amount > 0, "Invalid amount");

        // Transfer from user to this contract (using SafeERC20, calculated by actual received amount)
        uint256 beforeBal = IERC20(token).balanceOf(to);
        IERC20(token).safeTransferFrom(msg.sender, to, amount);
        uint256 afterBal = IERC20(token).balanceOf(to);
        require(afterBal >= beforeBal, "Unexpected token balance change");

        emit Refund(orderId, msg.sender, token, to, amount);
    }

    /// @notice Withdraw accumulated fees from contract
    /// @param token ERC20 token address
    /// @param to Recipient account
    /// @param amount Withdrawal amount
    function withdrawFees(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid receiver");
        require(amount > 0, "Invalid amount");

        uint256 contractBalance = IERC20(token).balanceOf(address(this));
        require(amount <= contractBalance, "Insufficient contract balance");

        IERC20(token).safeTransfer(to, amount);
        emit FeesWithdrawn(token, to, amount);
    }
}
