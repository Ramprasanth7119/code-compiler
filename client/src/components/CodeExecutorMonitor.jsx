import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_KEY, API_URL } from "../config";
import ExecutionHistory from "./ExecutionHistory";
import LanguageUsageChart from "./LanguageUsageChart";
import MetricsPanel from "./MetricsPanel";

const languages = ["python", "node", "cpp", "java"];

const languageSnippets = {
  python: "print('Hello from Python')",
  node: "console.log('Hello from Node.js');",
  cpp: "#include<iostream>\nusing namespace std;\nint main() {\n  cout << \"Hello from C++\" << endl;\n  return 0;\n}",
  java: "public class Hello {\n  public static void main(String[] args) {\n    System.out.println(\"Hello from Java\");\n  }\n}"
};

export default function CodeExecutorMonitor() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(languageSnippets["python"]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(API_KEY);
  const [status, setStatus] = useState(null);
  const [execTime, setExecTime] = useState(0);
  const [history, setHistory] = useState([]);
  const [usageMap, setUsageMap] = useState({
    python: 0,
    node: 0,
    cpp: 0,
    java: 0
  });
  
  console.log("API Key:", API_KEY);
  console.log("API URL:", API_URL);

  useEffect(() => {
    setCode(languageSnippets[language]);
  }, [language]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("exec_history") || "[]");
    const savedUsage = JSON.parse(localStorage.getItem("usage_map") || "{}");
    setHistory(savedHistory);
    setUsageMap((prev) => ({
      ...prev,
      ...savedUsage
    }));
  }, []);

  const downloadCSV = () => {
    if (history.length === 0) return;
    const csv = [
      "Language,Status,Execution Time (ms),Timestamp",
      ...history.map(
        (h) => `${h.language},${h.status},${h.time},${h.timestamp}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "execution_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "execution_history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const runCode = async () => {
    setLoading(true);
    setStatus(null);
    setOutput("");
    const start = Date.now();

    try {
      const res = await axios.post(
        API_URL,
        { code, language },
        { headers: { "x-api-key": apiKey } }
      );

      const end = Date.now();
      const execDuration = end - start;
      const resultStatus = res.data.output ? "success" : "error";

      setExecTime(execDuration);
      setOutput(res.data.output || res.data.error || "No response");
      setStatus(resultStatus);

      const updatedHistory = [
        {
          language,
          status: resultStatus,
          time: execDuration,
          timestamp: new Date().toLocaleString()
        },
        ...history.slice(0, 49)
      ];

      const updatedUsage = {
        ...usageMap,
        [language]: (usageMap[language] || 0) + 1
      };

      setHistory(updatedHistory);
      setUsageMap(updatedUsage);

      localStorage.setItem("exec_history", JSON.stringify(updatedHistory));
      localStorage.setItem("usage_map", JSON.stringify(updatedUsage));
    } catch (err) {
      const end = Date.now();
      const execDuration = end - start;
      setExecTime(execDuration);
      setOutput(err.response?.data?.error || err.message);
      setStatus("error");

      const updatedHistory = [
        {
          language,
          status: "error",
          time: execDuration,
          timestamp: new Date().toLocaleString()
        },
        ...history.slice(0, 49)
      ];

      const updatedUsage = {
        ...usageMap,
        [language]: (usageMap[language] || 0) + 1
      };

      setHistory(updatedHistory);
      setUsageMap(updatedUsage);

      localStorage.setItem("exec_history", JSON.stringify(updatedHistory));
      localStorage.setItem("usage_map", JSON.stringify(updatedUsage));
    } finally {
      setLoading(false);
    }
  };

  const execCount = Object.values(usageMap).reduce((sum, val) => sum + val, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚀 Code Executor Monitor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">API Key</label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your API key"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Select Language</label>
            <div className="flex gap-2 flex-wrap">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded ${
                    language === lang
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Code</label>
            <textarea
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 font-mono border rounded"
            />
            <button
              onClick={runCode}
              disabled={loading || !apiKey.trim()}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Output</label>
            <textarea
              rows={14}
              readOnly
              value={output}
              className="w-full p-3 font-mono border rounded bg-gray-100"
            />
            {status && (
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded ${
                  status === "success"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {status.toUpperCase()}
              </span>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={downloadCSV}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download CSV
            </button>
            <button
              onClick={downloadJSON}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Download JSON
            </button>
          </div>

          <MetricsPanel
            execCount={execCount}
            execTime={execTime}
            status={status}
            language={language}
          />
        </div>
      </div>

      {/* Bottom Panel */}
      <ExecutionHistory history={history} />
      <LanguageUsageChart usageMap={usageMap} />
    </div>
  );
}
