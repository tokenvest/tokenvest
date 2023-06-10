import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { ethers } from "ethers";

require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia-mainnet.g.alchemy.com/v2/your-api-key";
let PRIVATE_KEY: string = "";
if (!process.env.PRIVATE_KEY) {
  console.error("Private key not set!");
} else {
  PRIVATE_KEY = process.env.PRIVATE_KEY;
}

let MNEMONIC: string = "";
if (!process.env.MNEMONIC) {
  console.error("Mnemonic not set!");
} else {
  MNEMONIC = process.env.MNEMONIC;
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: process.env.MNEMONIC ? { mnemonic: MNEMONIC } : {},
    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user1: {
      default: 1,
    },
    user2: {
      default: 2,
    },
  },
};

export default config;
