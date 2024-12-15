import { useState, useEffect } from "react";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import "tailwindcss/tailwind.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import Tabs from "./Tabs";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ChartComponent = () => {
  const [activeTab, setActiveTab] = useState("chart");
  const [timeRange, setTimeRange] = useState("1w");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (range) => {
    const rangeMapping = {
      "1d": "1",
      "3d": "3",
      "1w": "7",
      "1m": "30",
      "6m": "180",
      "1y": "365",
      max: "max",
    };

    const days = rangeMapping[range];

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();

      if (data && data.prices) {
        // eslint-disable-next-line no-unused-vars
        const prices = data.prices.map(([timestamp, price]) => price);
        const timestamps = data.prices.map(([timestamp]) => {
          const date = new Date(timestamp);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        setChartData({
          labels: timestamps,
          datasets: [
            {
              label: "Price",
              data: prices,
              borderColor: "#4F46E5",
              fill: true,
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              tension: 0.4,
            },
          ],
        });

        setPrice(prices[prices.length - 1]);
        setChange(prices[prices.length - 1] - prices[0]);
      } else {
        console.error("No prices data available.");
        setChartData({ labels: [], datasets: [] });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "chart") {
      fetchData(timeRange);
    }
  }, [timeRange, activeTab]);

  const handleRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="w-full md:w-auto mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left mb-3">
          {price.toLocaleString()} USD
        </h1>
        <p
          className={
            change >= 0
              ? "text-[#67BF6B] text-lg text-center md:text-left"
              : "text-red-500 text-lg text-center md:text-left"
          }
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)} ({((change / price) * 100).toFixed(2)}%)
        </p>
      </div>

      {activeTab === "chart" && (
        <div>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex gap-8 text-sm font-medium text-[#6F7177]">
              <div className="flex items-center justify-center gap-3">
                <MdOutlineCloseFullscreen />
                <div>Fullscreen</div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <FiPlusCircle />
                <div>Compare</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-2">
              {[
                { label: "1d", range: "1d" },
                { label: "3d", range: "3d" },
                { label: "1w", range: "1w" },
                { label: "1m", range: "1m" },
                { label: "6m", range: "6m" },
                { label: "1y", range: "1y" },
                { label: "max", range: "max" },
              ].map((item) => (
                <button
                  key={item.range}
                  className={`px-3 py-2 rounded-md text-sm font-medium  ${
                    timeRange === item.range
                      ? "bg-[#4B40EE] text-[#FFFFFF]"
                      : " text-[#6F7177]"
                  }`}
                  onClick={() => handleRangeChange(item.range)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      borderDash: [5, 5],
                    },
                    ticks: {
                      callback: (value) => `$${value}`,
                    },
                  },
                },
              }}
            />
          )}
        </div>
      )}

      {activeTab !== "chart" && (
        <div className="text-gray-500 text-center mt-20">
          <p>Content for {activeTab} is under construction.</p>
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
