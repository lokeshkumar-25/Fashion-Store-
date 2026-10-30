import React from "react";
import hero from "../assets/hero.avif";
import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <>
      <section
        className="mt-20 grid-cols-2 gap-4 
                           lg:grid xl:grid"
      >
        <div>
          <h1
            className=" text-2xl m-4 font-bold  
                         sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl
                         md:m-6 xl:m-10 lg:m-10
                         sm:mt-10 md:mt-10 lg:mt-20 xl:mt-20 "
          >
            Welcome to Our Fashion Store
          </h1>
          <p
            className="text-justify text-md text-black/900 mx-4
                         md:mx-6 xl:mx-10 lg:mx-10
                         lg:text-lg xl:text-lg
                         "
          >
            Discover the latest trends and style your look with our curated
            collection.
          </p>
          <Link to="/shop">
            {" "}
            <button className="bg-white text-black  px-3 py-2  hover:bg-black hover:text-white border-2 m-8 cursor-pointer">
              Shop Now
            </button>
          </Link>
        </div>
        <div>
          <img
            className="mx-auto my-auto
                       lg:my-10 xl:my-10"
            src={hero}
            width="700"
            height="600"
            alt="Fashion Model"
          />
        </div>
      </section>
    </>
  );
}
