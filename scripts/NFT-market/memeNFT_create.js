const hre = require("hardhat");
const { ethers } = require("ethers");

const MemeNFTAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const andOne91Address = "0xde05927035b51C5f6dE27b427e4649123723e141";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const MemeNFT = await hre.ethers.getContractFactory("MemeNFT", deployer);
  const memeNFT = await MemeNFT.attach(MemeNFTAddress);
  // const tokenId = 0;
  
  const tx = await memeNFT.createNFT("ipfs://Qmbm3VebkCN14VFrLcWDg6fyKfbjJjYv37HRxcQmX7NgNu", andOne91Address);
  const receipt = await tx.wait();
  const receiptData = await hre.ethers.provider.getTransactionReceipt(receipt.hash);
  // console.log(JSON.stringify(receiptData));
  // const tokenId = 1;
  // const tokenId = await ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], receiptData.logs[0].data)[0];
  // console.log(`NFT created with tokenId: ${tokenId}, ${await memeNFT.balanceOf(andOne91Address)}`);
  
  console.log(`${await memeNFT.balanceOf(andOne91Address)} ${await memeNFT.tokenURI(0)} ${await memeNFT.tokenURI(1)}`);
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });