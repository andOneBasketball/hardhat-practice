const hre = require("hardhat");
const { ethers } = require("ethers");

const AirplaneTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RocketTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const UniswapV2FactoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Get the contract factory from node_modules
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory", deployer);
  const uniswapFactory = await UniswapV2Factory.attach(UniswapV2FactoryAddress);

  const AirplaneToken = await hre.ethers.getContractFactory("AirplaneToken", deployer);
  const airplaneToken = await AirplaneToken.attach(AirplaneTokenAddress);
  const RocketToken = await hre.ethers.getContractFactory("RocketToken", deployer);
  const rocketToken = await RocketToken.attach(RocketTokenAddress);
  const token0 = RocketTokenAddress > AirplaneTokenAddress ? AirplaneTokenAddress : RocketTokenAddress
  const token1 = RocketTokenAddress > AirplaneTokenAddress ? RocketTokenAddress : AirplaneTokenAddress;
  
  console.log(`${deployer.address} APT balance: ${await airplaneToken.balanceOf(deployer.address)}, RT balance: ${await rocketToken.balanceOf(deployer.address)}, balanced ${await hre.ethers.provider.getBalance(deployer.address)}, AirplaneToken contract address: ${airplaneToken.target}, RocketToken contract address: ${rocketToken.target}, uniswapFactory contract address: ${uniswapFactory.target}, uniswapFactory owner: ${await uniswapFactory.feeTo()}`);
  //process.exit();

  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  console.log(`${ethers.keccak256(UniswapV2Pair.bytecode)}`);
  let pair = "";
  try {
    /*
    设置交易细节
    const options = { gasLimit: 1000 };
    const tx = await uniswapFactory.createPair(airplaneToken.target, rocketToken.target, options);
    */
    const tx = await uniswapFactory.createPair(airplaneToken.target, rocketToken.target);
    // 等待交易完成
    const receipt = await tx.wait();
    const receiptData = await hre.ethers.provider.getTransactionReceipt(receipt.hash);
    // 注意不同版本间 ethers.AbiCoder.defaultAbiCoder().decode 的使用方法存在差异
    pair = await ethers.AbiCoder.defaultAbiCoder().decode(["address"], receiptData.logs[0].data)[0];
  } catch (error) {
    if (error.message.includes("UniswapV2: PAIR_EXISTS")) {
      
      tokenHash = ethers.solidityPackedKeccak256(["address", "address"], [token0, token1]);
      pair = ethers.getCreate2Address(uniswapFactory.target, tokenHash, ethers.keccak256(UniswapV2Pair.bytecode));
    }
  }
  console.log(`Pair address: ${JSON.stringify(pair)}`);
  
  const uniswapV2Pair = await UniswapV2Pair.attach(pair);
  const [reverse0, reverse1] = await uniswapV2Pair.getReserves();
  const totalSupply = await uniswapV2Pair.totalSupply();
  console.log(`Pair reserves: RocketToken ${reverse0}, AirplaneToken ${reverse1}, totalSupply ${totalSupply}`);

  await rocketToken.transfer(pair, 2000);
  await airplaneToken.transfer(pair, 2000);
  await uniswapV2Pair.mint(deployer.address);

  console.log(`${deployer.address} APT balance: ${await airplaneToken.balanceOf(deployer.address)}, RT balance: ${await rocketToken.balanceOf(deployer.address)}, UNI-V2 balance: ${await uniswapV2Pair.balanceOf(deployer.address)}, balanced ${await hre.ethers.provider.getBalance(deployer.address)}, price0CumulativeLast ${await uniswapV2Pair.price0CumulativeLast()}, price1CumulativeLast ${await uniswapV2Pair.price1CumulativeLast()}, kLast ${await uniswapV2Pair.kLast()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
