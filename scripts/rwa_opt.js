const hre = require("hardhat");
const { parseUnits } = require("ethers");
const { network } = hre;
const { networkConfig } = require("../helper-hardhat-config");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    const automationkContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const automationContract = await hre.ethers.getContractAt("RwaToken", automationkContractAddress);

    console.log(`balance: ${await automationContract.balanceOf("0xde05927035b51C5f6dE27b427e4649123723e141")}, ${await automationContract.balanceOf("0x5639Bc2D96c7bA37EECA625599B183241A2bBE6c")}, ${await automationContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")}`);

    const sharesFactor = parseUnits("5", 17);
    const tx = await automationContract.adjustSharesFactor(sharesFactor);
    // 等待交易完成
    await tx.wait();

    console.log(`balance: ${await automationContract.balanceOf("0xde05927035b51C5f6dE27b427e4649123723e141")}, ${await automationContract.balanceOf("0x5639Bc2D96c7bA37EECA625599B183241A2bBE6c")}, ${await automationContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

