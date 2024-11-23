// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WethToken is ERC20 {
    constructor() ERC20("WETH", "WETH") {
        _mint(msg.sender, 100000);
    }
}