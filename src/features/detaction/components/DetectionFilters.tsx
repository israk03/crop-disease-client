"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DetectionStatus } from "@/types/api.types";

type StatusFilter = "ALL" | DetectionStatus;

interface DetectionFiltersProps {
  search: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  totalCount: number;
  isLoading?: boolean;
}

const STATUS_OPTIONS: ReadonlyArray<{
  value: StatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "All" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "FAILED", label: "Failed" },
];

// Production-ready dark theme accent styling matching your existing panel design
const statusButtonStyles: Record<StatusFilter, string> = {
  ALL: "bg-zinc-800 text-white border-zinc-700",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  PENDING: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
  FAILED: "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
};

export function DetectionFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  totalCount,
  isLoading = false,
}: DetectionFiltersProps) {
  const hasActiveFilter = status !== "ALL" || search.trim().length > 0;

  return (
    <div className="w-full bg-[#14171c] border border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
      
      {/* ── Top Row: Search input field configuration ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            aria-label="Search detections"
            placeholder="Search by crop type or disease name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 bg-[#0f1115] border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500 h-10 rounded-xl"
          />

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {hasActiveFilter && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("");
              onStatusChange("ALL");
            }}
            className="gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl shrink-0"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      {/* ── Bottom Row: Tag filters and count parameters ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 pr-1">
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
            <span className="text-[10px] uppercase tracking-wider font-bold font-mono text-zinc-500 hidden sm:inline">
              Status:
            </span>
          </div>

          {STATUS_OPTIONS.map((option) => {
            const isActive = status === option.value;

            return (
              <Button
                key={option.value}
                type="button"
                variant="ghost"
                aria-pressed={isActive}
                onClick={() => onStatusChange(option.value)}
                className={cn(
                  "rounded-full px-3.5 h-7 text-xs font-semibold tracking-wide border transition-all duration-200",
                  isActive
                    ? statusButtonStyles[option.value]
                    : "bg-[#0f1115] text-zinc-400 border-zinc-800/80 hover:bg-[#1a1f26] hover:text-zinc-200 hover:border-zinc-700"
                )}
              >
                {option.label}
              </Button>
            );
          })}
        </div>

        {/* Counter Display Badge */}
        <div className="shrink-0 text-xs font-medium font-mono text-zinc-500 pl-1 md:pl-0">
          {isLoading ? (
            <span className="animate-pulse">Analyzing...</span>
          ) : (
            <span>
              {totalCount} {totalCount === 1 ? "result" : "results"}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}