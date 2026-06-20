import { Alert } from "@/types/api.types";
import { MapPin, Calendar, Layers } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

interface AlertFeedCardProps {
  alert: Alert;
}

const levelStyles: Record<string, string> = {
  WATCH:
    "border-l-amber-500 bg-amber-50/40 dark:bg-amber-950/10 border-y-zinc-200 border-r-zinc-200 dark:border-y-zinc-900 dark:border-r-zinc-900",
  WARNING:
    "border-l-orange-500 bg-orange-50/40 dark:bg-orange-950/10 border-y-zinc-200 border-r-zinc-200 dark:border-y-zinc-900 dark:border-r-zinc-900",
  CRITICAL:
    "border-l-rose-500 bg-rose-50/40 dark:bg-rose-950/10 border-y-zinc-200 border-r-zinc-200 dark:border-y-zinc-900 dark:border-r-zinc-900",
};

const levelBadgeStyles: Record<string, string> = {
  WATCH:
    "bg-amber-100 text-amber-800 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  WARNING:
    "bg-orange-100 text-orange-800 border-orange-200/50 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30",
  CRITICAL:
    "bg-rose-100 text-rose-800 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30",
};

export function AlertFeedCard({ alert }: AlertFeedCardProps) {
  return (
    <div
      className={cn(
        "rounded-r-2xl border-l-4 p-4 space-y-3 shadow-sm select-none transition-all duration-200 hover:shadow-md border-t border-b border-r",
        levelStyles[alert.outbreakLevel]
      )}
    >
      {/* Informational Threat Level Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">
            {alert.diseaseName}
          </h3>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider shadow-sm",
            levelBadgeStyles[alert.outbreakLevel]
          )}
        >
          {alert.outbreakLevel}
        </span>
      </div>

      {/* Geolocation and Agricultural Context Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-200/40 dark:border-zinc-800/40">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span className="font-medium truncate max-w-35">{alert.region}</span>
          </div>
          
          <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
            <Layers className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span className="font-mono text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400">{alert.cropType}</span>
          </div>
        </div>

        {/* Dynamic Context Logging Time Stamp */}
        <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
          <Calendar className="h-3 w-3 shrink-0 text-zinc-400/80" />
          <span>{timeAgo(alert.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}