import ConnectWallet from "../components/ConnectWallet";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

const Landing = () => {
  const { isConnected } = useAccount();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_SERVER_URL}/api/balance`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setBalance(Number(Number(data.balance * 10 ** -18).toFixed(2)) / 100);
      });
  }, [isConnected]);

  return (
    <div className="landingpage h-full">
      <Navbar />
      <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="/img9crop.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl">
            Tokenized real estate: Your gateway to global property ownership.
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle btn-sm">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle btn-sm">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img src="/img7crop.jpg" className="w-full" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl">
            Blockchain meets real estate: Invest globally, effortlessly.
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle btn-sm">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle btn-sm">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img src="/img19.jpg" className="w-full" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl">
            Revolutionizing property investment with tokenized real estate.
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle btn-sm">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle btn-sm">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img src="/img10crop.jpg" className="w-full" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl">
            Your slice of the world's properties, tokenized and accessible.
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle btn-sm">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle btn-sm">
              ❯
            </a>
          </div>
        </div>
      </div>
      <div className="m-5">
        <p className=" text-white w-full display flex justify-center items-center font-bold text-3xl">
          Top Properties
        </p>
        <div className="card card-compact w-96 bg-gray-900  shadow-xl m-5">
          <figure>
            <img src="/marketplace4.png" alt="Villa" />
          </figure>
          <div className="card-body text-white">
            <h2 className="card-title">
              South Sky Villa
              <div className="badge badge-primary">100€</div>
            </h2>
            <p>
              South Sky Villa is a luxurious property offering panoramic views
              and modern interiors. This desirable residence features spacious
              living areas, a high-end kitchen, and private, comfortable
              bedrooms. Enjoy the perfect blend of elegance, comfort, and
              natural beauty at South Sky Villa.
            </p>
            <progress
              className="progress progress-primary w-56 mt-5"
              value="70"
              max="100"
            ></progress>
            7000/10000 shares sold
            <div className="card-actions justify-end">
              <div className="mr-4">
                {isConnected && (
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white mt-2"
                    id="shares"
                    type="number"
                    placeholder="(max: 3000) "
                  />
                )}
              </div>
              <ConnectWallet showAddress={false} />
            </div>
          </div>
        </div>
      </div>
      <FAQ />
      <Footer />
    </div>
  );
};

export default Landing;
