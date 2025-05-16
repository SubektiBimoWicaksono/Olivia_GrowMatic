import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../icons";

export default function EnvironmentChart() {
  const [timeRange, setTimeRange] = useState("24h");
  
  const options: ApexOptions = {
    colors: ["#465fff", "#4ADE80"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 180,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        // easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    xaxis: {
      type: "datetime",
      categories: generateTimeCategories(timeRange),
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Temperature (°C)",
        },
        min: 15,
        max: 35,
      },
      {
        opposite: true,
        title: {
          text: "Humidity (%)",
        },
        min: 50,
        max: 100,
      },
    ],
    tooltip: {
      shared: true,
      x: {
        format: "HH:mm",
      },
    },
  };

  const series = [
    {
      name: "Temperature",
      data: generateSampleData(timeRange, 20, 25),
    },
    {
      name: "Humidity",
      data: generateSampleData(timeRange, 75, 85),
    },
  ];

  function generateTimeCategories(range: string) {
    const now = new Date();
    const categories = [];
    const count = range === "24h" ? 24 : range === "7d" ? 7 : 30;
    const interval = range === "24h" ? 3600000 : 86400000;
    
    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * interval));
      categories.push(time.getTime());
    }
    return categories;
  }

  function generateSampleData(range: string, min: number, max: number) {
    const count = range === "24h" ? 24 : range === "7d" ? 7 : 30;
    return Array.from({ length: count + 1 }, (_, i) => {
      const variation = (Math.random() * (max - min)) / 5;
      const base = min + (max - min) / 2;
      return (base + (i % 2 === 0 ? variation : -variation)).toFixed(1);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Environment Monitoring
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("24h")}
            className={`px-3 py-1 text-sm rounded-lg ${timeRange === "24h" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 text-sm rounded-lg ${timeRange === "7d" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 text-sm rounded-lg ${timeRange === "30d" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            30d
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} type="line" height={180} />
        </div>
      </div>
    </div>
  );
}