import { useState } from "react";

export default function ResponsiveImage() {
  const [ipAddress, setIpAddress] = useState("http://10.3.2.6:81/stream");
  const [width, setWidth] = useState("100%");       // Bisa ganti ke px, %, vh
  const [height, setHeight] = useState("600px");   // Default tinggi 600px

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Streaming URL:
        </label>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-w-sm">
        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Width (px or %):
          </label>
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            placeholder="e.g. 100% or 800px"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Height (px or vh):
          </label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            placeholder="e.g. 600px or 80vh"
          />
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        Streaming dari: <span className="font-mono">{ipAddress}</span>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
        style={{ width: width, height: height, maxWidth: "100%" }}
      >
        <iframe
          src={ipAddress}
          title="ESP32-CAM Stream"
          allow="autoplay"
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
      </div>
    </div>
  );
}
