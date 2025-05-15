import { useState } from "react";
// import { FanIcon, WaterPumpIcon, AutoModeIcon, ManualModeIcon } from "../../icons";

export default function ControlPanel() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [fanStatus, setFanStatus] = useState(false);
  const [pumpStatus, setPumpStatus] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 pb-6 sm:px-6 sm:pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Control Panel
        </h3>
        
        {/* Mode Selector */}
        <div className="flex gap-4 mt-4 mb-6">
          <button
            onClick={() => setMode("auto")}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              mode === "auto" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {/* <AutoModeIcon className="size-5" /> */}
            Auto Mode
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              mode === "manual" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {/* <ManualModeIcon className="size-5" /> */}
            Manual Mode
          </button>
        </div>
        
        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${
            fanStatus 
              ? "bg-green-100 border-green-300 dark:bg-green-900/30" 
              : "bg-gray-100 border-gray-200 dark:bg-gray-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* <FanIcon className={`size-6 ${
                  fanStatus ? "text-green-600" : "text-gray-500"
                }`} /> */}
                <span className="font-medium">Exhaust Fan</span>
              </div>
              <button
                onClick={() => mode === "manual" && setFanStatus(!fanStatus)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  fanStatus 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-700"
                } ${mode === "auto" ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={mode === "auto"}
              >
                {fanStatus ? "ON" : "OFF"}
              </button>
            </div>
            {mode === "auto" && (
              <p className="mt-2 text-xs text-gray-500">
                Controlled automatically based on conditions
              </p>
            )}
          </div>
          
          <div className={`p-4 rounded-lg border ${
            pumpStatus 
              ? "bg-green-100 border-green-300 dark:bg-green-900/30" 
              : "bg-gray-100 border-gray-200 dark:bg-gray-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* <WaterPumpIcon className={`size-6 ${
                  pumpStatus ? "text-green-600" : "text-gray-500"
                }`} /> */}
                <span className="font-medium">Water Pump</span>
              </div>
              <button
                onClick={() => mode === "manual" && setPumpStatus(!pumpStatus)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  pumpStatus 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-700"
                } ${mode === "auto" ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={mode === "auto"}
              >
                {pumpStatus ? "ON" : "OFF"}
              </button>
            </div>
            {mode === "auto" && (
              <p className="mt-2 text-xs text-gray-500">
                Controlled automatically based on humidity
              </p>
            )}
          </div>
        </div>
        
        {/* Status Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
          <h4 className="font-medium text-blue-800 dark:text-blue-200">
            Current System Status
          </h4>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            {mode === "auto" 
              ? "System is in automatic mode. Devices will be controlled based on sensor data."
              : "System is in manual mode. You have full control over all devices."}
          </p>
        </div>
      </div>
    </div>
  );
}