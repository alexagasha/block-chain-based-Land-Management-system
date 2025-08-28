const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
    let LandRegistry, landRegistry, owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        LandRegistry = await ethers.getContractFactory("LandRegistry");
        landRegistry = await LandRegistry.deploy(); // No need for .deployed()
    });

    it("Should register a new land", async function () {
        await landRegistry.registerLand(1, "Alice", "New York", 1000);
        const land = await landRegistry.getLandDetails(1);

        expect(land.id).to.equal(1);
        expect(land.ownerName).to.equal("Alice");
        expect(land.location).to.equal("New York");
        expect(land.area).to.equal(1000);
        expect(land.isRegistered).to.equal(true);
    });

    it("Should not allow duplicate land registration", async function () {
        await landRegistry.registerLand(1, "Alice", "New York", 1000);
        await expect(landRegistry.registerLand(1, "Bob", "Los Angeles", 2000)).to.be.revertedWith(
            "Land is already registered."
        );
    });
});