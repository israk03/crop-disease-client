"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Share2,
  Trash2,
  Loader2,
  CheckCircle2,
  ScanLine,
} from "lucide-react";
import type { Detection, DetectionStatus } from "@/types/api.types";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { SeverityBadge } from "./SeverityBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Production dark theme alignment configurations
const statusConfig: Record<
  DetectionStatus,
  { label: string; className: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    dot: "bg-zinc-500",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400 animate-pulse",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  FAILED: {
    label: "Failed",
    className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    dot: "bg-rose-500",
  },
};

interface DetectionTableRowProps {
  detection: Detection;
  onDelete: (id: string) => void | Promise<unknown>;
  onToggleSharing: (id: string) => void | Promise<unknown>;
  isDeleting: boolean;
  isToggling: boolean;
}

export const DetectionTableRow = memo(function DetectionTableRow({
  detection,
  onDelete,
  onToggleSharing,
  isDeleting,
  isToggling,
}: DetectionTableRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const result = detection.aiResult;
  const status = statusConfig[detection.status] ?? statusConfig.PENDING;

  const formattedDate = useMemo(
    () => formatDate(detection.createdAt),
    [detection.createdAt]
  );

  const relativeDate = useMemo(
    () => timeAgo(detection.createdAt),
    [detection.createdAt]
  );

  return (
    <>
      {/* Fixed root table container node */}
      <tr className="group border-b border-zinc-800/60 bg-[#14171c]/30 hover:bg-[#14171c]/80 transition-colors duration-150">
        
        {/* 1. Image + Crop metadata field */}
        <td className="px-4 py-3.5 pl-5">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#0f1115]">
              {detection.imageUrl ? (
                <Image
                  src={detection.imageUrl}
                  alt={`${detection.cropType} detection`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                  <ScanLine className="h-4 w-4" />
                </div>
              )}
            </div>
            
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-100">
                {detection.cropType}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500 font-medium font-mono">
                {formattedDate}
              </p>
            </div>
          </div>
        </td>

        {/* 2. Disease Result Column */}
        <td className="px-3 py-3.5">
          {detection.status === "COMPLETED" && result ? (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                {result.isHealthy && (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                )}
                <p className="truncate text-sm font-medium text-zinc-200">
                  {result.diseaseName}
                </p>
              </div>
              {!result.isHealthy && (
                <p className="text-[11px] font-mono font-medium text-zinc-500">
                  {Math.round(result.confidenceScore)}% confidence
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs italic text-zinc-500 font-medium">
              {detection.status === "FAILED" ? "Analysis failed" : "In analysis pipeline..."}
            </p>
          )}
        </td>

        {/* 3. Severity Level Column */}
        <td className="px-3 py-3.5">
          {detection.status === "COMPLETED" && result && !result.isHealthy ? (
            <SeverityBadge severity={result.severityLevel} size="sm" />
          ) : detection.status === "COMPLETED" && result?.isHealthy ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
              ✓ Healthy
            </span>
          ) : (
            <span className="text-sm text-zinc-700 font-mono">—</span>
          )}
        </td>

        {/* 4. Status Indicator Tag Cell */}
        <td className="px-3 py-3.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold font-mono uppercase tracking-wide",
              status.className
            )}
          >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", status.dot)} />
            {status.label}
          </span>
        </td>

        {/* 5. Relative Time (Hidden on Mobile) */}
        <td className="hidden px-3 py-3.5 sm:table-cell">
          <p className="whitespace-nowrap text-xs text-zinc-400 font-medium font-mono">
            {relativeDate}
          </p>
        </td>

        {/* 6. Community Shared Tag (Hidden on Mobile/Tablet) */}
        <td className="hidden px-3 py-3.5 md:table-cell">
          {detection.isShared ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 font-mono uppercase tracking-wider">
              <Share2 className="h-2.5 w-2.5" />
              Shared
            </span>
          ) : (
            <span className="text-xs text-zinc-600 font-semibold font-mono uppercase tracking-wider pl-1">
              Private
            </span>
          )}
        </td>

        {/* 7. Dropdown Menu Actions Trigger */}
        <td className="pl-3 pr-5 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all opacity-100 md:opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Detection actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 bg-[#0f1115] border-zinc-800 text-zinc-300">
              <DropdownMenuItem className="focus:bg-zinc-800/60 focus:text-white cursor-pointer rounded-lg gap-2">
                <Link href={ROUTES.FARMER.DETECTION(detection._id)}>
                  <Eye className="h-3.5 w-3.5 text-zinc-400" />
                  View Report
                </Link>
              </DropdownMenuItem>

              {detection.status === "COMPLETED" && (
                <DropdownMenuItem
                  onClick={() => onToggleSharing(detection._id)}
                  disabled={isToggling}
                  className="focus:bg-zinc-800/60 focus:text-white cursor-pointer rounded-lg gap-2"
                >
                  {isToggling ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Share2 className="h-3.5 w-3.5 text-zinc-400" />
                  )}
                  {detection.isShared ? "Remove from Community" : "Share with Community"}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-zinc-800/80" />

              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer rounded-lg gap-2"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* Confirmation Modal Framework */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-sm bg-[#0f1115] border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete Detection</DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs leading-relaxed pt-1">
              This will permanently delete this analysis record and remove the image from system storage assets. This action cannot be reversed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                onDelete(detection._id);
                setShowDeleteDialog(false);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-3.5 w-3.5" />
              )}
              Delete Detection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});