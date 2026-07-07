// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UsdcToken is ERC20 {
    constructor() ERC20("USDC Token", "USDC") {
        _mint(msg.sender, 1e28);
        _mint(0x580Dc4A16E189dB5163fE662a93E8C488Fe0e53E, 1e10);
        _mint(0x811d3CD275CE38b8E3835eb843280048598549e3, 1e10);
        _mint(0x2F996Af8679dCfeD27f2Bd056e8575567bb58575, 1e10);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
