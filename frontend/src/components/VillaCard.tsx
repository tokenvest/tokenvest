import { useContractRead, useContractWrite } from "wagmi";

import { useAuth } from "../providers/auth.provider";
import { useState } from "react";
import abiContract from "../abis/abiContract.json";

const VillaCard = () => {
  //import.meta.env.VITE_ALCHEMY_KEY
  const contractAddress = "0x275767F80F7A2734710f46d8080eE2F9aB781Ec5";
  const testUSD = "0x47f917EE1b0BE0D5fB51d45c0519882875fB3457";

  const { user } = useAuth();

  const [amount, setAmount] = useState(0);

  const paymentToken = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "paymentToken",
    args: [],
  });

  console.log("show me the money ", paymentToken.data);

  const { write } = useContractWrite({
    address: contractAddress,
    abi: abiContract,
    functionName: "safeMint",
    args: [user.address, amount],
  });

  const handleAmount = (e: any) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  const handleBuy = async () => {
    try {
      write();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="display flex justify-center items-center gap-2 mt-20">
      <div className="card card-compact w-96  bg-gray-900 shadow-xl ">
        <figure>
          <img src="/marketplace4.png" alt="Villa" />
        </figure>
        <div className="card-body text-white">
          <h2 className="card-title">
            South Sky Villa
            <div className="badge badge-primary">100€</div>
          </h2>
          <p className="xs:text-xs sm:text-sm md:text-base ">
            South Sky Villa is a luxurious property offering panoramic views and
            modern interiors. This desirable residence features spacious living
            areas, a high-end kitchen, and private, comfortable bedrooms. Enjoy
            the perfect blend of elegance, comfort, and natural beauty at South
            Sky Villa.
          </p>
          <progress
            className="progress progress-primary w-56 mt-5"
            value="70"
            max="100"
          ></progress>
          7000/10000 shares sold
          <div className="card-actions justify-end">
            <div className="flex justify-center gap-1 my-1">
              <input
                className="shadow appearance-none border rounded w-full  px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white "
                id="shares"
                type="number"
                placeholder="Enter amount"
                onChange={handleAmount}
              />
              <button className="btn btn-primary" onClick={handleBuy}>
                {" "}
                BUY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaCard;
