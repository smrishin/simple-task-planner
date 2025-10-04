"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DayData {
  count: number;
  max: number;
}
interface PuffHistoryResponse {
  data: Record<string, DayData>; // { "2025-09-01": {count:12,max:25}, ... }
}

export default function PuffHistory() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [year, setYear] = useState(today.getFullYear());
  const router = useRouter();

  const [puffs, setPuffs] = useState<Record<string, DayData>>({});

  // Fetch from Redis API
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/puffs/history?year=${year}&month=${month + 1}`
      );
      if (res.ok) {
        const json: PuffHistoryResponse = await res.json();
        setPuffs(json.data || {});
      } else {
        setPuffs({});
      }
    };
    fetchData();
  }, [year, month]);

  const getDaysInMonth = (y: number, m: number) =>
    new Date(y, m + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = getDaysInMonth(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const getColor = (count: number, max: number) => {
    if (max <= 0) return "bg-gray-800";
    const ratio = count / max;
    if (ratio <= 0.5) return "bg-teal-600";
    if (ratio <= 0.8) return "bg-yellow-500";
    if (ratio <= 1) return "bg-red-500";
    return "bg-red-900";
  };

  // Build cells
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    // filler cells → no border, no bg
    cells.push(<div key={`empty-${i}`} className="h-20" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    const entry = puffs[dateStr];
    const count = entry?.count ?? 0;
    const max = entry?.max ?? 30;

    cells.push(
      <div
        key={d}
        className={`h-20 border p-1 flex flex-col text-xs relative ${
          count ? getColor(count, max) : "bg-gray-800"
        }`}
      >
        <span className="absolute top-1 left-1 text-white">{d}</span>
        <div className="flex-1 flex items-center justify-center text-white text-sm font-semibold">
          {count}/{max}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-2xl font-bold mb-6">Puffs History</h2>
        <button
          onClick={() => router.push("/puffs")}
          className="h-10 px-4 py-2 rounded bg-teal-600/50 hover:bg-teal-700 text-white"
        >
          Back to Puffs
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div />
        <div className="flex items-center justify-center gap-4">
          <button
            className="px-4 py-2 rounded bg-teal-600/50 hover:bg-teal-700 text-white"
            onClick={prevMonth}
          >
            &lt;
          </button>
          <input
            type="month"
            className="bg-gray-700 text-white rounded p-1 cursor-pointer flex justify-center items-center text-center"
            value={`${year}-${String(month + 1).padStart(2, "0")}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-").map(Number);
              setYear(y);
              setMonth(m - 1);
            }}
          />
          <button
            className="px-4 py-2 rounded bg-teal-600/50 hover:bg-teal-700 text-white"
            onClick={nextMonth}
          >
            &gt;
          </button>
        </div>
        <button
          className="px-4 py-2 rounded bg-teal-600/30 hover:bg-teal-700 text-white"
          onClick={() => {
            const today = new Date();
            setYear(today.getFullYear());
            setMonth(today.getMonth());
          }}
        >
          Today
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center font-semibold mb-1 bg-teal-500/30 py-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7">{cells}</div>
    </div>
  );
}
