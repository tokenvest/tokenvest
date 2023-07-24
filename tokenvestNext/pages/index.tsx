import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import VillaCard from "../components/VillaCard";

const Home: NextPage = () => {
  return (
    <div className="landingpage h-full font-Gotham">
      <Head>
        <title>Tokenvest</title>
        <meta
          content="Tokenized real estate investments on the blockchain"
          name="description"
        />
        <link href="/logov2.png" rel="icon" type="image/svg+xml" />
      </Head>

      <header>
        <Navbar />
      </header>
      <main>
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
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center text-base  sm:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl">
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
          <h1 className=" text-white w-full display flex justify-center items-center font-bold text-3xl">
            Top Properties
          </h1>
          <VillaCard />
        </div>
        <FAQ />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
