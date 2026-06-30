import Link from "next/link";
import { ScanLine, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

interface DetectionEmptyStateProps {
  hasFilters: boolean;
}

const containerClass =
  "flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-zinc-800 bg-[#14171c] shadow-sm w-full";

export function DetectionEmptyState({
  hasFilters,
}: DetectionEmptyStateProps) {
  
  // ── Case A: Active Filter Empty State (Search terms yielded nothing) ──
  if (hasFilters) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`${containerClass} space-y-4`}
      >
        {/* Abstract Outlined Lens Icon Placeholder Container */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f1115] border border-zinc-800 text-zinc-500">
          <SearchX className="h-5 w-5" />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-zinc-100">
            No detections match your query
          </p>
          <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
            Try tweaking your search keywords, updating your spelling, or selecting a alternative status tag modifier.
          </p>
        </div>
      </div>
    );
  }

  // ── Case B: First Onboarding Empty State (Brand new history database profile) ──
  return (
    <div
      role="status"
      aria-live="polite"
      className={`${containerClass} space-y-5 py-20`}
    >
      {/* Interactive Scan Radial Container Widget Glow */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <ScanLine className="h-6 w-6 animate-pulse" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-base font-semibold text-zinc-100 tracking-tight">
          No detections logged yet
        </p>
        <p className="max-w-xs text-xs text-zinc-400 leading-relaxed">
          Upload your first high-resolution crop image to run diagnosis assessments and map localized disease vectors with advanced AI tracking.
        </p>
      </div>

      <Button
        asChild
        className="gap-2 bg-emerald-500 text-zinc-950 font-bold text-xs uppercase tracking-wider font-mono px-5 h-10 rounded-xl hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/10 focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115]"
      >
        <Link href={ROUTES.FARMER.DETECT}>
          <ScanLine className="h-3.5 w-3.5 stroke-[2.5]" />
          Start Your First Detection
        </Link>
      </Button>
    </div>
  );
}