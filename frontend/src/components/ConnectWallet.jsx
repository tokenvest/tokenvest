import { useNavigate } from "react-router-dom";

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";

const ConnectWallet = () => {
  const navigate = useNavigate();

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleAuth = async (signature) => {
    if (isConnected) {
      await disconnectAsync();
    }
    // enabling the web3 provider metamask
    const { account, chain } = await connectAsync({
      connector: new InjectedConnector(),
    });

    const userData = { address: account, chain: chain.id, network: "evm" };
    // making a post request to our 'request-message' endpoint
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_SERVER_URL}/request-message`,
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
      `${import.meta.env.VITE_APP_SERVER_URL}/verify`,
      {
        message,
        signature,
      },
      { withCredentials: true } // set cookie from Express server
    );

    // redirect to /user
    //navigate("/user");
  };

  return (
    <div>
      <button className="btn btn-sm btn-neutral" onClick={() => handleAuth()}>
        {account ? ` ${truncateAddress(account)}` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default ConnectWallet;
