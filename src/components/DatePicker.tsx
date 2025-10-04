"use client";
import { useState, useEffect } from "react";

interface DatePickerProps {
  date: string;
  onDateChange: (date: string) => void;
}

const getLocalDate = () => {
  return new Date().toLocaleDateString("en-CA");
};

const shiftDate = (dateStr: string, days: number) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
};

export default function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    setTimezone(
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone.replace(/_/g, " ")
        .replace(/\//g, " - ")
    );
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <input
        type="date"
        className="bg-gray-700 text-white p-2 rounded"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
      />
      <button
        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded"
        onClick={() => onDateChange(shiftDate(date, -1))}
      >
        &lt;
      </button>
      <button
        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded"
        onClick={() => onDateChange(shiftDate(date, 1))}
      >
        &gt;
      </button>
      <span className="text-gray-400 whitespace-nowrap">{timezone}</span>
      <button
        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded"
        onClick={() => onDateChange(getLocalDate())}
      >
        Today
      </button>
    </div>
  );
}
