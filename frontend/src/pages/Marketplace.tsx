import React from "react";
import Navbar from "../components/Navbar";
const Marketplace = () => {
  return (
    <div className="display flex justify-center items-center">
      <Navbar />
      <div className="card card-compact w-96 bg-base-100 shadow-xl mt-20">
        <figure>
          <img src="/marketplace4.png" alt="Villa" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">South Sky Villa</h2>
          <p>
            South Sky Villa is a luxurious property offering panoramic views and
            modern interiors. This desirable residence features spacious living
            areas, a high-end kitchen, and private, comfortable bedrooms. Enjoy
            the perfect blend of elegance, comfort, and natural beauty at South
            Sky Villa.
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
