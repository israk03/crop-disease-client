"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Share2, Calendar, Sprout, Target } from "lucide-react";
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

export function AnalysisResult({ detection, onNewDetection, onShare }: AnalysisResultProps) {
  const result = detection.aiResult;

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6 select-none"
    >
      {/* ── Top Section: Hero Image & Main Insights Splitting ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Clean Media Box */}
        <div className="relative md:col-span-5 h-64 md:h-full min-h-55 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-50 dark:bg-zinc-950">
          <Image
            src={detection.imageUrl}
            alt={detection.cropType}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md border border-white/10">
              <Sprout className="h-3.5 w-3.5 text-emerald-400" />
              {detection.cropType}
            </span>
          </div>
        </div>

        {/* Right: Balanced Diagnosis Breakdown Card */}
        <div className="md:col-span-7 flex flex-col justify-between p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground block">
                  System Diagnostic Verdict
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {result.isHealthy ? "Biomass Clear / Healthy" : result.diseaseName}
                </h3>
              </div>
              <ConfidenceGauge score={result.confidenceScore} isHealthy={result.isHealthy} />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SeverityBadge severity={result.severityLevel} />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(detection.createdAt)}
              </span>
            </div>

            {/* Target Structures (Clean Tag Layout) */}
            {result.affectedParts && result.affectedParts.length > 0 && (
              <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-1">
                  <Target className="h-3 w-3" /> Affected Plant Structures
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.affectedParts.map((part) => (
                    <span key={part} className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 capitalize">
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Middle Section: Synthesis Callout ── */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-sm space-y-1.5">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Agronomic Analysis Synthesis</span>
        </div>
        <p className="text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
          {result.aiSummary}
        </p>
      </div>

      {/* ── Bottom Section: Complete Full-Width Protocol Layout ── */}
      {!result.isHealthy && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <TreatmentTabs result={result} />
        </div>
      )}

      {/* Action Controls */}
      <div className="flex gap-3">
        <Button onClick={onNewDetection} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs uppercase tracking-wider rounded-xl h-11 shadow-sm">
          Initialize New Scan
        </Button>
        {onShare && (
          <Button variant="outline" size="icon" onClick={onShare} className="rounded-xl h-11 w-11 shrink-0 text-zinc-500 dark:text-zinc-400">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}