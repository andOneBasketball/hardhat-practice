const hre = require("hardhat");
const { ethers } = require("ethers");

const AirplaneTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RocketTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const UniswapV2Router01Address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const UniswapV2FactoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const [deployer, deployer2] = await hre.ethers.getSigners();

  // Get the contract factory from node_modules
  const UniswapV2Router01 = await hre.ethers.getContractFactory("UniswapV2Router01", deployer);
  const uniswapV2Router01 = await UniswapV2Router01.attach(UniswapV2Router01Address);

  const AirplaneToken = await hre.ethers.getContractFactory("AirplaneToken", deployer);
  const airplaneToken = await AirplaneToken.attach(AirplaneTokenAddress);
  //await airplaneToken.transfer(deployer2.address, 1000);
  const RocketToken = await hre.ethers.getContractFactory("RocketToken", deployer);
  const rocketToken = await RocketToken.attach(RocketTokenAddress);
  //await rocketToken.transfer(deployer2.address, 5000);
  const token0 = RocketTokenAddress > AirplaneTokenAddress ? AirplaneTokenAddress : RocketTokenAddress
  const token1 = RocketTokenAddress > AirplaneTokenAddress ? RocketTokenAddress : AirplaneTokenAddress;
  
  console.log(`${deployer.address} APT balance: ${await airplaneToken.balanceOf(deployer.address)}, RT balance: ${await rocketToken.balanceOf(deployer.address)}, balanced ${await hre.ethers.provider.getBalance(deployer.address)}`);
  console.log(`${deployer2.address} APT balance: ${await airplaneToken.balanceOf(deployer2.address)}, RT balance: ${await rocketToken.balanceOf(deployer2.address)}, balanced ${await hre.ethers.provider.getBalance(deployer2.address)}`);
  //process.exit();


  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  tokenHash = ethers.solidityPackedKeccak256(["address", "address"], [token0, token1]);
  pair = ethers.getCreate2Address(UniswapV2FactoryAddress, tokenHash, ethers.keccak256(UniswapV2Pair.bytecode));
  /*
    设置交易细节
    const options = { gasLimit: 1000 };
 */
  await airplaneToken.approve(UniswapV2Router01Address, 2000);
  await rocketToken.approve(UniswapV2Router01Address, 5000);
  //const tx = await uniswapV2Router01.addLiquidity(token0, token1, 2000, 5000, 2000, 5000, deployer.address, 1739798879);
  //const receipt = await tx.wait();
  //console.log(`Add liquidity tx: ${JSON.stringify(receipt)}`);
  //const receiptData = await hre.ethers.provider.getTransactionReceipt(receipt.hash);
  //console.log(`Add liquidity tx data: ${JSON.stringify(receiptData)}`)
  const uniswapV2Pair = await UniswapV2Pair.attach(pair);
  console.log(`Pair address: ${pair}, token0: ${token0}, token1: ${token1}, UNI-V2 balance: ${await uniswapV2Pair.balanceOf(deployer.address)}`);

  //用户参与进行swap交易
  //await airplaneToken.connect(deployer2).approve(UniswapV2Router01Address, 100);
  //const swapTx = await uniswapV2Router01.connect(deployer2).swapExactTokensForTokens(100, 200, [token0, token1], deployer2.address, 1739798879);
  //await swapTx.wait();
  console.log(`${deployer2.address} APT balance: ${await airplaneToken.balanceOf(deployer2.address)}, RT balance: ${await rocketToken.balanceOf(deployer2.address)}, balanced ${await hre.ethers.provider.getBalance(deployer2.address)}`);
  console.log(`${deployer.address} UNI-V2 balance: ${await uniswapV2Pair.balanceOf(deployer.address)}, ${deployer2.address} UNI-V2 balance: ${await uniswapV2Pair.balanceOf(deployer2.address)}`);
  console.log(`${uniswapV2Pair.target} APT balance: ${await airplaneToken.balanceOf(uniswapV2Pair.target)}, RT balance: ${await rocketToken.balanceOf(uniswapV2Pair.target)}`);

  //移除流动性
  //await uniswapV2Pair.connect(deployer).approve(UniswapV2Router01Address, 5324);
  //const tx = await uniswapV2Router01.removeLiquidity(token0, token1, 5324, 3000, 6000, deployer.address, 1739798879);
  //await tx.wait();
  //console.log(`${deployer.address} APT balance: ${await airplaneToken.balanceOf(deployer.address)}, RT balance: ${await rocketToken.balanceOf(deployer.address)}, UNI-V2 balance: ${await uniswapV2Pair.balanceOf(deployer.address)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
