// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CounterUpgradeV2 is Initializable {
    uint256 public number;

    function double() public {
        number = number * 2;
    }
}
