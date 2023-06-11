import hre from "hardhat";
import { ethers } from "ethers";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";
import { EURss, MultiSigToken, Listings, PayoutSettlementContract } from "../typechain-types";
import { expect } from "chai";
import { sign } from "../sdk/Sign";

const accounts = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;

function wallet(index: number): ethers.HDNodeWallet {
    return ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(accounts.mnemonic), `${accounts.path}/${index}`)
}

describe("Happy Flow", () => {

    let deployer: ethers.Signer;
    let signer: ethers.Signer;
    let signerWallet: ethers.HDNodeWallet;
    let multiSig: ethers.Signer[];
    let users: ethers.Signer[];

    before(async () => {
        [deployer, signer, ...users] = await hre.ethers.getSigners();
        signerWallet = wallet(1);
        expect(signer.address).to.be.equal(signerWallet.address);
        multiSig = users.slice(0, 2);
        users = users.slice(2);
    });

    let EURss: EURss;
    it("Deploy EURss", async () => {
        const eurFactory = await hre.ethers.getContractFactory("EURss");
        EURss = await eurFactory.deploy();
        expect(await EURss.balanceOf(deployer.address)).to.be.equal(BigInt(1e12) * BigInt(1e18));
    });

    let MultiSigToken: MultiSigToken;
    it("Deploy MultiSigToken", async () => {
        const multiSigTokenFactory = await hre.ethers.getContractFactory("MultiSigToken");
        MultiSigToken = await multiSigTokenFactory.deploy("URI", signer.address, multiSig.map(s => s.address), await EURss.getAddress(), 2);
        expect(await MultiSigToken.nConfirmations()).to.be.equal(2);
    });

    const requestIndex: bigint = 0n;
    it("Submit Create Token", async () => {
        const tx = await MultiSigToken.connect(multiSig[0]).submitMintRequest(multiSig[1].address, 1_000, 1_000_000_000_000_000_000n, 180_000_000_000_000_000n);
        await tx.wait();
    });
    it("All Sign Create Token", async () => {
        for (signer of multiSig) {
            const tx = await MultiSigToken.connect(signer).signMintRequest(requestIndex);
            await tx.wait();
        }
    });
    it("Mint Create Token", async () => {
        const tx = await MultiSigToken.connect(multiSig[0]).mint(requestIndex);
        await tx.wait();
    });
    it("Get Balance", async () => {
        expect(await MultiSigToken.balanceOf(multiSig[1].address, requestIndex)).to.be.equal(1_000);
    });

    let Listings: Listings;
    it("Deploy Listings", async () => {
        const listingsFactory = await hre.ethers.getContractFactory("Listings");
        Listings = await listingsFactory.deploy();
    });

    const listingIndex: bigint = 0n;
    it("Approve Listings", async () => {
        const tx = await MultiSigToken.connect(multiSig[1]).setApprovalForAll(await Listings.getAddress(), true);
        await tx.wait();
    });
    it("List", async () => {
        const tx = await Listings.connect(multiSig[1]).list(await MultiSigToken.getAddress(), requestIndex, 100, 2_000_000_000_000_000_000n);
        await tx.wait();
    });
    it("Get Listing", async () => {
        const listing = await Listings.listings(listingIndex);
        expect(listing.seller).to.be.equal(multiSig[1].address);
        expect(listing.token).to.be.equal(await MultiSigToken.getAddress());
        expect(listing.id).to.be.equal(listingIndex);
        expect(listing.unitsAvailable).to.be.equal(100);
        expect(listing.unitPrice).to.be.equal(2_000_000_000_000_000_000n);
    });

    it("KYC MS1", async () => {
        const signature = sign(multiSig[1].address, signerWallet);
        const tx = await MultiSigToken.connect(multiSig[1]).setKYC(signature);
        await tx.wait();
    });

    it("KYC User0", async () => {
        const signature = sign(users[0].address, signerWallet);
        const tx = await MultiSigToken.connect(users[0]).setKYC(signature);
        await tx.wait();
    });

    it("Give User0 EURss", async () => {
        const tx = await EURss.connect(deployer).transfer(users[0].address, 100_000_000_000_000_000_000n);
        await tx.wait();
    });

    it("Give Listings Allowance", async () => {
        const tx = await EURss.connect(users[0]).approve(await Listings.getAddress(), 100_000_000_000_000_000_000n);
        await tx.wait();
    });

    it("Buy Token", async () => {
        const tx = await Listings.connect(users[0]).buy(listingIndex, 10);
        await tx.wait();
    });

    it("Get Balances", async () => {
        { // MS1 : Token
            const balance = await MultiSigToken.balanceOf(multiSig[1].address, requestIndex);
            expect(balance).to.be.equal(990);
        }
        { // MS1 : EURss
            const balance = await EURss.balanceOf(multiSig[1].address);
            expect(balance).to.be.equal(20_000_000_000_000_000_000n);
        }
        { // User0 : Token
            const balance = await MultiSigToken.balanceOf(users[0].address, requestIndex);
            expect(balance).to.be.equal(10);
        }
        { // User0 : EURss
            const balance = await EURss.balanceOf(users[0].address);
            expect(balance).to.be.equal(80_000_000_000_000_000_000n);
        }
    });

    let PayoutSettlement: PayoutSettlementContract;
    it("Deploy Payout Settlement", async () => {
        const payoutSettlementFactory = await hre.ethers.getContractFactory("PayoutSettlementContract");
        PayoutSettlement = await payoutSettlementFactory.deploy(await MultiSigToken.getAddress());
    });

    it("Approve Payout Settlement", async () => {
        const tx = await EURss.approve(await PayoutSettlement.getAddress(), 2_000_000_000_000_000_000_000n);
        await tx.wait();
    });

    it("Set NFT as Sold", async () => {
        const tx = await PayoutSettlement.setNFTasSold(requestIndex);
        await tx.wait();
    });

    it("Check Payout Settlement Balance", async () => {
        const balance = await EURss.balanceOf(await PayoutSettlement.getAddress());
        expect(balance).to.be.equal(1_180_000_000_000_000_000_000n);
    });

    it("KYC Payment Settlement", async () => {
        const tx = await MultiSigToken.connect(multiSig[0]).setKYCByOwner(await PayoutSettlement.getAddress());
        await tx.wait();
    });

    it("Approve Payment Settlement", async () => {
        const tx = await MultiSigToken.connect(users[0]).setApprovalForAll(await PayoutSettlement.getAddress(), true);
        await tx.wait();
    });

    it("Claim Yield", async () => {
        const tx = await PayoutSettlement.connect(users[0]).withdrawFunds(requestIndex);
        await tx.wait();
    });

    it("Check Payout Settlement Balance", async () => {
        {
            const balance = await EURss.balanceOf(users[0].address);
            expect(balance).to.be.equal(91_800_000_000_000_000_000n);
        }
    });

});
