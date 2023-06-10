import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";
import { KYC } from "../typechain-types";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";

const accounts = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;

function wallet(index: number): ethers.HDNodeWallet {
    return ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(accounts.mnemonic), `${accounts.path}/${index}`)
}

function sign(address: string, signer: ethers.HDNodeWallet): ethers.Signature {
    const coder = new ethers.AbiCoder();
    const message = coder.encode(["address"], [address]);
    const msgHash = ethers.keccak256(message);
    const signature = new ethers.SigningKey(signer.privateKey).sign(msgHash);
    return signature;
}

describe("KYC", () => {

    async function deploy(signer: ethers.Signer) {
        const KYC = await hre.ethers.getContractFactory("KYC");
        const kyc = await KYC.deploy(await signer.getAddress());
        return { kyc };
    }

    describe("Deployment", () => {

        let deployer: ethers.Signer;
        let deployerWallet: ethers.HDNodeWallet;
        let signer: ethers.Signer;
        let signerWallet: ethers.HDNodeWallet;
        let users: ethers.Signer[];

        let KYC: KYC;
        before(async () => {
            let _: ethers.Signer;
            [deployer, signer, ...users] = await hre.ethers.getSigners();
            deployerWallet = wallet(0);
            signerWallet = wallet(1);

            const { kyc } = await deploy(signer);
            KYC = kyc;
        });

        it("Check Owner", async () => {
            expect(await KYC.owner()).equal(await deployer.getAddress());
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

        it("Change Signer", async () => {
            // Set deployer as signer.
            const deployerAddress = await deployer.getAddress();
            const tx = await KYC.setSignerAddress(deployerAddress);
            await tx.wait();
        });

        // NOTE: use the deployer as signer!

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
                const tx = await KYC.connect(signer).revokeKYC(user0Address);
                await tx.wait();
            } catch ({ message }: any) {
                expect(message).equal("Transaction reverted without a reason string");
            }
        });

        it("Revoke KYC", async () => {
            const user0Address = await users[0].getAddress()
            const tx = await KYC.connect(deployer).revokeKYC(user0Address);
            await tx.wait();
        });
    });

});
