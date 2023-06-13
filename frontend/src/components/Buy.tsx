import { ethers } from "ethers";
import { useAccount } from "wagmi";
import contractAbi from "../../contractAbi.json";
import { useAuth } from "../providers/auth.provider";

const Buy = () => {
  const contractAddress = "0x5c8Ad155c3b85dA11f5F327f7216b0F5a6Ad0750";
  const provider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_APP_ALCHEMY_URL
  );

  const contract = new ethers.Contract(
    contractAddress,
    contractAbi.result,
    provider
  );

  return (
    <div>
      <button className="btn"> BUY</button>
    </div>
  );
};

export default Buy;
