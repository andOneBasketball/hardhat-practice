const hre = require("hardhat");
const { network } = hre;
const { networkConfig } = require("../helper-hardhat-config");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    const automationkContractAddress = "0x6Eca5e95631876c3253AEBB75B3abc7EB447f57f";
    const automationContract = await hre.ethers.getContractAt("AutomationTask", automationkContractAddress);
    
    const fighter = 3;
    /*
    let tx = await automationContract.fight(fighter);
    await tx.wait();
    */
    console.log(`healthPoint[3] ${await automationContract.healthPoint(fighter)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

