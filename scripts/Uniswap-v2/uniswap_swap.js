const hre = require("hardhat");
const { ethers } = require("ethers");

const AirplaneTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RocketTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const UniswapV2FactoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";


async function main() {
  const [deployer, account1, account2] = await hre.ethers.getSigners();

  const token0 = RocketTokenAddress > AirplaneTokenAddress ? AirplaneTokenAddress : RocketTokenAddress
  const token1 = RocketTokenAddress > AirplaneTokenAddress ? RocketTokenAddress : AirplaneTokenAddress;
  tokenHash = ethers.solidityPackedKeccak256(["address", "address"], [token0, token1]);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  pair = ethers.getCreate2Address(UniswapV2FactoryAddress, tokenHash, ethers.keccak256(UniswapV2Pair.bytecode));
  const uniswapV2Pair = await UniswapV2Pair.attach(pair);
  console.log(`Pair address: ${JSON.stringify(pair)}`);

  const RocketToken = await hre.ethers.getContractFactory("RocketToken", deployer);
  const rocketToken = await RocketToken.attach(RocketTokenAddress);
  const AirplaneToken = await hre.ethers.getContractFactory("AirplaneToken", deployer);
  const airplaneToken = await AirplaneToken.attach(AirplaneTokenAddress);

  const [reserve0, reserve1] = await uniswapV2Pair.getReserves();
  console.log(`${deployer.address} balace: ${await uniswapV2Pair.balanceOf(deployer.address)}, reverse0: ${reserve0}, reverse1: ${reserve1}`);
  
  //await rocketToken.transfer(pair, 1000);
  console.log(`RT balance: ${await rocketToken.balanceOf(deployer.address)}, account1: ${account1.address}`);

  await uniswapV2Pair.swap(886, 0, account2, Buffer.from(""))
  console.log(`RT balance: ${await rocketToken.balanceOf(deployer.address)}, account1: ${account2.address}, APT balance: ${await airplaneToken.balanceOf(account2.address)}, RT balance: ${await rocketToken.balanceOf(account2.address)}`)

  const [reserve2, reserve3] = await uniswapV2Pair.getReserves();
  console.log(`after swap, reverse0: ${reserve2}, reverse1: ${reserve3}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });