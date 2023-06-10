import hre from "hardhat";
import { Building } from "../typechain-types";
import { getAllListings } from "../sdk/Listings";
import { expect } from "chai";

describe("Builder", () => {
  let building: Building;
  before(async () => {
    const Building = await hre.ethers.getContractFactory("Building");
    building = await Building.deploy("URI");
    const deployerAddress = (await hre.ethers.getSigners())[0].address;
    const tx = await building.mint(
      deployerAddress,
      0,
      1_000,
      new Uint8Array(),
      1_000,
      0,
      0
    );
    await tx.wait();
  });

  it("no nfts", async () => {
    const supply = await building.getTotalSupply(0);
    expect(supply).to.be.equal(1000);
  });
});
