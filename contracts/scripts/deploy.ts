import { ethers } from "hardhat";
import { readFileSync, writeFileSync } from "fs";

type Config = {
    eurAddress: string;
    multiSigTokenAddress: string;
    listingsAddress: string;
    payoutSettlementAddress: string;
};

function loadConfig(): Config {
    const raw = readFileSync("scripts/config.json", "utf8");
    return JSON.parse(raw);
}

// npx hardhat run scripts/deploy.ts --network sepolia
async function main() {
    const config = loadConfig();

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const beforeBalance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatUnits(beforeBalance, "ether"), "ETH");

    if (config.eurAddress) {
        console.log("EURss Already Deployed at Address:", config.eurAddress);
    } else {
        const eurFactory = await ethers.getContractFactory("EURss");
        const eur = await eurFactory.deploy();
        const addr = await eur.getAddress();
        console.log("EURss Deployed to Address:", addr);
        config.eurAddress = addr;
    }

    if (config.multiSigTokenAddress) {
        console.log("MultiSigToken Already Deployed at Address:", config.multiSigTokenAddress);
    } else {
        const multiSigTokenFactory = await ethers.getContractFactory("MultiSigToken");
        const multiSigToken = await multiSigTokenFactory.deploy("ipfs://QmV1PMaez5Cf3nworzt77xznFLVAQqFi4NUaWgo8ijLPfJ", deployer.address, [deployer.address], config.eurAddress, 1);
        const addr = await multiSigToken.getAddress();
        console.log("MultiSigToken Deployed to Address:", addr);
        config.multiSigTokenAddress = addr;
    }

    if (config.listingsAddress) {
        console.log("Listings Already Deployed at Address:", config.listingsAddress);
    } else {
        const listingsFactory = await ethers.getContractFactory("Listings");
        const listings = await listingsFactory.deploy();
        const addr = await listings.getAddress();
        console.log("Listings Deployed to Address:", addr);
        config.listingsAddress = addr;
    }

    if (config.payoutSettlementAddress) {
        console.log("PayoutSettlement Already Deployed at Address:", config.payoutSettlementAddress);
    } else {
        const payoutSettlementFactory = await ethers.getContractFactory("PayoutSettlementContract");
        const payoutSettlement = await payoutSettlementFactory.deploy(config.multiSigTokenAddress);
        const addr = await payoutSettlement.getAddress();
        console.log("PayoutSettlement Deployed to Address:", addr);
        config.payoutSettlementAddress = addr;
    }

    const afterBalance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatUnits(afterBalance, "ether"), "ETH");

    const raw = JSON.stringify(config, null, 4);
    console.log("\nRaw Config:", raw);
    writeFileSync("scripts/config.json", raw, "utf8");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });