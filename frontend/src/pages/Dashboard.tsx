import Navbar from "../components/Navbar";
import { BalanceContext } from "../providers/balance.provider";
import { useContext } from "react";

const Dashboard = () => {
  const { balance } = useContext(BalanceContext);

  return (
    <div>
      <Navbar />
      <h1 className="mt-20"> Dashboard </h1>
      <pre>
        <code>
          {balance.tokenVestNFT &&
            JSON.stringify(
              balance.tokenVestNFT.filter(
                (nft) =>
                  nft.tokenAddress ===
                  "0x275767f80f7a2734710f46d8080ee2f9ab781ec5"
              ),
              null,
              2
            )}
        </code>
      </pre>
    </div>
  );
};
export default Dashboard;
