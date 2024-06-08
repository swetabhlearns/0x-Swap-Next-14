"use client";

import React from "react";
import useFetch from "../hooks/useFetch";
import CoinTrending from "../components/coinTrend";

const Trending = () => {
  const { response }: { response: any } = useFetch(`search/trending`);
  return (
    <div>
      {response &&
        response?.coins?.map((coin: any) => (
          <CoinTrending key={coin?.item?.coin_id} coin={coin?.item} />
        ))}
    </div>
  );
};

export default Trending;
