import { DetectionHistoryClient } from "@/features/detaction/components/DetectionHistoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detection History | AgriSense",
  description:
    "View all your crop disease detection reports. Filter by status, search by crop type or disease name, and manage your agricultural health records.",
  openGraph: {
    title: "Detection History | AgriSense",
    description:
      "View and manage your crop disease detection reports and AI-powered plant health analyses.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FarmerDetectionsPage() {
  return (
    // Fixed: Instantiated the layout client hook component inside the return statement
    <div className="w-full min-h-screen bg-[#0f1115] p-1">
      <DetectionHistoryClient />
    </div>
  );
}