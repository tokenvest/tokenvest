import { useNavigate } from "react-router-dom";

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";

export default function ConnectWallet() {
  const navigate = useNavigate();

  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // truncate the address to be displayed on the button
  const truncatedAddress =
    isConnected && address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : "Connect";

  const handleDisconnect = async () => {
    //disconnects the web3 provider if it's already active
    if (isConnected) {
      console.log("disconnecting");
      disconnect();
    }
  };

  const handleAuth = async () => {
    //disconnects the web3 provider if it's already active
    if (isConnected) {
      console.log("disconnecting");
    }
    // enabling the web3 provider metamask
    const { account, chain } = await connectAsync({
      connector: new InjectedConnector(),
    });

    const userData = { address: account, chain: chain.id, network: "evm" };

    // making a post request to our 'request-message' endpoint
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
    // signing the received message via metamask
    const signature = await signMessageAsync({ message });

    await axios.post(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/auth/verify`,
      {
        message,
        signature,
      },
      { withCredentials: true } // set cookie from Express server
    );

    // redirect to /user
    navigate("/marketplace");
  };
  const handleClick = isConnected ? handleDisconnect : handleAuth;

  return (
    <div>
      <button className="btn btn-neutral btn-sm" onClick={handleClick}>
        {truncatedAddress}
      </button>
    </div>
  );
}
