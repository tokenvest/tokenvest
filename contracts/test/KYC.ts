import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";
import { KYC } from "../typechain-types";

const signer = ethers.Wallet.createRandom();

function sign(address : string) : ethers.Signature {
    const coder = new ethers.AbiCoder();
    const message = coder.encode(["address"], [address]);
    const msgHash = ethers.keccak256(message);
    const signature = new ethers.SigningKey(signer.privateKey).sign(msgHash);
    return signature;
}

describe("KYC", () => {

    async function deploy() {
        const KYC = await hre.ethers.getContractFactory("KYC");
        const kyc = await KYC.deploy(await signer.getAddress());
        return { kyc };
    }

    describe("Deployment", () => {

        let KYC : KYC;
        before(async () => {
            const { kyc } = await deploy();
            KYC = kyc;
        });

        it("Is KYC", async () => {
            const [ account0 ] = await hre.ethers.getSigners();
            const address0 = await account0.getAddress();
            expect(await KYC.isKYC(address0)).equal(false);
        });

        it("Set KYC", async () => {
            const [ account0 ] = await hre.ethers.getSigners();
            const address0 = await account0.getAddress();
            const signature = sign(address0);
            const tx = await KYC.setKYC(signature);
            await tx.wait();
            expect(await KYC.isKYC(address0)).equal(true);
        })

        it("Set Invalid KYC", async () => {
            const [ _, account1 ] = await hre.ethers.getSigners();
            const address1 = await account1.getAddress();
            const signature = sign(address1);
            try {
                const tx = await KYC.setKYC(signature);
                await tx.wait();
            } catch ({ message } : any) {
                expect(message).equal("VM Exception while processing transaction: reverted with reason string 'not signed by signer'");
            }
        });
    });

});
