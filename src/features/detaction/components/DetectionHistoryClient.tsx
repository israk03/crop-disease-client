"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScanLine, Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { DetectionFilters } from "./DetectionFilters";
import { DetectionTableRow } from "./DetectionTableRow";
import { DetectionEmptyState } from "./DetectionEmptyState";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useDeleteDetection } from "../hooks/use-delete-detection";
import { useToggleSharing } from "../hooks/use-toggle-sharing";
import { useMyDetections } from "../hooks/use-detections";

type StatusFilter = "ALL" | "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

// ── Skeleton row matching the dark theme table structure ──────
function TableRowSkeleton() {
  return (
    <tr className="border-b border-zinc-800/40 bg-[#14171c]/10">
      <td className="py-4 pl-5 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#14171c] border border-zinc-800 animate-pulse shrink-0" />
          <div className="space-y-2">
            <div className="h-3.5 w-24 bg-zinc-800 rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-zinc-800/60 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="py-4 px-3">
        <div className="h-3.5 w-32 bg-zinc-800 rounded animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-5 w-16 bg-zinc-800/80 rounded-full animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-5 w-20 bg-zinc-800/80 rounded-full animate-pulse" />
      </td>
      <td className="py-4 px-3 hidden sm:table-cell">
        <div className="h-3 w-16 bg-zinc-800/60 rounded animate-pulse" />
      </td>
      <td className="py-4 px-3 hidden md:table-cell">
        <div className="h-5 w-14 bg-zinc-800/50 rounded-full animate-pulse" />
      </td>
      <td className="py-4 pl-3 pr-5" />
    </tr>
  );
}

export function DetectionHistoryClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  // ── Fetch Operations ───────────────────────────────────────────────────
  const selectedStatus = status === "ALL" ? undefined : status;

  const queryParams = {
    status: selectedStatus,
    page,
    limit: LIMIT,
  };
  
  const { detections = [], meta, isLoading } = useMyDetections(queryParams);
  const totalPages = meta?.totalPages ?? 1;

  const deleteMutation = useDeleteDetection();
  const toggleMutation = useToggleSharing();

  // ── Client-side filter matching ─────────────────────────────────────────
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return detections;

    return detections.filter(
      (d) =>
        d.cropType.toLowerCase().includes(query) ||
        (d.aiResult?.diseaseName ?? "").toLowerCase().includes(query)
    );
  }, [detections, search]);

  const hasFilters = status !== "ALL" || search.trim().length > 0;

  // ── Page Summary Stats ──────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: meta?.total ?? 0,
      completed: detections.filter((d) => d.status === "COMPLETED").length,
      failed: detections.filter((d) => d.status === "FAILED").length,
      pending: detections.filter(
        (d) => d.status === "PENDING" || d.status === "PROCESSING"
      ).length,
    }),
    [detections, meta]
  );

  // ── Input Handlers ──────────────────────────────────────────────────────
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleSharing = (id: string) => {
    toggleMutation.mutate(id);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 select-none">
      
      {/* ── Page Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <ScanLine className="h-4 w-4 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-100 uppercase">
              Detection History
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-medium pl-12">
            Manage your AI-powered plant health records and regional diagnosis telemetry logs.
          </p>
        </div>

        <Link href={ROUTES.FARMER.DETECT}>
          <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider gap-2 h-10 px-4 rounded-xl shadow-lg shadow-emerald-500/5 transition-all duration-200 shrink-0 w-full sm:w-auto">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            New Detection
          </Button>
        </Link>
      </div>

      {/* ── Interactive Summary Statistics Stream ── */}
      {!isLoading && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 pt-1"
        >
          {[
            {
              label: "Total Logs",
              value: stats.total,
              color: "bg-[#14171c] text-zinc-400 border-zinc-800",
            },
            {
              label: "Completed",
              value: stats.completed,
              color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            },
            {
              label: "In Progress",
              value: stats.pending,
              color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            },
            {
              label: "Failed",
              value: stats.failed,
              color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            },
          ].map(({ label, value, color }) => (
            <span
              key={label}
              className={`inline-flex items-center border rounded-full px-3 py-0.5 text-xs font-bold font-mono uppercase tracking-wide shadow-sm ${color}`}
            >
              {value} {label}
            </span>
          ))}
        </motion.div>
      )}

      {/* ── Primary Interactive Workspace Shell ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-2xl border border-zinc-800 bg-[#0f1115] shadow-xl overflow-hidden w-full"
      >
        {/* Top Filters Block */}
        <div className="p-4 border-b border-zinc-800/60 bg-[#14171c]/20">
          <DetectionFilters
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            totalCount={filtered.length}
            isLoading={isLoading}
          />
        </div>

        {/* Main Records Table Presentation Window */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#14171c]/40">
                {[
                  { label: "Crop / Analysis Date", className: "pl-5 pr-3 w-56" },
                  { label: "Pathology Identity", className: "px-3" },
                  { label: "Severity Status", className: "px-3" },
                  { label: "Pipeline Status", className: "px-3" },
                  { label: "Age Log", className: "px-3 hidden sm:table-cell" },
                  { label: "Visibility", className: "px-3 hidden md:table-cell" },
                  { label: "", className: "pl-3 pr-5 w-12" },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={`py-3.5 text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-500 ${col.className}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <DetectionEmptyState hasFilters={hasFilters} />
                  </td>
                </tr>
              ) : (
                filtered.map((detection) => (
                  <DetectionTableRow
                    key={detection._id}
                    detection={detection}
                    onDelete={handleDelete}
                    onToggleSharing={handleToggleSharing}
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === detection._id
                    }
                    isToggling={
                      toggleMutation.isPending &&
                      toggleMutation.variables === detection._id
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Client-Side Pagination Bar */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800 bg-[#14171c]/10">
            <p className="text-xs font-mono font-semibold text-zinc-500">
              Page {page} of {totalPages} <span className="text-zinc-700">·</span> {meta?.total} total records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-xs font-mono font-bold uppercase tracking-wider px-3 h-8 rounded-xl bg-transparent border-zinc-800 text-zinc-400 hover:bg-[#14171c] hover:text-zinc-200 disabled:opacity-40 gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-xs font-mono font-bold uppercase tracking-wider px-3 h-8 rounded-xl bg-transparent border-zinc-800 text-zinc-400 hover:bg-[#14171c] hover:text-zinc-200 disabled:opacity-40 gap-1"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}