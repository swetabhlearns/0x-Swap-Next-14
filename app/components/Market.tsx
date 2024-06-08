"use client";

import useFetch from "../hooks/useFetch";
import Coin from "./Coin";

const Markets = () => {
  const { response, loading }: { response: any; loading: boolean } = useFetch(
    "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );

  if (loading || !response) {
    return <div className="wrapper-container mt-8">Loading...</div>;
  }

  return (
    <section className="mt-8">
      <h1 className="text-2xl mb-2">Markets</h1>
      {response &&
        response?.map((coin: any) => <Coin key={coin.id} coin={coin} />)}
    </section>
  );
};

export default Markets;
