// import { ThermometerIcon, DropletIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

export default function TemperatureHumidityCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Temperature Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
          {/* <ThermometerIcon className="text-blue-600 size-6 dark:text-blue-400" /> */}
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Temperature
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              24.5°C
            </h4>
          </div>
          <Badge color={24.5 > 26 ? "error" : "success"}>
            {24.5 > 26 ? "Too High" : "Optimal"}
          </Badge>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
          {/* <DropletIcon className="text-green-600 size-6 dark:text-green-400" /> */}
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Humidity
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              85%
            </h4>
          </div>
          <Badge color={85 > 90 ? "error" : "success"}>
            {85 > 90 ? "Too High" : "Optimal"}
          </Badge>
        </div>
      </div>
    </div>
  );
}