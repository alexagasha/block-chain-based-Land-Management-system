const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  console.log("Deploying LandRegistry contract...");
  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  await landRegistry.waitForDeployment(); // ✅ Waits for deployment to finish

  console.log("LandRegistry deployed to:", landRegistry.target);
  return landRegistry.target;
}

main()
  .then((address) => {
    console.log("Deployed contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment Error:", error);
    process.exit(1);
  });
