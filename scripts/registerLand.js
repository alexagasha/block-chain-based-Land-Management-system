const { ethers } = require("hardhat");

async function main() {
    // Replace with your deployed contract address
    const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

    // Get the contract instance
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    const landRegistry = await LandRegistry.attach(contractAddress);

    // Register a new land
    const landId = 1; // Unique ID for the land
    const ownerName = "Agasha";
    const location = "Lira";
    const area = 1000; // Area in square meters

    console.log("Registering land...");
    const tx = await landRegistry.registerLand(landId, ownerName, location, area);
    await tx.wait(); // Wait for the transaction to be mined

    console.log("Land registered successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });