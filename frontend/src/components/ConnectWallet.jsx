import { ethers } from "ethers";
import { useState } from "react";

const ConnectWallet = () => {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        console.log(await signer);
        const account = (await signer).address;
        console.log(account);
        setAccount(account);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  return (
    <div>
      <button className="btn btn-sm btn-neutral" onClick={connectWallet}>
        {account ? ` ${truncateAddress(account)}` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default ConnectWallet;
