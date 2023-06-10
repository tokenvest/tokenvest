import hre from "hardhat";
import { Building, ListingContract } from "../typechain-types";
import { getAllListings } from "../sdk/Listings";
import { expect } from "chai";
import { ethers } from "ethers";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";
import { sign } from "../sdk/Sign";

const accounts = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;

function wallet(index: number): ethers.HDNodeWallet {
    return ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(accounts.mnemonic), `${accounts.path}/${index}`)
}

describe("ListingContract", () => {

    let deployer: ethers.Signer;
    let deployerWallet: ethers.HDNodeWallet;
    let users: ethers.Signer[];

    let building: Building;
    let listing: ListingContract;

    before(async () => {
        [deployer, ...users] = await hre.ethers.getSigners();
        deployerWallet = wallet(0);

        const ListingsContract = await hre.ethers.getContractFactory("ListingContract");
        listing = await ListingsContract.deploy();

        const Building = await hre.ethers.getContractFactory("Building");
        const deployerAddress = await deployer.getAddress();
        building = await Building.deploy("URI", deployerAddress);
        const tx = await building.mint(deployerAddress, 0, 1_000, new Uint8Array(), 1_000, 0, 0);
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
            expect(message).equal("VM Exception while processing transaction: reverted with reason string 'not approved'");
        }
    });

    it("approve", async () => {
        const tx = await building.setApprovalForAll(await listing.getAddress(), true);
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

    it("buy 1, not KYCed", async () => {
        try {
            const tx = await listing.buy(0, 1);
            await tx.wait();
        } catch ({ message }: any) {
            expect(message).equal("VM Exception while processing transaction: reverted with reason string 'not KYCed'");
        }
    });

    it("KYC", async () => {
        {
            const tx = await building.setKYC(sign(await deployer.getAddress(), deployerWallet));
            await tx.wait();
        }
        {
            const user0 = users[0];
            const user0Address = await user0.getAddress()
            const tx = await building.connect(user0).setKYC(sign(user0Address, deployerWallet));
            await tx.wait();
        }
    });

    it("buy 1", async () => {
        const value = await listing.cost(0, 1);
        const user0 = users[0];
        const tx = await listing.connect(user0).buy(0, 1, { value });
        await tx.wait();
    });
})