"use client";

import { useState } from "react";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: companyName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred.");
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI Investment Research Agent</h1>
      
      <form onSubmit={handleAnalyze} className="mb-8 flex gap-4">
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name (e.g. Apple)"
          className="border p-2 rounded flex-1"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !companyName.trim()}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-8">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="mb-8">
          <p className="text-lg opacity-80 animate-pulse">Running full LangGraph workflow. This will take several minutes...</p>
        </div>
      )}

      {result && (
        <div>
          <h2 className="text-xl font-bold mb-4">Workflow Result (GraphState JSON)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
