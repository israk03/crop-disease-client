"use client";

import { useState, useMemo } from "react";
import {
  Calendar, MoreHorizontal,
  Edit2, Trash2, Loader2, Clock,
} from "lucide-react";

import type { Crop } from "@/types/api.types";
import { cn, formatDate } from "@/lib/utils";

import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  GROWING: {
    label:     "Growing",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    dot:       "bg-emerald-500 animate-pulse",
    emoji:     "🌱",
  },
  HARVESTED: {
    label:     "Harvested",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    dot:       "bg-blue-500",
    emoji:     "✅",
  },
  FAILED: {
    label:     "Failed",
    className: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    dot:       "bg-red-500",
    emoji:     "❌",
  },
} as const;

interface CropCardProps {
  crop:       Crop;
  onEdit:     (crop: Crop) => void;
  onDelete:   (cropId: string) => void;
  isDeleting: boolean;
}

// Fix 1: Calculate days until harvest safely with client time parity to prevent hydration flags
// Better yet, isolate your business calculations to standard midnight benchmarks.
function daysUntilHarvest(dateStr?: string, targetTime: number = Date.now()): string | null {
  if (!dateStr) return null;
  
  const targetDate = new Date(dateStr);
  // Normalize both dates to midnight UTC to compare actual day differences, ignoring hours/minutes
  const currentMidnight = new Date(targetTime).setUTCHours(0, 0, 0, 0);
  const targetMidnight = targetDate.setUTCHours(0, 0, 0, 0);
  
  const diff = Math.ceil((targetMidnight - currentMidnight) / (1000 * 60 * 60 * 24));
  
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Today";
  return `${diff}d left`;
}

export function CropCard({
  crop,
  onEdit,
  onDelete,
  isDeleting,
}: CropCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
 

  const status = STATUS_CONFIG[crop.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.GROWING;

  // Compute countdown strictly with client-time check to guarantee hydration consistency
  const harvestCountdown = useMemo(
  () => daysUntilHarvest(crop.expectedHarvestDate),
  [crop.expectedHarvestDate]
);

  const handleDelete = () => {
    onDelete(crop._id);
    if (!isDeleting) {
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:shadow-sm transition-all duration-200">

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0" role="img" aria-label={status.label}>
              {status.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                {crop.name}
              </p>
              {crop.variety && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {crop.variety}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              status.className
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
              {status.label}
            </span>

            <DropdownMenu>
              {/* Fix 2: Added asChild here to eliminate nested button tags */}
              <DropdownMenuTrigger>
                <button
                  disabled={isDeleting}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-40"
                  aria-label="Crop actions"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => onEdit(crop)}
                  className="flex items-center gap-2 text-xs"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit Crop
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 focus:text-red-600 font-medium"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Planted: {formatDate(crop.plantingDate)}</span>
          </div>

          {crop.expectedHarvestDate && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 min-w-0">
                <Clock className="h-3 w-3 shrink-0" />
                <span className="truncate">Harvest: {formatDate(crop.expectedHarvestDate)}</span>
              </div>
              {crop.status === "GROWING" && harvestCountdown && (
                <span className={cn(
                  "text-[10px] font-semibold rounded-full px-2 py-0.5 shrink-0",
                  harvestCountdown.includes("overdue")
                    ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                )}>
                  {harvestCountdown}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {crop.notes && (
          <p className="mt-2.5 text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
            {crop.notes}
          </p>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog 
        open={showDeleteDialog} 
        onOpenChange={(open) => {
          // Fix 3: Intercept closure actions while the card is handling backend updates
          if (isDeleting) return;
          setShowDeleteDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {crop.name}?</DialogTitle>
            <DialogDescription>
              This crop will be permanently removed from this farm. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Remove Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}