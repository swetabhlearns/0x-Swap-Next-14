"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { useParams } from "next/navigation";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const HistoryChart = () => {
  const { id } = useParams();
  const [filter, setFilter] = useState("1D");
  const [now, setNow] = useState<number | null>(null);
  const [past, setPast] = useState<number | null>(null);

  const getUnixTimestamps = (filter: string) => {
    const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
    let past = now;

    switch (filter) {
      case "1D":
        past = now - 1 * 24 * 60 * 60; // 1 day ago
        break;
      case "7D":
        past = now - 7 * 24 * 60 * 60; // 7 days ago
        break;
      case "30D":
        past = now - 30 * 24 * 60 * 60; // 30 days ago
        break;
      default:
        break;
    }
    setNow(now);
    setPast(past);

    return { now, past };
  };

  useEffect(() => {
    getUnixTimestamps(filter);
  }, [filter, now, past]);

  const { response }: { response: any } = useFetch(
    past && now
      ? `coins/${id}/market_chart/range?vs_currency=usd&from=${past}&to=${now}`
      : `coins/solana/market_chart/range?vs_currency=usd&from=1717764170&to=1717850570`
  );

  if (!response) {
    return <div className="wrapper-container mt-8">Loading...</div>;
  }
  const coinChartData = response.prices.map((value: any) => ({
    x: value[0],
    y: value[1].toFixed(2),
  }));

  const options = {
    responsive: true,
  };
  const data = {
    labels: coinChartData.map((value: any) => moment(value.x).format("MMM DD")),
    datasets: [
      {
        fill: true,
        label: id,
        data: coinChartData.map((val: any) => val.y),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      <Line options={options} data={data as any} />
      <div className="flex gap-2">
        <button
          type="button"
          className="px-4 py-2 border border-white"
          onClick={() => setFilter("1D")}
        >
          1D
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-white"
          onClick={() => setFilter("7D")}
        >
          7D
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-white"
          onClick={() => setFilter("30D")}
        >
          30D
        </button>
      </div>
    </div>
  );
};

export default HistoryChart;
