import Navbar from "../components/Navbar";
import ConnectWallet from "../components/ConnectWallet";
import Buy from "../components/Buy";

const Marketplace = () => {
  return (
    <div className="display flex justify-center items-center">
      <Navbar lightText={false} />
      <div className="card card-compact w-96  bg-gray-900 shadow-xl mt-20">
        <figure>
          <img src="/marketplace4.png" alt="Villa" />
        </figure>
        <div className="card-body text-white">
          <h2 className="card-title">
            South Sky Villa
            <div className="badge badge-primary">100€</div>
          </h2>
          <p>
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
            <div className="mr-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white mt-2"
                id="shares"
                type="number"
                placeholder="Enter amount"
              />
            </div>
            <Buy />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
