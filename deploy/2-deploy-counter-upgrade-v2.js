const hre = require("hardhat");
const { network } = hre;
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS, upgradeProxy } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

    console.log(`----------------------------------------------------deployer: ${deployer}`);

    // Deployed address, currently all the same for all chains https://docs.tokenbound.org/contracts/deployments
    // This are V2 contracts, check the latest ones that are used here https://docs.tokenbound.org/contracts/deployments
    const CounterUpgradeV2 = await hre.ethers.getContractFactory("CounterUpgradeV2");
    // do the upgrade
    const tx = await hre.upgrades.upgradeProxy(upgradeProxy.counterUpgrade, CounterUpgradeV2);

    // wait tx mined + wait X blocks
    await tx.deployTransaction.wait(waitBlockConfirmations);

    console.log(`Proxy address: ${upgradeProxy.counterUpgrade}`);

    const implAddress = await hre.upgrades.erc1967.getImplementationAddress(upgradeProxy.counterUpgrade);
    console.log("Implementation address:", implAddress);

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.EVM_SCAN_API_KEY) {
        console.log("Verifying...");
        await verify(implAddress, []);
    }
};

module.exports.tags = ["all", "counter_upgrade_v2"];
