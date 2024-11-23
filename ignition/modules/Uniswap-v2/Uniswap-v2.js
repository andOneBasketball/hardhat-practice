// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Uniswap_v2", (m) => {
    const UniswapV2Factory = m.contract("UniswapV2Factory", ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"]);
    const AirplaneToken = m.contract("AirplaneToken");
    const RocketToken = m.contract("RocketToken");
    const WethToken = m.contract("WethToken");
    return { UniswapV2Factory, AirplaneToken, RocketToken, WethToken };
});
