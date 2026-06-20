"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
  score: number; // 0–100
  isHealthy?: boolean;
}

const gaugeColorStyles = {
  healthy: "text-emerald-500 dark:text-emerald-400",
  high: "text-rose-500 dark:text-rose-400",
  medium: "text-orange-500 dark:text-orange-400",
  low: "text-amber-500 dark:text-amber-400",
  uncertain: "text-zinc-400 dark:text-zinc-500",
};

export function ConfidenceGauge({
  score,
  isHealthy = false,
}: ConfidenceGaugeProps) {
  const [animated, setAnimated] = useState(0);

  // Clamp score for safety
  const safeScore = Math.max(0, Math.min(100, score));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(safeScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [safeScore]);

  // Geometric layout configurations
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  // Unified visual indicator definitions
  const getVisualConfig = () => {
    if (isHealthy) {
      return { label: "Healthy Analysis", styles: gaugeColorStyles.healthy };
    }
    if (safeScore >= 80) {
      return { label: "High Confidence", styles: gaugeColorStyles.high };
    }
    if (safeScore >= 60) {
      return { label: "Moderate Confidence", styles: gaugeColorStyles.medium };
    }
    if (safeScore >= 40) {
      return { label: "Low Confidence", styles: gaugeColorStyles.low };
    }
    return { label: "Uncertain Match", styles: gaugeColorStyles.uncertain };
  };

  const currentConfig = getVisualConfig();

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/40 w-fit select-none">
      {/* Gauge Element Container */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 drop-shadow-sm"
          aria-label={`Model classification certainty score: ${safeScore}%`}
        >
          {/* Track underlay ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-100 dark:text-zinc-800/80"
          />

          {/* Precision telemetry overlay path */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-1000 ease-out", currentConfig.styles)}
          />
        </svg>

        {/* Center Text Telemetry Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50 tracking-tighter tabular-nums">
            {safeScore}
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 ml-0.5">%</span>
          </span>
          <span className="text-[9px] font-bold font-mono tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Score
          </span>
        </div>
      </div>

      {/* Meta Label Indicator */}
      <span className={cn("text-[10px] font-bold font-mono uppercase tracking-wider", currentConfig.styles)}>
        {currentConfig.label}
      </span>
    </div>
  );
}