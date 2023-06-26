import Navbar from "../components/Navbar";

import { useAccount, useContractRead, useBalance } from "wagmi";
import abiContract from "../abis/abiContract.json";

const Dashboard = () => {
  const { isConnected, address } = useAccount();
  const contractAddress = "0x275767F80F7A2734710f46d8080eE2F9aB781Ec5";
  const testUSD = "0x47f917EE1b0BE0D5fB51d45c0519882875fB3457";

  const { data: tUSDbalance } = useBalance({
    address: address,
    token: testUSD,
  });
  const { data: ETHBalance } = useBalance({
    address: address,
  });

  const readContractBalanceOf = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "balanceOf",
    args: [address],
  });

  const tokenURI = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "tokenURI",
    args: [0],
  });

  console.log("tokenuri is : ", tokenURI);

  return (
    <div>
      <Navbar />
      <div className="m-5">
        <h1 className="mt-20 text-2xl"> Dashboard </h1>
        <ul>
          <li>Your wallet address: {isConnected && address}</li>
          <li>
            Your ETH balance:{" "}
            {isConnected &&
              parseFloat(ETHBalance?.formatted as string).toFixed(3)}{" "}
            ETH
          </li>
          <li>
            Your USDC ballance:
            {isConnected &&
              "$" + parseFloat(tUSDbalance?.formatted as string).toFixed(2)}
          </li>
          <li>
            Amount of real estate you own:{" "}
            {isConnected &&
              readContractBalanceOf.isSuccess &&
              (readContractBalanceOf.data as string).toString()}
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Dashboard;
