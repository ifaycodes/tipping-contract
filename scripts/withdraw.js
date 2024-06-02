const hre = require("hardhat");
const { ethers } = require("ethers");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");
require('dotenv').config();

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return ethers.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress="0xF8908B040F78d6C9d0bB178B5934581A021B87CA";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new ethers.providers.AlchemyProvider("sepolia", process.env.SEPOLIA_RPC_URL);

  // Ensure that signer is the SAME address as the original contract deployer,
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instantiate connected contract.
  const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeACoffee.target);
  console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.target), "ETH");

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
