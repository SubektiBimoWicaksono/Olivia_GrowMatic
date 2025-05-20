// src/components/monitoring/TemperatureHumidityCards.tsx
import { useState, useEffect } from "react";
import { Thermometer, Droplet, Fan, Zap, Clock } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { getSensorData } from "../../services/thingerService";

interface SensorData {
  temperature: number;
  humidity: number;
  fanStatus: boolean;
  pumpStatus: boolean;
  mode?: 'otomatis' | 'manual';  // Optional jika belum digunakan di tampilan
}

export default function TemperatureHumidityCards() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    fanStatus: false,
    pumpStatus: false,
    mode: 'otomatis' // Default mode
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getSensorData();
      setSensorData({
        temperature: Number(data.temperature) || 0,
        humidity: Number(data.humidity) || 0,
        fanStatus: Boolean(data.fanStatus),
        pumpStatus: Boolean(data.pumpStatus),
        mode: data.mode || 'otomatis' // Pastikan mode ada
      });
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setError("Failed to load sensor data");
      // Pertahankan data terakhir yang berhasil di-load
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
    return num.toFixed(1); // Menggunakan 1 desimal untuk suhu
  };

  const getStatusColor = (value: number, threshold: number) => {
    return value > threshold ? "error" : "success";
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
          <Badge color={getStatusColor(sensorData.temperature, 26)}>
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
              {isLoading ? 'Loading...' : `${Math.round(sensorData.humidity)}%`} {/* Bulatkan ke integer */}
            </h4>
          </div>
          <Badge color={getStatusColor(sensorData.humidity, 90)}>
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
            {sensorData.mode === 'otomatis' ? "otomatis" : (sensorData.fanStatus ? "Active" : "Standby")}
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
            {sensorData.mode === 'otomatis' ? "otomatis" : (sensorData.pumpStatus ? "Active" : "Standby")}
          </Badge>
        </div>
      </div>

      {/* Status Bar */}
      <div className="col-span-full flex justify-between items-center">
        {error && (
          <div className="text-sm text-red-500 flex items-center">
            ⚠️ {error}
          </div>
        )}
        {lastUpdated && (
          <div className="text-xs text-gray-500 flex items-center ml-auto">
            <Clock className="mr-1 size-3" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}