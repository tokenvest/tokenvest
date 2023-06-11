import hre from "hardhat";
import { EURss } from "../typechain-types";
import { expect } from "chai";
import { ethers } from "ethers";

describe("EURss", () => {
    let deployer: ethers.Signer;

    before(async () => {
        [deployer] = await hre.ethers.getSigners();
    });

    let EURss: EURss;
    it("Deploy EURss", async () => {
        const eurFactory = await hre.ethers.getContractFactory("EURss");
        EURss = await eurFactory.deploy();
        expect(await EURss.balanceOf(deployer.address)).to.be.equal(BigInt(1e12) * BigInt(1e18));
    });
});