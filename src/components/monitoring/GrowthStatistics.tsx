import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import { getChartData, DailySensorData } from "../../services/thingerService";

export default function GrowthStatistics() {
  const [activeTab, setActiveTab] = useState<"temperature" | "humidity">("temperature");
  const [chartData, setChartData] = useState<DailySensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChartData()
      .then((data) => setChartData(data))
      .finally(() => setLoading(false));
  }, []);

  const categories = chartData.map((d) => d.date);

const series = [
  {
    name: activeTab === "temperature" ? "Avg Temperature" : "Avg Humidity",
    data: activeTab === "temperature"
      ? chartData.map((d) => Math.round(d.avg_temperature)) // Bulatkan suhu
      : chartData.map((d) => Math.round(d.avg_humidity)),   // Bulatkan kelembapan
  },
];

  const options: ApexOptions = {
    colors: [activeTab === "temperature" ? "#60A5FA" : "#4ADE80"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 310,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories,
      title: { text: "Date" },
    },
    yaxis: {
      title: {
        text: activeTab === "temperature" ? "Temperature (°C)" : "Humidity (%)",
      },
      labels: {
      formatter: (val: number) =>
        activeTab === "temperature"
          ? `${val}°`
          : `${val}%`,
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) =>
        activeTab === "temperature"
          ? `${val}°`
          : `${val}%`,
    },
  },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daily Sensor Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Track your mushroom room temperature and humidity
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <button
            onClick={() => setActiveTab("temperature")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "temperature"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveTab("humidity")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "humidity"
                ? "bg-green-100 text-green-600" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Humidity
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <Chart options={options} series={series} type="line" height={310} />
          )}
        </div>
      </div>
    </div>
  );
}