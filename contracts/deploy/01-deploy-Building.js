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
  const uri = "telnet://192.0.2.16:80/";

  const args = [uri];

  const buildingContract = await deploy("building", {
    contract: "Building",
    from: deployer,
    args: args,
    log: true,
  });
  console.log("Building deployed to:", buildingContract.address);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying contract ...");
    await verify(buildingContract.address, args);
  }
};

module.exports.tags = ["all", "building"];
