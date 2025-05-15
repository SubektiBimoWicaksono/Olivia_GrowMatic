import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";

export default function GrowthStatistics() {
  const [activeTab, setActiveTab] = useState("weight");
  
  const options: ApexOptions = {
    colors: ["#4ADE80"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 310,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      title: {
        text: "Growth Period",
      },
    },
    yaxis: {
      title: {
        text: activeTab === "weight" ? "Weight (kg)" : "Diameter (cm)",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} ${activeTab === "weight" ? "kg" : "cm"}`,
      },
    },
  };

  const series = [
    {
      name: activeTab === "weight" ? "Weight" : "Diameter",
      data: activeTab === "weight" 
        ? [0.2, 0.8, 1.5, 2.3, 3.5, 4.2] 
        : [2, 5, 8, 12, 15, 18],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Mushroom Growth Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Track your mushroom growth progress
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <button
            onClick={() => setActiveTab("weight")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "weight" 
                ? "bg-green-100 text-green-600" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Weight
          </button>
          <button
            onClick={() => setActiveTab("diameter")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "diameter" 
                ? "bg-green-100 text-green-600" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Diameter
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="line" height={310} />
        </div>
      </div>
    </div>
  );
}