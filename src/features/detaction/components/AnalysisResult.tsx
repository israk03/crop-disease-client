"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Leaf, Share2, Trash2, Calendar, ShieldAlert, Sparkles } from "lucide-react";

import type { Detection } from "@/types/api.types";
import { formatDate } from "@/lib/utils";

import { SeverityBadge } from "./SeverityBadge";
import { ConfidenceGauge } from "./ConfidenceGauge";
import { TreatmentTabs } from "./TreatmentTabs";
import { Button } from "@/components/ui/button";

interface AnalysisResultProps {
  detection: Detection;
  onNewDetection: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

export function AnalysisResult({
  detection,
  onNewDetection,
  onShare,
  onDelete,
}: AnalysisResultProps) {
  const result = detection.aiResult;

  // ─────────────────────────────────────────────────────────────
  // 1. FAILED LOGIC OVERLAY
  // ─────────────────────────────────────────────────────────────
  if (detection.status === "FAILED") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-14 px-6 text-center border border-rose-100 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/5 rounded-2xl max-w-md mx-auto space-y-5"
      >
        <div className="p-3 bg-rose-100 dark:bg-rose-950/50 rounded-full text-rose-600 dark:text-rose-400">
          <XCircle className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-bold font-mono tracking-wide uppercase text-zinc-900 dark:text-zinc-50">
            Analysis Pipeline Failure
          </h3>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
            {detection.errorMessage ?? "An unhandled exception occurred during computer vision extraction."}
          </p>
        </div>

        <Button 
          onClick={onNewDetection}
          className="bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-5 transition-transform active:scale-[0.98]"
        >
          Re-initialize Scan
        </Button>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. DATA BUFFERING / MISSING LOOKUP
  // ─────────────────────────────────────────────────────────────
  if (!result) {
    return (
      <div className="py-14 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md mx-auto bg-zinc-50/50 dark:bg-zinc-900/10">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Telemetry Streams Desynchronized
        </p>
        <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-1">
          Analysis result record payload is not populated yet.
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. MAIN WORKSPACE PRESENTATION LAYER
  // ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 max-w-2xl mx-auto select-none"
    >
      {/* Dynamic Crop Pathology Card Canvas Viewport */}
      <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 shadow-inner">
        <Image
          src={detection.imageUrl}
          alt={detection.cropType}
          fill
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />

        {/* Dynamic Left Asset Tag Indicator */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950/70 px-3 py-1.5 text-[10px] font-bold font-mono tracking-wider uppercase text-white backdrop-blur-md border border-white/10 shadow-sm">
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
            <span>{detection.cropType}</span>
          </span>
        </div>

        {/* Dynamic Right Timestamp Indicator */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950/70 px-3 py-1.5 text-[10px] font-bold font-mono tracking-wider uppercase text-white backdrop-blur-md border border-white/10 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>{formatDate(detection.createdAt)}</span>
          </span>
        </div>
      </div>

      {/* Primary Diagnostic Summary Metadata Segment */}
      <div className="p-5 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl shadow-sm">
        {result.isHealthy ? (
          <div className="flex items-center gap-4 py-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-400/5 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/2">
              <CheckCircle2 className="h-6 w-6 animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono uppercase">
                Biomass Clear • Healthy
              </h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Computer vision models identified no active pathological or bacterial disease vectors.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  <h3 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono uppercase truncate">
                    {result.diseaseName}
                  </h3>
                </div>

                <SeverityBadge severity={result.severityLevel} />
              </div>

              <div className="shrink-0 self-center sm:self-start">
                <ConfidenceGauge
                  score={result.confidenceScore}
                  isHealthy={result.isHealthy}
                />
              </div>
            </div>

            {/* Targeted Crop Anatomical Vectors Affected */}
            {result.affectedParts && result.affectedParts.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Targeted Morphological Structures
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.affectedParts.map((part) => (
                    <span
                      key={part}
                      className="rounded-lg bg-zinc-50 border border-zinc-100 dark:bg-zinc-800/40 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-bold font-mono text-zinc-600 dark:text-zinc-400 capitalize tracking-wide"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Abstract AI Model Output Insights Component */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-sm space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Agronomic Analysis Synthesis
          </p>
        </div>
        <p className="text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
          {result.aiSummary}
        </p>
      </div>

      {/* Tactical Counter-measure Execution Protocol Tabs */}
      {!result.isHealthy && <TreatmentTabs result={result} />}

      {/* Operational Task Controller Steering Actions row */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onNewDetection}
          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-11 transition-transform active:scale-[0.99] shadow-md shadow-emerald-600/5"
        >
          Initialize New Scan
        </Button>

        {onShare && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onShare}
            className="rounded-xl border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60 h-11 w-11 shrink-0 text-zinc-500 dark:text-zinc-400"
            title="Share metrics to community forum"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}

        {onDelete && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="rounded-xl border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:border-zinc-800 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 dark:hover:border-rose-900/40 h-11 w-11 shrink-0 text-zinc-400 transition-colors"
            title="Purge analysis payload record"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}