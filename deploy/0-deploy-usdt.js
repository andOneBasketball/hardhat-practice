const hre = require("hardhat");
const { network } = hre;
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

    console.log(`----------------------------------------------------deployer: ${deployer}`);

    // Deployed address, currently all the same for all chains https://docs.tokenbound.org/contracts/deployments
    // This are V2 contracts, check the latest ones that are used here https://docs.tokenbound.org/contracts/deployments
    const usdt = await deploy("UsdtToken", {
        from: deployer,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });
    console.log("UsdtToken address " + usdt.address);
    const Contract = await hre.ethers.getContractFactory("UsdtToken");
    const contract = await Contract.attach(usdt.address);
    
    console.log(`Token name: ${await contract.name()}, symbol: ${await contract.symbol()}, decimals: ${await contract.decimals()}`);

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.EVM_SCAN_API_KEY) {
        console.log("Verifying...");
        await verify(usdt.address, []);
    }
};

module.exports.tags = ["all", "usdt"];
