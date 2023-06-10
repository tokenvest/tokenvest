const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let args = ["EURss", "EUR"];

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

  //BUILDING
  const uri = "telnet://192.0.2.16:80/"; //TODO: fetch from helper hardhat config

  args = [uri];

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

  //SETTLEMENTCONTRACT
  const buildingContractAddress = buildingContract.address;
  const stableCoinContractAddress = stablecoinContract.address;

  args = [stableCoinContractAddress, buildingContractAddress];

  const settlementContract = await deploy("settlementcontract", {
    contract: "PayoutSettlementContract",
    from: deployer,
    args: args,
    log: true,
  });
  console.log("SettlementContract deployed to:", settlementContract.address);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying contract ...");
    await verify(settlementContract.address, args);
  }
};

module.exports.tags = ["all", "stablecoin"];
