"use client";
import { FC } from "react";

interface PuffBarsProps {
  count: number;
  max?: number;
}

const PuffBars: FC<PuffBarsProps> = ({ count, max = 30 }) => {
  const percentage = Math.min((count / max) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2 w-[90vw] mx-auto">
      {/* Puff count */}
      <span className="text-white text-lg font-semibold">
        {count} / {max}
      </span>

      {/* Gradient bar */}
      <div className="relative w-full h-20 overflow-hidden rounded-lg bg-gray-700 shadow-md">
        {/* Gradient background (full bar) */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500" />

        {/* Overlay mask with transition */}
        <div
          className="absolute inset-y-0 right-0 bg-gray-700 transition-all duration-500 ease-in-out"
          style={{ width: `${100 - percentage}%` }}
        />
      </div>
    </div>
  );
};

export default PuffBars;
