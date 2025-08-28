const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  await landRegistry.waitForDeployment();

  const deployedAddress = landRegistry.target;
  console.log("Contract deployed to:", deployedAddress);

  // STEP 1: Update backend .env file
  const envPath = path.join(__dirname, "../backend/LandRegistry.env");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const newEnvLine = `LAND_REGISTRY_ADDRESS=${deployedAddress}`;

  // Replace or append the address line
  if (envContent.includes("LAND_REGISTRY_ADDRESS=")) {
    envContent = envContent.replace(/LAND_REGISTRY_ADDRESS=.*/g, newEnvLine);
  } else {
    envContent += `\n${newEnvLine}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log("✅ Updated LandRegistry.env with new contract address.");

  // STEP 2: Copy ABI to backend
  const abiSource = path.join(__dirname, "../artifacts/contracts/LandRegistry.sol/LandRegistry.json");
  const abiDest = path.join(__dirname, "../backend/LandRegistry.json");

  fs.copyFileSync(abiSource, abiDest);
  console.log("✅ Copied ABI to backend/LandRegistry.json");
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
