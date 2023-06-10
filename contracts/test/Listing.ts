import hre from "hardhat";
import { ethers } from "ethers";
import { Building, ListingContract, EURss } from "../typechain-types";
import { getAllListings } from "../sdk/Listings";
import { expect } from "chai";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";

describe("ListingContract", () => {
  let building: Building;
  let listing: ListingContract;
  let deployerWallet: ethers.HDNodeWallet;
  let signerWallet: ethers.HDNodeWallet;
  before(async () => {
    const ListingsContract = await hre.ethers.getContractFactory(
      "ListingContract"
    );
    listing = await ListingsContract.deploy();
    const EURssFactory = await hre.ethers.getContractFactory("EURss");
    const eurStableCoin = await EURssFactory.deploy("EURss", "EUR");
    const euroAddress = eurStableCoin.getAddress();

    const Building = await hre.ethers.getContractFactory("Building");
    const deployerAddress = (await hre.ethers.getSigners())[0].address;
    building = await Building.deploy("URI", deployerAddress, euroAddress);
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

  it("no listings", async () => {
    expect(await getAllListings(listing)).length(0);
  });

  it("can not list an asset without approval", async () => {
    try {
      const tx = await listing.list(await building.getAddress(), 0, 100, 1);
      await tx.wait();
    } catch ({ message }: any) {
      expect(message).equal(
        "VM Exception while processing transaction: reverted with reason string 'not approved'"
      );
    }
  });

  it("approve", async () => {
    const tx = await building.setApprovalForAll(
      await listing.getAddress(),
      true
    );
    await tx.wait();
  });

  it("list an asset", async () => {
    const tx = await listing.list(await building.getAddress(), 0, 100, 1);
    await tx.wait();
  });

  it("no listings", async () => {
    const ls = await getAllListings(listing);
    expect(ls).length(1);
  });
});
