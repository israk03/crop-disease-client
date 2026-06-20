"use client";

import { cn } from "@/lib/utils";
import type { SeverityLevel } from "@/types/api.types";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const severityConfig: Record<
  SeverityLevel,
  { label: string; className: string; dot: string }
> = {
  LOW: {
    label: "Low Severity",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
    dot: "bg-emerald-500 dark:bg-emerald-400 ring-emerald-500/20",
  },
  MEDIUM: {
    label: "Medium Severity",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
    dot: "bg-amber-500 dark:bg-amber-400 ring-amber-500/20",
  },
  HIGH: {
    label: "High Severity",
    className:
      "bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40",
    dot: "bg-orange-500 dark:bg-orange-400 ring-orange-500/20",
  },
  CRITICAL: {
    label: "Critical Threat",
    className:
      "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40 animate-pulse",
    dot: "bg-rose-500 dark:bg-rose-400 ring-rose-500/30",
  },
};

const sizeStyles = {
  sm: "text-[10px] px-2 py-0.5 gap-1.5 font-bold font-mono tracking-wider uppercase",
  md: "text-xs px-2.5 py-1 gap-2 font-bold font-mono tracking-wider uppercase",
  lg: "text-sm px-3 py-1.5 gap-2.5 font-bold font-mono tracking-wider uppercase",
};

const dotSizes = {
  sm: "w-1.5 h-1.5 ring-2",
  md: "w-2 h-2 ring-2",
  lg: "w-2.5 h-2.5 ring-4",
};

export function SeverityBadge({
  severity,
  size = "md",
  className,
}: SeverityBadgeProps) {
  // Safe extraction fallback routing
  const config = severityConfig[severity] ?? severityConfig.MEDIUM;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border shadow-sm select-none shrink-0 transition-all duration-200",
        config.className,
        sizeStyles[size],
        className
      )}
    >
      {/* Decorative indicator status dot */}
      <span
        className={cn(
          "rounded-full shrink-0 ring-offset-background transition-colors",
          config.dot,
          dotSizes[size]
        )}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  );
}