// LanguageUsageChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LanguageUsageChart({ usageMap }) {
  const data = {
    labels: Object.keys(usageMap),
    datasets: [
      {
        label: "Executions",
        data: Object.values(usageMap),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white mt-6 p-4 rounded shadow-md border">
      <h2 className="text-lg font-bold mb-2">📈 Language Usage</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
