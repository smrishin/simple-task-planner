"use client";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (res.ok) {
      window.location.href = "/view";
    } else {
      setError("Invalid code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Enter Access Code</h1>
      <input
        type="password"
        className="p-2 rounded bg-gray-700 mb-2"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
