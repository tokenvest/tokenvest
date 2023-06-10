const { ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const args = ["EURss", "EUR"];

  const stablecoinContract = await deploy("euro", {
    contract: "EURss",
    from: deployer,
    args: args,
    log: true,
  });
  console.log("EURss deployed to:", stablecoinContract.address);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying contract ...");
    await verify(stablecoinContract.address, args);
  }
};

module.exports.tags = ["all", "stablecoin"];
