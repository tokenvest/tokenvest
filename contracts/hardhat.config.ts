import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

let mnemonic: string = "";
if (!process.env.MNEMONIC) {
  console.error("Mnemonic not set!");
} else { mnemonic = process.env.MNEMONIC };

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      accounts: process.env.MNEMONIC ? { mnemonic: mnemonic } : {}
    },
  }
};

export default config;
