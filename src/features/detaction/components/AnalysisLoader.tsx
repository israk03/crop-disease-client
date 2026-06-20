"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Uploading crop image...",
  "Analyzing visual patterns...",
  "Identifying disease markers...",
  "Generating treatment plan...",
];

interface AnalysisLoaderProps {
  status: "PENDING" | "PROCESSING";
}

export function AnalysisLoader({ status }: AnalysisLoaderProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Fix: Synchronize step selection using state transition boundaries
  useEffect(() => {
    // If the pipeline is pending, keep the worker index locked at baseline
    if (status === "PENDING") {
      return;
    }

    // Only configure the interval worker loop if status matches PROCESSING
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => {
      clearInterval(interval);
      // Clean up step state when the effect unmounts or status alters
      setCurrentStepIdx(0);
    };
  }, [status]);

  // Derived state fallback rule: force visualization index to 0 if pending
  const activeStepIdx = status === "PENDING" ? 0 : currentStepIdx;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-8 max-w-sm mx-auto select-none">
      
      {/* High-Performance Scanning Telemetry Rings */}
      <div className="relative flex items-center justify-center w-20 h-20 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full border border-emerald-500/10 dark:border-emerald-400/10 ring-8 ring-emerald-500/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/20 dark:border-emerald-400/20"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-t-emerald-600 border-x-transparent border-b-transparent dark:border-t-emerald-400"
        />

        <div className="relative z-10 p-3 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-zinc-100 dark:border-zinc-800">
          <ScanLine className={cn(
            "h-6 w-6 transition-colors duration-300",
            status === "PROCESSING" ? "text-emerald-600 dark:text-emerald-400 animate-pulse" : "text-zinc-400"
          )} />
        </div>
      </div>

      {/* Primary Pipeline Messaging Layout */}
      <div className="text-center space-y-1.5">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase font-mono">
          {status === "PENDING" ? "Queue Payload Buffered" : "AI Compute Pipeline Active"}
        </h3>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-65 mx-auto leading-relaxed">
          {status === "PENDING"
            ? "Waiting for an open extraction worker node..."
            : `Currently executing: ${STEPS[activeStepIdx].toLowerCase()}`}
        </p>
      </div>

      {/* Incremental Status Checklists */}
      <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60 p-4 rounded-2xl space-y-3 shadow-inner">
        {STEPS.map((step, i) => {
          const isCompleted = status === "PROCESSING" && i < activeStepIdx;
          const isActive = status === "PROCESSING" && i === activeStepIdx;
          const isPending = status === "PENDING" || i > activeStepIdx;

          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                isPending && "opacity-40 grayscale-40",
                isActive && "opacity-100 scale-[1.01]"
              )}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="active"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"
                    />
                  )}
                </AnimatePresence>
              </div>

              <span className={cn(
                "text-xs font-mono transition-colors tracking-wide",
                isActive ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-500 dark:text-zinc-400 font-medium"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}