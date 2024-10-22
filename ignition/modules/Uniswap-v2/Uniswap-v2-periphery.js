// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Uniswap_v2_periphery", (m) => {
    const AirplaneTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const RocketTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const UniswapV2FactoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const ExampleOracleSimple = m.contract("ExampleOracleSimple", [UniswapV2FactoryAddress, AirplaneTokenAddress, RocketTokenAddress]);
    return { ExampleOracleSimple };
});
