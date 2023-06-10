import hre from "hardhat";
import { Building } from "../typechain-types";
import { PayoutSettlementContract } from "../typechain-types";
import { ethers } from "ethers";
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

describe("PayoutSettlementContract", () => {
  let settlement: PayoutSettlementContract;
  before(async () => {
    let deployer: ethers.Signer;
    let deployerWallet: ethers.HDNodeWallet;
    let signer: ethers.Signer;
    let signerWallet: ethers.HDNodeWallet;

    const PayoutSettlementContractFactory = await hre.ethers.getContractFactory(
      "Building"
    );

    const EURssFactory = await hre.ethers.getContractFactory("EURss");
    const eurStableCoin = await EURssFactory.deploy("EURss", "EUR");
    const euroAddress = eurStableCoin.getAddress();

    const Building = await hre.ethers.getContractFactory("Building");
    const deployerAddress = (await hre.ethers.getSigners())[0].address;
    const building = await Building.deploy("URI", deployerAddress, euroAddress);
    const buildingAddress = building.getAddress();

    const payoutsettlementContractFactory = await hre.ethers.getContractFactory(
      "PayoutSettlementContract"
    );
    const settlementContract = await payoutsettlementContractFactory.deploy(
      buildingAddress
    );
  });
});
