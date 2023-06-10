import { ethers } from "ethers";

export function sign(address: string, signer: ethers.HDNodeWallet): ethers.Signature {
    const coder = new ethers.AbiCoder();
    const message = coder.encode(["address"], [address]);
    const msgHash = ethers.keccak256(message);
    const signature = new ethers.SigningKey(signer.privateKey).sign(msgHash);
    return signature;
}
