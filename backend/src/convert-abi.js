const { ethers } = require('ethers');
const contractAbi = require('./contractAbi.json');

async function main() {
  const iface = new ethers.Interface(contractAbi.result);
  console.log(iface.fragments.map((f) => f.format('full')).join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
