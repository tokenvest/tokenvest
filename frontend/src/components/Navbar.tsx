import ConnectWallet from "./ConnectWallet";
import { useNavigate } from "react-router-dom";
import { BalanceContext } from "../providers/balance.provider";
import { useContext } from "react";
import { ethers } from "ethers";
import { useContractWrite, useAccount } from "wagmi";
import { useAuth } from "../providers/auth.provider";
import { useEffect } from "react";
import abiPaymentToken from "../abis/abiPaymentToken.json";

const Navbar = ({ lightText = true }) => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const textColorClass = lightText ? "text-white" : "text-black";

  const { balance, getBalance } = useContext(BalanceContext);

  const testUSD = "0x47f917EE1b0BE0D5fB51d45c0519882875fB3457";

  const { user } = useAuth();

  const { write } = useContractWrite({
    address: testUSD,
    abi: abiPaymentToken,
    functionName: "mint",
    args: [user.address, 1000 * 10 ** 18],
  });

  useEffect(() => {
    getBalance();
  }, []);

  const handleMint = async () => {
    try {
      write();
      getBalance();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`navbar bg-transparent shadow-md fixed top-0 w-full z-50 ${textColorClass}`}
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
              <a>Marketplace</a>
            </li>

            <li onClick={() => navigate("/dashboard")}>
              <a>Dashboard</a>
            </li>
          </ul>
        </div>
        <a
          className="btn btn-ghost normal-case font-bold text-xl"
          onClick={() => navigate("/")}
        >
          TokenVest
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 ">
          <li onClick={() => navigate("/Marketplace")}>
            <a>Marketplace</a>
          </li>

          <li onClick={() => navigate("/dashboard")}>
            <a>Dashboard</a>
          </li>
        </ul>
      </div>
      <button
        onClick={() => handleMint()}
        className="btn btn-sm btn-ghost p-0 text-xs animate-pulse"
      >
        {" "}
        mint
      </button>
      <p className=" text-xs mx-3">
        Balance: $
        {balance.tUSDBalance &&
          parseFloat(ethers.formatEther(balance.tUSDBalance.balance)).toFixed(
            2
          )}
      </p>
      <div className="navbar-end">
        <ConnectWallet showAddress={true} />
      </div>
    </div>
  );
};

export default Navbar;
