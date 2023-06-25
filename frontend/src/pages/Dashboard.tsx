import Navbar from "../components/Navbar";
import { BalanceContext } from "../providers/balance.provider";
import { useContext } from "react";
import { ethers } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import abiContract from "../abis/abiContract.json";
import { useEffect } from "react";

const Dashboard = () => {
  const { balance } = useContext(BalanceContext);
  const { isConnected, address } = useAccount();

  console.log("dashboard isconnected ?, ", isConnected);

  const readContractBalanceOf = useContractRead({
    address: "0x275767f80f7a2734710f46d8080ee2f9ab781ec5",
    abi: abiContract,
    functionName: "balanceOf",
    args: [address],
  });

  console.log("readContractBalanceOf: ", readContractBalanceOf.data);

  return (
    <div>
      <Navbar />
      <div className="m-5">
        <h1 className="mt-20 text-2xl"> Dashboard </h1>
        <ul>
          <li>Your wallet address: {address}</li>
          <li>
            Your USDC ballance:{" $"}
            {parseFloat(
              ethers.formatEther(balance.tUSDBalance.balance)
            ).toFixed(2)}
          </li>
          <li>
            Amount of real estate you own:{" "}
            {readContractBalanceOf.isSuccess &&
              (readContractBalanceOf.data as string).toString()}
          </li>
        </ul>
        <pre className="m-5">
          <code>
            {balance.tokenVestNFT &&
              JSON.stringify(
                balance.tokenVestNFT.filter(
                  (nft) =>
                    nft.tokenAddress ===
                    "0x275767f80f7a2734710f46d8080ee2f9ab781ec5"
                )[0],
                null,
                2
              )}
          </code>
        </pre>
      </div>
    </div>
  );
};
export default Dashboard;
