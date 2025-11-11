// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CounterUpgradeUups is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 public number;

    function initialize(uint256 initValue) public initializer {
        number = initValue;
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    // 授权升级，必须实现
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    function decrement() public {
        number--;
    }
}
