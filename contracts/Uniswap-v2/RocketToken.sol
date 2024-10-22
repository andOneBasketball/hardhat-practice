// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RocketToken is ERC20 {
    constructor() ERC20("Rocket Token", "RT") {
        _mint(msg.sender, 100000);
    }
}