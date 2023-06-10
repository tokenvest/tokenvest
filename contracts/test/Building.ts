import hre from "hardhat";
import { Building } from "../typechain-types";
import { ethers } from "ethers";
import { getAllListings } from "../sdk/Listings";
import { expect } from "chai";

import { HardhatNetworkHDAccountsConfig } from "hardhat/types";

const accounts = hre.config.networks.hardhat
  .accounts as HardhatNetworkHDAccountsConfig;

function wallet(index: number): ethers.HDNodeWallet {
  return ethers.HDNodeWallet.fromMnemonic(
    ethers.Mnemonic.fromPhrase(accounts.mnemonic),
    `${accounts.path}/${index}`
  );
}

describe("Building", () => {
  let building: Building;
  before(async () => {
    let deployer: ethers.Signer;
    let deployerWallet: ethers.HDNodeWallet;
    let signer: ethers.Signer;
    let signerWallet: ethers.HDNodeWallet;

    const EURssFactory = await hre.ethers.getContractFactory("EURss");
    const eurStableCoin = await EURssFactory.deploy("EURss", "EUR");
    const euroAddress = eurStableCoin.getAddress();

    const Building = await hre.ethers.getContractFactory("Building");
    const deployerAddress = (await hre.ethers.getSigners())[0].address;
    building = await Building.deploy("URI", deployerAddress, [deployerAddress], euroAddress);
    const tx = await building.mint(deployerAddress, 0, 1_000, 0, 0);
    await tx.wait();
  });

  it("no nfts", async () => {
    const supply = await building.getTotalSupply(0);
    expect(supply).to.be.equal(1_000);
  });
});
