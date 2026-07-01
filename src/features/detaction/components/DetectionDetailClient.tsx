"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { detectionService } from "@/services/detection.service";
import { QUERY_KEYS } from "@/constants/query-keys";



import { AnalysisResult } from "./AnalysisResult";
import { AnalysisLoader } from "./AnalysisLoader";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useDeleteDetection } from "../hooks/use-delete-detection";
import { useToggleSharing } from "../hooks/use-toggle-sharing";

interface DetectionDetailClientProps {
  id: string;
}

export function DetectionDetailClient({ id }: DetectionDetailClientProps) {
  const router = useRouter();

  // ── 1. Real-Time Query Telemetry Retrieval Pipeline ──
  const {
    data: detection,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.DETECTIONS.DETAIL(id),
    queryFn: () => detectionService.getDetectionById(id),
    staleTime: 30_000,
  });

  const deleteMutation = useDeleteDetection();
  const toggleMutation = useToggleSharing();

  const isMutating = deleteMutation.isPending || toggleMutation.isPending;

  // ── 2. Structural Interaction Handlers ──
  const handleDelete = () => {
    if (isMutating) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        router.push(ROUTES.FARMER.DETECTIONS);
      },
    });
  };

  const handleShare = () => {
    if (isMutating) return;
    toggleMutation.mutate(id);
  };

  return (
    <div className="space-y-5 w-full max-w-5xl mx-auto px-2 select-none">
      
      {/* Back Navigation Bar */}
      <div>
        <Link
          href={ROUTES.FARMER.DETECTIONS}
          className="inline-flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Back to History</span>
        </Link>
      </div>

      {/* ── Case A: Initial Network Query Fetching Base State ── */}
      {isLoading ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#14171c] p-8 shadow-xl">
          <AnalysisLoader status="PROCESSING" />
        </div>
      ) : isError || !detection ? (
        
        /* ── Case B: Erroneous Fallback or Missing Database Profile ── */
        <div className="rounded-2xl border border-zinc-800 bg-[#14171c] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-zinc-100">
              Detection Not Found
            </p>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mx-auto">
              The detection you are looking for could not be found
or may have been removed.
            </p>
          </div>

          <Link href={ROUTES.FARMER.DETECTIONS} className="pt-2">
            <Button 
              variant="outline" 
              className="text-xs font-mono font-bold uppercase tracking-wider border-zinc-800 bg-[#0f1115] text-zinc-400 hover:bg-[#1a1f26] hover:text-zinc-200 rounded-xl px-4 h-9"
            >
              Back to History
            </Button>
          </Link>
        </div>
      ) : detection.status === "PROCESSING" || detection.status === "PENDING" ? (
        
        /* ── Case C: Analysis In-Flight Pipeline State (E.g. Background AI worker processing image) ── */
        <div className="rounded-2xl border border-zinc-800 bg-[#14171c] p-8 shadow-xl">
          <AnalysisLoader status={detection.status} />
        </div>
      ) : (
        
        /* ── Case D: Complete Data Resolution Presentation Layout ── */
        <div className="rounded-2xl border border-zinc-800 bg-[#14171c] p-6 shadow-xl border-t-2 border-t-zinc-700">
          <AnalysisResult
            detection={detection}
            onNewDetection={() => router.push(ROUTES.FARMER.DETECT)}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}