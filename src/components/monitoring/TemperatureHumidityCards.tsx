// src/components/monitoring/TemperatureHumidityCards.tsx
import { useState, useEffect } from "react";
import { Thermometer, Droplet, Fan, Zap } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { getSensorData } from "../../services/thingerService";

interface SensorData {
  temperature: number;
  humidity: number;
  fanStatus: boolean;
  pumpStatus: boolean;
}

export default function TemperatureHumidityCards() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    fanStatus: false,
    pumpStatus: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const data = await getSensorData();
      setSensorData({
        temperature: data.temperature || 0,
        humidity: data.humidity || 0,
        fanStatus: data.fanStatus || false,
        pumpStatus: data.pumpStatus || false
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Temperature Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
          <Thermometer className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Temperature
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {isLoading ? 'Loading...' : `${formatNumber(sensorData.temperature)}°C`}
            </h4>
          </div>
          <Badge color={sensorData.temperature > 26 ? "error" : "success"}>
            {sensorData.temperature > 26 ? "Too High" : "Optimal"}
          </Badge>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
          <Droplet className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Humidity
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {isLoading ? 'Loading...' : `${sensorData.humidity}%`}
            </h4>
          </div>
          <Badge color={sensorData.humidity > 90 ? "error" : "success"}>
            {sensorData.humidity > 90 ? "Too High" : "Optimal"}
          </Badge>
        </div>
      </div>

      {/* Fan Status Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/30">
          <Fan className="text-purple-600 size-6 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Fan Status
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {isLoading ? 'Loading...' : (sensorData.fanStatus ? "Running" : "Idle")}
            </h4>
          </div>
          <Badge color={sensorData.fanStatus ? "success" : "warning"}>
            {sensorData.fanStatus ? "Active" : "Standby"}
          </Badge>
        </div>
      </div>

      {/* Pump Status Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/30">
          <Zap className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pump Status
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {isLoading ? 'Loading...' : (sensorData.pumpStatus ? "Running" : "Idle")}
            </h4>
          </div>
          <Badge color={sensorData.pumpStatus ? "success" : "warning"}>
            {sensorData.pumpStatus ? "Active" : "Standby"}
          </Badge>
        </div>
      </div>

      {lastUpdated && (
        <div className="col-span-full text-xs text-gray-500 text-right">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}