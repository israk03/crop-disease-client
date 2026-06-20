import Image from "next/image";
import Link from "next/link";
import { Detection } from "@/types/api.types";
import { cn, timeAgo, getSeverityColor } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface RecentDetectionCardProps {
  detection: Detection;
}

const statusStyles: Record<string, string> = {
  PENDING:
    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
  PROCESSING:
    "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
  COMPLETED:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
  FAILED:
    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
};

export function RecentDetectionCard({
  detection,
}: RecentDetectionCardProps) {
  return (
    <Link
      href={ROUTES.FARMER.DETECTION(detection._id)}
      className="group flex items-center gap-4 p-3.5 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm select-none"
    >
      {/* High-Resolution Leaf Imagery Viewport Thumbnail */}
      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-800 ring-1 ring-black/5">
        <Image
          src={detection.imageUrl || "/placeholder.png"}
          alt={detection.cropType}
          fill
          sizes="48px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Primary Crop Identity and Diagnostic Summary */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-wide uppercase font-mono">
          {detection.cropType}
        </p>

        <p className={cn(
          "text-xs font-medium truncate",
          detection.status === "COMPLETED" && detection.aiResult
            ? detection.aiResult.isHealthy
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-700 dark:text-zinc-300 font-semibold"
            : detection.status === "FAILED"
            ? "text-rose-500 font-semibold"
            : "text-zinc-400 dark:text-zinc-500 animate-pulse"
        )}>
          {detection.status === "COMPLETED" && detection.aiResult
            ? detection.aiResult.isHealthy
              ? "✓ Crop Healthy"
              : detection.aiResult.diseaseName
            : detection.status === "FAILED"
            ? "Analysis failed"
            : "Processing payload..."}
        </p>
      </div>

      {/* Meta Indicators and Telemetry Time Records */}
      <div className="shrink-0 flex flex-col items-end gap-2 pl-2">
        {detection.status === "COMPLETED" &&
        detection.aiResult &&
        !detection.aiResult.isHealthy ? (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold font-mono border uppercase tracking-wider shadow-sm",
              getSeverityColor(detection.aiResult.severityLevel)
            )}
          >
            {detection.aiResult.severityLevel}
          </span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold font-mono border uppercase tracking-wider",
              statusStyles[detection.status]
            )}
          >
            {detection.status}
          </span>
        )}

        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
          {timeAgo(detection.createdAt)}
        </span>
      </div>
    </Link>
  );
}