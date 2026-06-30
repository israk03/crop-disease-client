import type { Metadata } from "next";
import { Suspense } from "react";

import { Loader2 } from "lucide-react";
import { DetectionDetailClient } from "@/features/detaction/components/DetectionDetailClient";

export const metadata: Metadata = {
  title: "Detection Report | AgriSense",
  description:
    "View your complete crop disease analysis report with AI diagnosis, confidence scores, and treatment recommendations.",
  robots: {
    index: false,
    follow: false,
  },
};

interface DetectionDetailPageProps {
  params: Promise<{ id: string }>;
}

// Loading state skeleton designed to eliminate page shifts inside the layout slots
function ReportLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full space-y-3 bg-[#0f1115] rounded-2xl border border-zinc-800/40 p-8">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
      <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
        Resolving Telemetry Report...
      </p>
    </div>
  );
}

export default async function DetectionDetailPage({
  params,
}: DetectionDetailPageProps) {
  // Safe asynchronous resolution of the dynamic URL string sequence
  const { id } = await params;

  return (
    <div className="w-full min-h-screen bg-[#0f1115] p-1">
      <Suspense fallback={<ReportLoadingSkeleton />}>
        <DetectionDetailClient id={id} />
      </Suspense>
    </div>
  );
}