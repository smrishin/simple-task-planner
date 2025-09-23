"use client";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

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
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="tel"
          inputMode="numeric"
          pattern="\d*"
          className="p-2 rounded bg-gray-700 mb-2 masked-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
