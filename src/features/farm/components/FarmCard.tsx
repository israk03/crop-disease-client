"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  MapPin, Tractor, MoreHorizontal,
  Edit2, Trash2, Loader2, ArrowRight,
} from "lucide-react";

import type { Farm } from "@/types/api.types";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

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

const SOIL_LABELS: Record<string, string> = {
  CLAY:   "Clay",
  SANDY:  "Sandy",
  LOAMY:  "Loamy",
  SILTY:  "Silty",
  PEATY:  "Peaty",
  CHALKY: "Chalky",
  OTHER:  "Other",
};

interface FarmCardProps {
  farm:         Farm;
  cropCount?:   number;
  onEdit:       (farm: Farm) => void;
  onDelete:     (farmId: string) => void;
  isDeleting:   boolean;
}

export function FarmCard({
  farm,
  cropCount = 0,
  onEdit,
  onDelete,
  isDeleting,
}: FarmCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const hasLocation = Boolean(farm.location?.coordinates);

  // Fix 1: Wrap in useMemo to prevent re-allocation on every render
  const stats = useMemo(() => [
    {
      label: "Size",
      value: `${farm.size.toFixed(2)} ha`,
      icon: "📐",
    },
    {
      label: "Crops",
      value: cropCount.toString(),
      icon: "🌾",
    },
    {
      label: "GPS",
      value: hasLocation ? "Set" : "Not set",
      icon: "📍",
      className: hasLocation
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-zinc-400",
    },
  ], [farm.size, cropCount, hasLocation]);

  const handleDelete = () => {
    onDelete(farm._id);
    // Fix 2: Do not close modal instantly; allow the parent loading state to keep it active or close on success
    if (!isDeleting) {
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-md transition-all duration-200">
        
        {/* Top color bar — visual identity for the card */}
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 to-emerald-400" />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <Tractor className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                  {farm.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                  {SOIL_LABELS[farm.soilType] ?? farm.soilType} soil
                </p>
              </div>
            </div>

            {/* Actions dropdown */}
            <DropdownMenu>
              {/* Fix 3: Added asChild here to prevent nested button elements */}
              <DropdownMenuTrigger>
                <button
                  disabled={isDeleting}
                  className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                  aria-label="Farm actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => onEdit(farm)}
                  className="gap-2"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Farm
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Farm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {stats.map(({ label, value, icon, className }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-2.5 text-center min-w-0"
              >
                <span className="text-base" role="img" aria-label={label}>{icon}</span>
                <p className={cn(
                  "text-xs font-bold mt-1 text-zinc-900 dark:text-zinc-50 truncate w-full",
                  className
                )}>
                  {value}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate w-full">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{farm.region} · {farm.address}</span>
          </div>

          {/* View farm link */}
          <Link
            href={ROUTES.FARMER.FARM(farm._id)}
            className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-800 dark:hover:text-emerald-400 transition-all"
          >
            <span>View Farm Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog 
        open={showDeleteDialog} 
        onOpenChange={(open) => {
          // Prevent closing via backdrop/escape key while mutation executes
          if (isDeleting) return;
          setShowDeleteDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {farm.name}?</DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <span>This permanently deletes this farm, its crops, weather records, and related farm data.</span>
              <span className="block font-medium text-amber-600 dark:text-amber-400">Historical disease detections will remain available.</span>
              <span className="block text-zinc-400 dark:text-zinc-500 text-xs">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
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
              Delete Farm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}