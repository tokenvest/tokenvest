import { expect } from "chai";
import { ethers } from "hardhat";

describe("Building", () => {

    async function deploy() {
        const Building = await ethers.getContractFactory("Building");
        const building = await Building.deploy();
        return { building };
    }

    describe("Deployment", () => {
        it("", async () => {
            const [owner] = await ethers.getSigners();
            const { building } = await deploy();
            expect(await building.balanceOf(await owner.getAddress(), 0)).equal(0);
        });
    });

});
