import ConnectWallet from "./ConnectWallet";
import { useNavigate } from "react-router-dom";
import {
  useContractWrite,
  useAccount,
  useBalance,
  useWaitForTransaction,
} from "wagmi";
import { useAuth } from "../providers/auth.provider";
import { useState, useEffect } from "react";
import { BigNumberish } from "ethers";

import abiPaymentToken from "../abis/abiPaymentToken.json";

const Navbar = ({ lightText = true }) => {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const textColorClass = lightText ? "text-white" : "text-black";
  const [userBalance, setUserBalance] = useState<BigNumberish>(0);

  const testUSD = "0x47f917EE1b0BE0D5fB51d45c0519882875fB3457";

  const { data: tUSDbalance } = useBalance({
    address: address,
    token: testUSD,
    watch: isConnected,
  });
  const { user } = useAuth();

  const { write, data } = useContractWrite({
    address: testUSD,
    abi: abiPaymentToken,
    functionName: "mint",
    args: [user.address, 1000 * 10 ** 18],
  });

  const { isSuccess, data: hashData } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    const balance = parseFloat(tUSDbalance?.formatted as string).toFixed(2);
    setUserBalance(balance);
  }),
    [isSuccess, tUSDbalance, hashData];

  const handleMint = async () => {
    try {
      write();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`navbar bg-transparent shadow-md fixed top-0 w-full z-50 ${textColorClass} font-Roboto tracking-widest`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-500 rounded-box w-52"
          >
            <li onClick={() => navigate("/Marketplace")}>
              <a>MARKETPLACE</a>
            </li>

            <li onClick={() => navigate("/dashboard")}>
              <a>DASHBOARD</a>
            </li>
          </ul>
        </div>
        <a
          className="btn btn-ghost normal-case font-bold text-xl"
          onClick={() => navigate("/")}
        >
          TOKENVEST
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 ">
          <li onClick={() => navigate("/Marketplace")}>
            <a>MARKETPLACE</a>
          </li>

          <li onClick={() => navigate("/dashboard")}>
            <a>DASHBOARD</a>
          </li>
        </ul>
      </div>
      <button
        onClick={() => handleMint()}
        className="btn btn-sm btn-ghost p-0 text-xs animate-pulse"
      >
        {" "}
        MINT
      </button>
      <p className=" text-xs mx-3">
        BALANCE: ${isConnected && (userBalance as string)}
      </p>
      <div className="navbar-end">
        <ConnectWallet showAddress={true} />
      </div>
    </div>
  );
};

export default Navbar;
