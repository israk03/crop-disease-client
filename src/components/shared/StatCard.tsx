import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "success" | "warning" | "danger";
  isLoading?: boolean;
}

const variantStyles = {
  default:
    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
  success:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
  warning:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
  danger:
    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
};

const borderStyles = {
  default: "focus-within:border-zinc-300 dark:focus-within:border-zinc-700",
  success: "hover:border-emerald-500/30 dark:hover:border-emerald-400/20",
  warning: "hover:border-amber-500/30 dark:hover:border-amber-400/20",
  danger: "hover:border-rose-500/30 dark:hover:border-rose-400/20",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = "default",
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900/50 space-y-4 animate-pulse select-none">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>
        <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-3 w-40 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300 select-none flex flex-col justify-between min-h-35.5",
        borderStyles[variant]
      )}
      role="region"
      aria-label={label}
    >
      {/* Structural Header Layout Block */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border shrink-0 transition-colors duration-200",
            variantStyles[variant]
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono truncate">
          {label}
        </p>
      </div>

      {/* Main Aggregation Numeric Content Row */}
      <div className="mt-4 flex items-baseline justify-between gap-2 flex-wrap">
        <p className="text-3xl font-bold font-display text-zinc-900 dark:text-zinc-50 tracking-tight tabular-nums">
          {value}
        </p>

        {/* Dynamic Trend Overlay Badge */}
        {trend && (
          <p
            className={cn(
              "text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border",
              trend.value > 0
                ? "text-emerald-600 bg-emerald-500/5 border-emerald-500/10 dark:text-emerald-400"
                : trend.value < 0
                ? "text-rose-600 bg-rose-500/5 border-rose-500/10 dark:text-rose-400"
                : "text-zinc-500 bg-zinc-500/5 border-zinc-500/10"
            )}
          >
            <span className="mr-0.5 inline-block transform transition-transform">
              {trend.value > 0 ? "↑" : trend.value < 0 ? "↓" : "•"}
            </span>{" "}
            {Math.abs(trend.value)}% <span className="text-zinc-400 dark:text-zinc-500 font-normal font-sans ml-0.5">{trend.label}</span>
          </p>
        )}
      </div>
    </div>
  );
}