"use client";

import { useEffect, useState } from "react";
import { scoreColor } from "@/lib/utils";

interface ProgressRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  animate?: boolean;
}

export function ProgressRing({
  score,
  size = 96,
  strokeWidth = 8,
  label,
  color,
  animate = true,
}: ProgressRingProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringColor = color ?? scoreColor(displayed);
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    if (!animate) return;
    let start: number | null = null;
    const duration = 1000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplayed(Math.round(progress * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score, animate]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100 dark:text-zinc-800"
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: animate ? "stroke-dashoffset 0.05s linear" : "none" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">
            {displayed}
          </span>
          <span className="text-[10px] text-gray-400 leading-none">/ 100</span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}
