// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Uniswap_v2", (m) => {
    const UniswapV2FactoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const WethTokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const UniswapV2Router01 = m.contract("UniswapV2Router01", [UniswapV2FactoryAddress, WethTokenAddress]);
    return { UniswapV2Router01 };
});
