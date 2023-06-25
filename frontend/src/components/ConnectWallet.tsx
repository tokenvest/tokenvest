import { useNavigate } from "react-router-dom";

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";
import { useAuth } from "../providers/auth.provider";
import { switchNetwork } from "@wagmi/core";

export default function ConnectWallet({
  showAddress = false,
}: {
  showAddress: boolean;
}) {
  const navigate = useNavigate();
  const { isAuthorized, user, signIn, signOut } = useAuth();

  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const truncatedAddress = `${user?.address.slice(
    0,
    6
  )}...${user?.address.slice(-4)}`;

  const handleDisconnect = async () => {
    if (isConnected) {
      disconnect();
    }
    signOut();
  };

  const handleAuth = async () => {
    const { account, chain } = await connectAsync({
      connector: new InjectedConnector(),
    });

    if (chain.id !== 11155111) {
      console.log("switching network");
      await switchNetwork({
        chainId: 11155111,
      });
    }

    const userData = { address: account, chain: chain.id, network: "evm" };

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/auth/request-message`,
      userData,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const message = data.message;
    const signature = await signMessageAsync({ message });

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/auth/verify`,
        {
          message,
          signature,
        },
        { withCredentials: true }
      );

      signIn(data);
    } catch {
      signOut();
    }

    handleKYC();
  };

  const handleKYC = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/kyc/verify`, {
        withCredentials: true,
      });
    } catch {
      navigate("/register");
    }
  };

  //todo
  const handleClick =
    isConnected || isAuthorized ? handleDisconnect : handleAuth;

  return (
    <div>
      <button
        className={`btn ${showAddress ? "btn-neutral btn-sm" : "btn-primary"}`}
        onClick={handleClick}
      >
        {user.address && isConnected ? truncatedAddress : "Connect"}
      </button>
    </div>
  );
}
