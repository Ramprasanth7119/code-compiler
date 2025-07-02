// MetricsPanel.jsx
import React from "react";

export default function MetricsPanel({ execCount, execTime, status, language }) {
  return (
    <div className="bg-white mt-6 p-4 rounded shadow-md border">
      <h2 className="text-lg font-bold mb-2">📊 Execution Metrics</h2>
      <ul className="text-sm space-y-1">
        <li><strong>Language:</strong> {language.toUpperCase()}</li>
        <li><strong>Total Executions:</strong> {execCount}</li>
        <li><strong>Last Execution Time:</strong> {execTime} ms</li>
        <li><strong>Status:</strong>{" "}
          <span className={`font-semibold ${
            status === "success"
              ? "text-green-600"
              : status === "error"
              ? "text-red-600"
              : "text-gray-500"
          }`}>
            {status ? status.toUpperCase() : "N/A"}
          </span>
        </li>
      </ul>
    </div>
  );
}
