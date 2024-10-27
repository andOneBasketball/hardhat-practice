const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const ExampleOracleSimpleAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

async function main() {
  const ExampleOracleSimple = await hre.ethers.getContractFactory("ExampleOracleSimple");
  const exampleOracleSimple = await ExampleOracleSimple.attach(ExampleOracleSimpleAddress);

  let block = await hre.ethers.provider.getBlock("latest");  
  // 打印当前区块的时间戳  
  console.log("Current block timestamp:", block.timestamp);


  await time.increaseTo((await time.latest()) + 24*60*60);
  await exampleOracleSimple.update();
  block = await hre.ethers.provider.getBlock("latest");
  console.log(`block timestamp: ${block.timestamp}, price0Average ${await exampleOracleSimple.price0Average()}, price1Average ${await exampleOracleSimple.price1Average()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });