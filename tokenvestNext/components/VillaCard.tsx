"use client";
import { useContractRead, useContractWrite, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import abiContract from "../ABI/abiContract.json";
import abiPaymenbtToken from "../ABI/abiPaymentToken.json";
import { BigNumberish, ethers, toNumber } from "ethers";
import axios from "axios";

const VillaCard = () => {
  const { address } = useAccount();
  const [hasMounted, setHasMounted] = useState(false);
  const contractAddress = "0x275767F80F7A2734710f46d8080eE2F9aB781Ec5";
  const paymentToken = "0x47f917EE1b0BE0D5fB51d45c0519882875fB3457";
  const [amount, setAmount] = useState(0);
  const [requiredAmount, setRequiredAmount] = useState(BigInt(0));
  const [imgUrl, setImgUrl] = useState("");
  const [metaData, setMetaData] = useState({
    name: "",
    image: "",
    description: "",
  });
  const [isAllowed, setIsAllowed] = useState(false);
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<BigNumberish>(0);

  const tokenURI = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "tokenURI",
    args: [0],
  });

  const usdAllowance = useContractRead({
    address: paymentToken,
    abi: abiPaymenbtToken,
    functionName: "allowance",
    args: [address, contractAddress],
  });

  const usdBalance = useContractRead({
    address: paymentToken,
    abi: abiPaymenbtToken,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (usdAllowance.data) {
      const allowance = usdAllowance.data as bigint;
      console.log("allowance: ", allowance);
      const requiredAmount =
        BigInt(amount.toString()) * BigInt((price.data as bigint) || "0");
      console.log("requiredAmount: ", requiredAmount);
      setRequiredAmount(requiredAmount);
      if (allowance >= requiredAmount && amount > 0) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    }
  }, [usdAllowance.data, amount]);

  //tokenURI.data =ipfs://QmfR5DzK9UMWBWBrPYxpZheSSiPd2jksoy5iZLv26m5tSD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const metaDataHash = (tokenURI.data as string).replace("ipfs://", "");
        const gatewayUrl = `https://crimson-subjective-whale-633.mypinata.cloud/ipfs/${metaDataHash}`;
        const mdResult = await axios.get(gatewayUrl);
        console.log("result of fetching ipfs : ", mdResult.data);
        const pictureHash = mdResult.data.image.replace("ipfs://", "");
        const imgUrl = `https://crimson-subjective-whale-633.mypinata.cloud/ipfs/${pictureHash}`;
        setImgUrl(imgUrl);
        setMetaData(mdResult.data);
      } catch (err) {
        console.error("error fetching metadata: ", err);
      }
    };
    fetchData();
  }, [tokenURI.data]);

  const price = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "TOKEN_PRICE",
    args: [],
  });

  const maxSupply = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "MAX_SUPPLY",
    args: [],
  });

  const { write } = useContractWrite({
    address: contractAddress,
    abi: abiContract,
    functionName: "safeMint",
    args: [address, amount],
  });

  const balanceOf = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  useEffect(() => {
    balanceOf.isSuccess &&
      balanceOf.data &&
      setTokenBalance(balanceOf.data as BigNumberish);
  }, [refreshBalance, balanceOf.isSuccess, balanceOf.data]);

  const handleAmount = (e: any) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  const { write: approve } = useContractWrite({
    address: paymentToken,
    abi: abiPaymenbtToken,
    functionName: "approve",
    args: [contractAddress, ethers.MaxUint256],
  });

  const handleBuy = async () => {
    try {
      write();
      setRefreshBalance((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  // Hydratation error fix
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  return (
    <div className="display flex justify-center items-center gap-2 mt-20">
      <div className="card card-compact w-96  bg-gray-900 shadow-xl ">
        <figure>
          <img src={imgUrl} alt="Villa" />
        </figure>
        <div className="card-body text-white">
          <h2 className="card-title">
            {metaData && metaData.name}
            <div className="badge badge-primary">
              {price.isSuccess
                ? "$" + ethers.formatEther(price.data as string)
                : "loading..."}
            </div>
          </h2>
          <p className="xs:text-xs sm:text-sm md:text-base ">
            {metaData && metaData.description}
          </p>
          <progress
            className="progress progress-primary w-56 mt-5"
            value={toNumber(tokenBalance as number)}
            max={
              maxSupply.isSuccess && maxSupply.data
                ? toNumber(maxSupply.data as number)
                : 0
            }
          ></progress>
          {toNumber(tokenBalance as number)}/
          {maxSupply.isSuccess && maxSupply.data
            ? toNumber(maxSupply.data as number)
            : 0}{" "}
          Sold
          <div className="card-actions justify-end">
            <div className="flex justify-center gap-1 my-1">
              <input
                className="shadow appearance-none border rounded w-full  px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white "
                id="shares"
                type="number"
                placeholder="Enter amount"
                onChange={handleAmount}
              />
              {isAllowed || amount == 0 ? (
                <button
                  className="btn btn-primary "
                  disabled={
                    (usdBalance.data as bigint) > requiredAmount ? false : true
                  }
                  onClick={handleBuy}
                >
                  {" "}
                  BUY
                </button>
              ) : (
                <button className="btn btn-primary " onClick={() => approve()}>
                  {" "}
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaCard;
