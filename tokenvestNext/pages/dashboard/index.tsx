import Navbar from "../../components/Navbar";
import abiContract from "../../ABI/abiContract.json";
import { useAccount, useContractRead, useBalance } from "wagmi";
import { getSession, signOut } from "next-auth/react";

const Dashboard = () => {
  const { isConnected, address } = useAccount();
  const contractAddress = "0x275767F80F7A2734710f46d8080eE2F9aB781Ec5";
  const testUSD = "0x47f917EE1b0BE0D5fB51d45c0519882875fB3457";

  const { data: tUSDbalance } = useBalance({
    address: address,
    token: testUSD,
  });
  const { data: ETHBalance } = useBalance({
    address: address,
  });

  const readContractBalanceOf = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "balanceOf",
    args: [address],
  });

  const tokenURI = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "tokenURI",
    args: [0],
  });

  console.log("tokenuri is : ", tokenURI);

  return (
    <div>
      <Navbar />
      <div className="m-5 font-Gotham flex flex-col justify-center items-center">
        <div className="flex items-center mt-20">
          <span className="font-bold">{isConnected && address}</span>
          <button
            className="btn btn-xs btn-error m-2"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>

        <div className="stats border shadow bg-slate-800 text-primary-content mt-10">
          <div className="stat">
            <div className="stat-title">Your ETH balance </div>
            <div className="stat-value">
              {isConnected &&
                parseFloat(ETHBalance?.formatted as string).toFixed(3)}{" "}
              ETH
            </div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-success">Add funds</button>
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">USDC balance</div>
            <div className="stat-value">
              {isConnected &&
                "$" + parseFloat(tUSDbalance?.formatted as string).toFixed(2)}
            </div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-success">Add funds</button>
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Real Estate assets</div>
            <div className="stat-value">
              {isConnected &&
                readContractBalanceOf.isSuccess &&
                (readContractBalanceOf.data as string).toString()}
            </div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-success">Buy more</button>
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Total Balance</div>
            <div className="stat-value">$25000</div>
            <div className="stat-actions">
              <button className="btn btn-sm">Claim</button>
              <button className="btn btn-sm">deposit</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-10">
        <div className="display flex justify-center items-center gap-2 mt-20">
          <div className="card card-compact w-72  bg-gray-900 shadow-xl ">
            <figure>
              <img src="./marketplace4.png" alt="Villa" />
            </figure>
            <div className="card-body text-white ">
              <h2 className="card-title flex justify-center items-center">
                South Sky Villa
                <div className="badge  badge-success text-lg">
                  x{" "}
                  {isConnected &&
                    readContractBalanceOf.isSuccess &&
                    (readContractBalanceOf.data as string).toString()}
                </div>
              </h2>
              <button className="btn btn-sm btn-success">claim</button>
            </div>
          </div>
        </div>

        <div className="display flex justify-center items-center gap-2 mt-20">
          <div className="card card-compact w-72  bg-gray-900 shadow-xl ">
            <figure>
              <img src="./GardenVillaSquare.jpg" alt="Villa" />
            </figure>
            <div className="card-body text-white ">
              <h2 className="card-title flex justify-center items-center">
                Garden Villa
                <div className="badge  badge-success text-lg">x 3</div>
              </h2>
              <button className="btn btn-sm btn-success">claim</button>
            </div>
          </div>
        </div>

        <div className="display flex justify-center items-center gap-2 mt-20">
          <div className="card card-compact w-72  bg-gray-900 shadow-xl ">
            <figure>
              <img src="./SkyVillaSquare.jpg" alt="Villa" />
            </figure>
            <div className="card-body text-white ">
              <h2 className="card-title flex justify-center items-center">
                Sky Villa
                <div className="badge  badge-success text-lg">x 7</div>
              </h2>
              <button className="btn btn-sm btn-success">claim</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

export default Dashboard;
