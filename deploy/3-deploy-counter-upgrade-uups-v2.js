const hre = require("hardhat");
const { network } = hre;
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS, upgradeProxy } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;
    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

    console.log(`----------------------------------------------------deployer: ${deployer}, Deploying to chainId ${chainId}`);

    // 先导入原始合约，让 upgrades 插件能正确跟踪代理
    const CounterUpgradeUups = await hre.ethers.getContractFactory("CounterUpgradeUups");
    await hre.upgrades.forceImport(upgradeProxy[chainId].counterUpgradeUups, CounterUpgradeUups);

    // 然后用新合约进行升级
    const CounterUpgradeUupsV2 = await hre.ethers.getContractFactory("CounterUpgradeUupsV2");
    // do the upgrade
    const tx = await hre.upgrades.upgradeProxy(upgradeProxy[chainId].counterUpgradeUups, CounterUpgradeUupsV2, [77], {kind: "uups"});

    // wait tx mined + wait X blocks
    await tx.deployTransaction.wait(waitBlockConfirmations);

    console.log(`Proxy address: ${upgradeProxy[chainId].counterUpgradeUups}`);

    const implAddress = await hre.upgrades.erc1967.getImplementationAddress(upgradeProxy[chainId].counterUpgradeUups);
    console.log("Implementation address:", implAddress);

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.EVM_SCAN_API_KEY) {
        console.log("Verifying...");
        await verify(implAddress, []);
    }
};

module.exports.tags = ["all", "counter_upgrade_uups_v2"];
