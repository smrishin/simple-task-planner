"use client";
import { useState, useEffect } from "react";

interface DatePickerProps {
  date: string;
  onDateChange: (date: string) => void;
}

const getLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
