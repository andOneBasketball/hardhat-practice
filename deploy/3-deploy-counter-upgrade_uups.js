const hre = require("hardhat");
const { network, deployments, ethers } = hre;
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

    console.log(`----------------------------------------------------deployer: ${deployer}`);

    // Deployed address, currently all the same for all chains https://docs.tokenbound.org/contracts/deployments
    // This are V2 contracts, check the latest ones that are used here https://docs.tokenbound.org/contracts/deployments
    const CounterUpgradeUups = await ethers.getContractFactory("CounterUpgradeUups");
    const proxy = await hre.upgrades.deployProxy(CounterUpgradeUups, [777], { initializer: "initialize", signer: deployer, kind: "uups" });
    await proxy.waitForDeployment();
    await proxy.deploymentTransaction().wait(waitBlockConfirmations);
    const proxyAddress = await proxy.getAddress();

    console.log("Proxy address:", proxyAddress);

    const implAddress = await hre.upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation address:", implAddress);

    // ================================
    // 保存到 deployments 目录
    // ================================
    const { save } = deployments;

    // 保存 Proxy
    await save("CounterUpgradeProxy", {
        address: proxyAddress,
        abi: CounterUpgradeUups.interface.formatJson(),
        // 方便查询，记录实现合约地址
        metadata: {
            implementation: implAddress,
        },
    });

    // 保存 Implementation
    await save("CounterUpgradeImplementation", {
        address: implAddress,
        abi: CounterUpgradeUups.interface.formatJson(),
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.EVM_SCAN_API_KEY) {
        console.log("Verifying...");
        await verify(implAddress, []);
    }
};

module.exports.tags = ["all", "counter_upgrade_uups"];
