// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RwaToken is ERC20, Ownable {
    uint256 public sharesFactor;

    constructor() ERC20("RWA Token", "RWAT") Ownable(msg.sender) {
        _mint(msg.sender, 1e28);
        _mint(0xde05927035b51C5f6dE27b427e4649123723e141, 1e2);
        _mint(0x5639Bc2D96c7bA37EECA625599B183241A2bBE6c, 1e2);

        sharesFactor = 1e18;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return (super.balanceOf(account) * sharesFactor) / 1e18;
    }

    function adjustSharesFactor(uint256 newSharesFactor) external onlyOwner {
        require(newSharesFactor > 0, "Shares factor must be positive");

        sharesFactor = newSharesFactor;
    }
}
