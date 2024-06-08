import React from "react";
import Trending from "./trending";
import Markets from "../components/Market";

const HomePage = () => {
  return (
    <div className="flex justify-center w-full">
      <h1 className="text-3xl w-[888px]">
        <Trending />
        <Markets />
      </h1>
      {}
    </div>
  );
};

export default HomePage;
