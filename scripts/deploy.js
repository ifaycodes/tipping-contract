
const {network, ethers} = require("hardhat");
//const { verify } = require("../utils/verify")
require("dotenv").config()

async function main() {
  // We get the contract to deploy.
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  await buyMeACoffee.deploymentTransaction().wait(6);

  console.log("BuyMeACoffee deployed to:", buyMeACoffee.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
