// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CounterUpgradeUupsV2 is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 public number;

    function initialize(uint256 initValue) public reinitializer(2) {
        // 这一行必须存在，以通过静态检查，并依赖 Ownable 内部的 onlyInitializing 保护。
        // 如果插件版本同步，运行时不会失败。
        __Ownable_init(msg.sender);
        number = initValue;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    // 新增功能
    function multiply(uint256 factor) public {
        number *= factor;
    }
}
