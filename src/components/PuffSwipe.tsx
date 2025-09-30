"use client";
import { useState, useRef } from "react";

interface PuffSwipeProps {
  onPuff: () => void;
}

export default function PuffSwipe({ onPuff }: PuffSwipeProps) {
  const [pos, setPos] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragPosRef = useRef(0); // always holds latest knob position
  const knobWidth = 72; // matches w-18 h-18 in Tailwind (~72px)

  const startDrag = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();

    const move = (moveClientX: number) => {
      let newPos = moveClientX - trackRect.left - knobWidth / 2;
      newPos = Math.max(0, Math.min(newPos, trackRect.width - knobWidth));
      dragPosRef.current = newPos;
      setPos(newPos);
    };

    const end = () => {
      // Trigger puff if swiped beyond 70%
      if (dragPosRef.current > trackRect.width * 0.7) {
        onPuff();
      }
      // Reset knob to start
      setPos(0);
      dragPosRef.current = 0;

      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
    };

    const mouseMove = (e: MouseEvent) => move(e.clientX);
    const mouseUp = () => end();

    const touchMove = (e: TouchEvent) => move(e.touches[0].clientX);
    const touchEnd = () => end();

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);
  };

  return (
    <div
      ref={trackRef}
      className="relative w-[90vw] h-20 bg-gray-700 overflow-hidden select-none mx-auto rounded-lg"
    >
      {/* Knob */}
      <div
        className="absolute top-1 bottom-1 left-1 w-18 h-18 bg-teal-800 rounded-md cursor-pointer transition-transform duration-150"
        style={{ transform: `translateX(${pos}px)` }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-teal-400 w-full h-full p-2"
        >
          <path
            fillRule="evenodd"
            d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Label */}
      <p className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-lg font-medium">
        PUFF?
      </p>
    </div>
  );
}
