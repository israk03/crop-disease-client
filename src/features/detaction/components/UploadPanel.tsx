"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  ScanLine,
  ImagePlus,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appConfig } from "@/config/app.config";

interface UploadPanelProps {
  onSubmit: (file: File, cropType: string) => void;
  isLoading: boolean;
}

const MAX_SIZE_BYTES = appConfig.upload.maxSizeBytes;

export function UploadPanel({ onSubmit, isLoading }: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  // Structural Callback parsing asset stream payload validations
  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setFileError(null);

      if (rejected.length > 0) {
        const err = rejected[0].errors[0];

        if (err.code === "file-too-large") {
          setFileError(
            `File size exceeds payload restrictions. Maximum parameter limit is ${
              MAX_SIZE_BYTES / 1024 / 1024
            }MB.`
          );
        } else if (err.code === "file-invalid-type") {
          setFileError("Unsupported file architecture. Please process a valid JPG, PNG, or WEBP image.");
        } else {
          setFileError("Payload rejected by file processor. Please provide a different graphic snapshot.");
        }
        return;
      }

      if (accepted.length > 0) {
        const selected = accepted[0];
        setFile(selected);

        // Map asset allocation inside browser instance memory cache structures
        const url = URL.createObjectURL(selected);
        setPreview(url);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    disabled: isLoading,
  });

  // 🧠 Garbage Collector Lifecycle Guard: Purge references to avoid systemic page leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const removeFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFileError(null);
  };

  const handleSubmit = () => {
    const trimmed = cropType.trim();
    if (!file || trimmed.length < 2 || isLoading) return;

    onSubmit(file, trimmed);
  };

  const canSubmit = !file || cropType.trim().length < 2 || isLoading;

  return (
    <div className="space-y-5 max-w-md mx-auto p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm select-none">
      
      {/* ── Dropzone / Preview Stage Panel Wrapper ───────────────────────────── */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div
                {...getRootProps()}
                className={cn(
                  "flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20",
                  isDragActive
                    ? "border-emerald-500 bg-emerald-500/2 dark:bg-emerald-400/1"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-emerald-500/60 dark:hover:border-emerald-400/40",
                  isLoading && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
              >
                <input {...getInputProps()} />

                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 border",
                    isDragActive 
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400" 
                      : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700/60 text-zinc-400"
                  )}
                >
                  {isDragActive ? (
                    <Upload className="h-5 w-5 animate-bounce" />
                  ) : (
                    <ImagePlus className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold font-mono tracking-wide uppercase text-zinc-800 dark:text-zinc-200">
                    {isDragActive ? "Release Asset Payload" : "Stage Crop Media"}
                  </p>
                  <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                    Drag and drop file directly or click to cross-reference
                  </p>
                  <p className="text-[9px] font-mono font-bold text-zinc-400/80 dark:text-zinc-500/80 pt-1">
                    RAW/JPEG, PNG, WEBP • MAX {(MAX_SIZE_BYTES / 1024 / 1024).toFixed(0)}MB
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="relative h-48 w-full bg-zinc-50 dark:bg-zinc-950">
                <Image
                  src={preview!}
                  alt="Staged telemetry capture crop profile snapshot"
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">
                    {file.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {!isLoading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 shrink-0 border border-transparent hover:border-rose-500/10"
                    title="Evict active file staging block"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Real-time Boundary Condition Error Alerts ───────────────────────────── */}
      <AnimatePresence>
        {fileError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 p-3 text-rose-600 dark:text-rose-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">{fileError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contextual Metadata Input Section ───────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-xs font-bold font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
          Cultivar / Crop Domain Classification <span className="text-rose-500 font-sans">*</span>
        </Label>

        <Input
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          disabled={isLoading}
          placeholder="e.g., Rice Paddy, Tomato, Winter Wheat"
          className="h-10 text-xs font-medium rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus-visible:ring-emerald-500/20"
        />
      </div>

      {/* ── Pipeline Submission Execution Triggers ───────────────────────────── */}
      <Button
        onClick={handleSubmit}
        disabled={canSubmit}
        className={cn(
          "w-full font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-11 transition-all duration-200 shadow-sm",
          !canSubmit 
            ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]" 
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Streaming Payload...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ScanLine className="h-3.5 w-3.5" />
            <span>Execute Diagnostic Model</span>
          </div>
        )}
      </Button>
    </div>
  );
}