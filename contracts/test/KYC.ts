import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";
import { KYC } from "../typechain-types";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";
import { sign } from "../sdk/Sign";

const accounts = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;

function wallet(index: number): ethers.HDNodeWallet {
    return ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(accounts.mnemonic), `${accounts.path}/${index}`)
}

describe("KYC", () => {

    describe("Deployment", () => {

        let deployer: ethers.Signer;
        let deployerWallet: ethers.HDNodeWallet;
        let signer: ethers.Signer;
        let signerWallet: ethers.HDNodeWallet;
        let users: ethers.Signer[];

        let KYC: KYC;
        before(async () => {
            [deployer, signer, ...users] = await hre.ethers.getSigners();
            deployerWallet = wallet(0);
            signerWallet = wallet(1);

            const kycFactory = await hre.ethers.getContractFactory("KYC");
            KYC = await kycFactory.deploy(await signer.getAddress(), [await deployer.getAddress()]);
        });

        it("Is KYC", async () => {
            const user0Address = await users[0].getAddress()
            expect(await KYC.getKYC(user0Address)).equal(false);
        });

        it("Set KYC", async () => {
            const user0 = users[0];
            const user0Address = await user0.getAddress()
            const signature = sign(user0Address, signerWallet);
            const tx = await KYC.connect(user0).setKYC(signature);
            await tx.wait();
            expect(await KYC.getKYC(user0Address)).equal(true);
        })

        it("Set Invalid KYC", async () => {
            const user0Address = await users[0].getAddress()
            const signature = sign(user0Address, signerWallet);
            try {
                // Not send by user0, should fail.
                const tx = await KYC.setKYC(signature);
                await tx.wait();
            } catch ({ message }: any) {
                expect(message).equal("VM Exception while processing transaction: reverted with reason string 'not signed by signer'");
            }
        });

        it("Set KYC", async () => {
            const user0Address = await users[0].getAddress()
            const signature = sign(user0Address, signerWallet);
            try {
                // This should not work anymore, since the signer has changed.
                const tx = await KYC.setKYC(signature);
                await tx.wait();
            } catch ({ message }: any) {
                expect(message).equal("VM Exception while processing transaction: reverted with reason string 'not signed by signer'");
            }
        });

        it("Revoke KYC, invalid Signer", async () => {
            try {
                const user0Address = await users[0].getAddress()
                const tx = await KYC.connect(deployer).revokeKYC(user0Address);
                await tx.wait();
            } catch ({ message }: any) {
                expect(message).equal("Transaction reverted without a reason string");
            }
        });

        it("Revoke KYC", async () => {
            const user0Address = await users[0].getAddress()
            const tx = await KYC.connect(signer).revokeKYC(user0Address);
            await tx.wait();
        });
    });

});
