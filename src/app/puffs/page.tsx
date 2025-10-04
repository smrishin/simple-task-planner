"use client";
import { FC, useEffect, useState } from "react";
import DatePicker from "@/components/DatePicker";
import PuffBars from "@/components/PuffBars";
import PuffSwipe from "@/components/PuffSwipe";
import { useRouter } from "next/navigation";
import CONSTANTS from "@/constants";

const PuffsPage: FC = () => {
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [puffs, setPuffs] = useState(0);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/puffs?date=${date}`)
      .then((res) => res.json())
      .then((data) => setPuffs(data.count ?? 0));
  }, [date]);

  const updatePuffs = async () => {
    console.log(`updatepuff log`);
    if (saving) return;
    setSaving(true);
    try {
      const next = puffs + 1;
      setPuffs(next);
      const res = await fetch("/api/puffs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, count: next, max: CONSTANTS.TOTAL_PUFFS })
      });

      const { data } = await res.json();
      if (typeof data?.count === "number") setPuffs(data.count);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">Puffs</h2>
      <div className="mb-4">
        <DatePicker date={date} onDateChange={setDate} />
      </div>
      <PuffBars count={puffs} max={CONSTANTS.TOTAL_PUFFS} />
      <div className="mt-8 w-full">
        <PuffSwipe onPuff={() => updatePuffs()} />
      </div>
      <nav className="mt-12 flex items-center justify-between gap-6 p-4 bg-gray-800 shadow-md ">
        <span className="bg-red-500/30 px-4 py-2">
          {CONSTANTS.TOTAL_PUFFS} puffs max.
        </span>
        <button
          onClick={() => router.push("/puffs/history")}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Puffs History
        </button>
      </nav>
    </div>
  );
};

export default PuffsPage;
