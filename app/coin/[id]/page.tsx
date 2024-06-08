import CoinDetail from "@/app/components/coinDetail";
import HistoryChart from "@/app/components/historyChart";
import React from "react";

const CoinDetails = () => {
  return (
    <div className="wrapper-container mt-10">
      <HistoryChart />
      <CoinDetail />
    </div>
  );
};

export default CoinDetails;
