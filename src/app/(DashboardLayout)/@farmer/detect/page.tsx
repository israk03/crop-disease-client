"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, History, HelpCircle } from "lucide-react";
import Link from "next/link";


import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useCreateDetection } from "@/features/detaction/hooks/use-create-detection";
import { useDetectionPolling } from "@/features/detaction/hooks/use-detection-polling";
import { UploadPanel } from "@/features/detaction/components/UploadPanel";
import { AnalysisLoader } from "@/features/detaction/components/AnalysisLoader";
import { AnalysisResult } from "@/features/detaction/components/AnalysisResult";

type PageState = "idle" | "uploading" | "analysing";

export default function FarmerDetectPage() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [detectionId, setDetectionId] = useState<string | null>(null);

  const createMutation = useCreateDetection();

  // Polling Hook fetches background inference updates only when id is active
  const pollingQuery = useDetectionPolling(
    pageState === "analysing" ? detectionId : null
  );

  const detection = pollingQuery.data;

  // Why it matters: Derive "isDone" dynamically from incoming cache metrics to completely bypass the warning loop
  const isDone = detection && (detection.status === "COMPLETED" || detection.status === "FAILED");

  const handleUpload = (file: File, cropType: string) => {
    setPageState("uploading");

    createMutation.mutate(
      { image: file, cropType },
      {
        onSuccess: (created) => {
          setDetectionId(created._id);
          setPageState("analysing");
        },
        onError: () => {
          setPageState("idle");
        },
      }
    );
  };

  const handleReset = () => {
    setPageState("idle");
    setDetectionId(null);
  };

  const isUploading = pageState === "uploading";
  const isAnalysing = pageState === "analysing" && !isDone;
  const isActiveOrProcessing = isUploading || isAnalysing;

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 md:px-6 select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-400/5 text-emerald-600 dark:text-emerald-400">
              <ScanLine className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono uppercase">
              AI Disease Diagnostic Workspace
            </h2>
          </div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 pl-11 max-w-xl leading-relaxed">
            Upload diagnostic photography of infected crop leaves to run real-time treatment models.
          </p>
        </div>

        <Link href={ROUTES.FARMER.DETECTIONS} className="sm:self-center pl-11 sm:pl-0">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-mono font-bold text-xs uppercase tracking-wide border-zinc-200 rounded-xl hover:bg-zinc-50 dark:border-zinc-800">
            <History className="h-3.5 w-3.5 text-zinc-400" />
            <span>Telemetry History</span>
          </Button>
        </Link>
      </div>

      {/* Grid Architecture Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Upload Panel */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">
              01 — Payload Staging
            </p>
          </div>

          <UploadPanel
            onSubmit={handleUpload}
            isLoading={isActiveOrProcessing}
          />
        </motion.div>

        {/* Inference Status Render Block */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 min-h-95 shadow-sm"
        >
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-zinc-100 dark:border-zinc-800/60">
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">
              02 — Inference Analytics Pipeline
            </p>
          </div>

          <AnimatePresence mode="wait">
            {pageState === "idle" && (
              <motion.div
                key="idle-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-3"
              >
                <div className="p-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-400">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold font-mono uppercase text-zinc-400">
                  Awaiting Local Image Feed
                </p>
              </motion.div>
            )}

            {isActiveOrProcessing && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnalysisLoader
                  status={isUploading ? "PENDING" : "PROCESSING"}
                />
              </motion.div>
            )}

            {isDone && (
              <motion.div
                key="results-state"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnalysisResult
                  detection={detection}
                  onNewDetection={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}