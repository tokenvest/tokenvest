import {
  useContractWrite,
  useAccount,
  useBalance,
  useWaitForTransaction,
} from "wagmi";
import { useState, useEffect } from "react";
import { BigNumberish } from "ethers";
import Link from "next/link";
import abiPaymentToken from "../ABI/abiPaymentToken.json";

const Navbar = () => {
  const { isConnected, address } = useAccount();
  const [userBalance, setUserBalance] = useState<BigNumberish>(0);
  const testUSD = "0x47f917EE1b0BE0D5fB51d45c0519882875fB3457";

  const { data: tUSDbalance } = useBalance({
    address: address,
    token: testUSD,
    watch: isConnected,
  });

  const { write, data } = useContractWrite({
    address: testUSD,
    abi: abiPaymentToken,
    functionName: "mint",
    args: [address, 1000 * 10 ** 18],
  });

  return (
    <div>
      <h1 className="text-xl">here should be the navbar OK</h1>
    </div>
  );
};
export default Navbar;
