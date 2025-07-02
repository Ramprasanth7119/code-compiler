// ExecutionHistory.jsx
import React from "react";

export default function ExecutionHistory({ history }) {
  return (
    <div className="bg-white mt-6 p-4 rounded shadow-md border">
      <h2 className="text-lg font-bold mb-2">🧾 Execution History (Last 10)</h2>
      <ul className="text-sm divide-y divide-gray-200">
        {history.length === 0 ? (
          <li className="py-2 text-gray-500">No history yet.</li>
        ) : (
          history.map((item, index) => (
            <li key={index} className="py-2">
              <strong>{item.language.toUpperCase()}</strong> – {item.status.toUpperCase()} – {item.time}ms <br />
              <span className="text-xs text-gray-500">{item.timestamp}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
