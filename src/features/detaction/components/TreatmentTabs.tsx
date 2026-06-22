"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type { AIResult } from "@/types/api.types";
import type { LucideIcon } from "lucide-react";

import {
  Leaf,
  FlaskConical,
  Shield,
  Info,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Activity
} from "lucide-react";

import { cn } from "@/lib/utils";

interface TreatmentTabsProps {
  result: AIResult;
}

interface TabConfig {
  key: keyof AIResult;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  accentColor: string;
}

const TABS: TabConfig[] = [
  {
    key: "description",
    label: "Overview",
    icon: Info,
    iconColor: "text-blue-500",
    accentColor: "blue",
  },
  {
    key: "organicTreatment",
    label: "Organic",
    icon: Leaf,
    iconColor: "text-emerald-500",
    accentColor: "emerald",
  },
  {
    key: "chemicalTreatment",
    label: "Chemical",
    icon: FlaskConical,
    iconColor: "text-purple-500",
    accentColor: "purple",
  },
  {
    key: "preventiveMeasures",
    label: "Prevention",
    icon: Shield,
    iconColor: "text-amber-500",
    accentColor: "amber",
  },
];

// Enhanced rendering engine updated to display sub-cards directly at the bottom
function renderEnhancedContent(value: unknown, tabKey: keyof AIResult) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 py-3 italic">
        <Activity className="h-3.5 w-3.5 animate-pulse" />
        <span>No direct protocols logged for this parameter metric.</span>
      </div>
    );
  }

  // Parse comma/period separated strings into clean list arrays
  const items = Array.isArray(value) 
    ? value 
    : String(value).split(/[.,;!]/).map(s => s.trim()).filter(s => s.length > 3);

  return (
    <div className="space-y-5 pt-1 w-full">
      
      {/* 1. Top Section: Full-Width Execution Steps List */}
      <div className="w-full space-y-3">
        <div className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 font-mono flex items-center gap-1.5 mb-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400" />
          <span>Recommended Execution Steps</span>
        </div>
        <ul className="space-y-2.5 w-full">
          {items.map((item, idx) => (
            <li 
              key={idx} 
              className="flex items-start gap-2.5 text-xs font-medium text-zinc-300 leading-relaxed bg-[#191d24]/40 p-3 rounded-xl border border-zinc-800/40 w-full"
            >
              <span className="flex h-5 w-5 rounded-md bg-[#1d222b] border border-zinc-800 text-[10px] font-mono font-bold text-zinc-400 items-center justify-center shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <span className="pt-0.5">{item}.</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Bottom Section: Contextual Guidance Sub-card Box */}
      <div className="w-full pt-1">
        {tabKey === "organicTreatment" && (
          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Leaf className="h-4 w-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider font-mono">Eco-Compliance Status</h5>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              Biological methodologies support beneficial insect life, generate zero systemic toxin accumulation, and carry a 0-day chemical withholding limit.
            </p>
          </div>
        )}

        {tabKey === "chemicalTreatment" && (
          <div className="rounded-xl border border-purple-500/10 bg-purple-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <AlertTriangle className="h-4 w-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider font-mono">Application Safeguards</h5>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              Wear personal protection layout arrays during application. Do not pass water runoff networks or allow secondary drift into adjacent properties.
            </p>
          </div>
        )}

        {tabKey === "preventiveMeasures" && (
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Shield className="h-4 w-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider font-mono">Structural Resilience</h5>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              Cultural controls build core micro-climate resistance profiles. Consistent row aeration blocks humidity pockets that feed fungal spores.
            </p>
          </div>
        )}

        {tabKey === "description" && (
          <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Info className="h-4 w-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider font-mono">Diagnostic Summary</h5>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              This system analysis cross-references real-time visual telemetry patterns against historical regional vector profiles.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export function TreatmentTabs({ result }: TreatmentTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full select-none">
      <div className="w-full rounded-2xl border border-zinc-800 bg-[#0f1115] p-5 shadow-xl space-y-4">
        
        {/* ── Top Header Navigation Bar ── */}
        <div className="w-full border-b border-zinc-800/80 pb-3">
          <TabsList className="flex flex-wrap gap-2 w-full justify-start bg-transparent p-0 h-auto border-none rounded-none">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="flex items-center justify-center gap-2 px-4 h-10 text-xs font-bold font-mono tracking-wider uppercase rounded-xl border border-zinc-800 bg-[#14171c] text-zinc-400 transition-all duration-200 data-[state=active]:bg-[#1a1f26] data-[state=active]:text-white data-[state=active]:border-zinc-700 data-[state=active]:shadow-md hover:text-zinc-200"
              >
                <tab.icon className={cn("h-4 w-4 shrink-0", tab.iconColor)} />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ── Content Viewports ── */}
        <div className="w-full">
          {TABS.map((tab) => (
            <TabsContent
              key={tab.key}
              value={tab.key}
              className="mt-0 focus-visible:outline-none focus-visible:ring-0 m-0 data-[state=inactive]:hidden"
            >
              <div className="rounded-xl border border-zinc-800 bg-[#14171c] p-5 space-y-4 shadow-inner">
                
                {/* Dynamic Title Row Inside Tab Container Card */}
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1f26] border border-zinc-800">
                    <tab.icon className={cn("h-4 w-4 shrink-0", tab.iconColor)} />
                  </div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-widest leading-tight text-white">
                    {tab.label} Protocol Insights
                  </h4>
                </div>

                {/* Enhanced Vertically Stacked Content Area */}
                <div className="px-0.5">
                  {renderEnhancedContent(result[tab.key], tab.key)}
                </div>

                {/* Pathology Causes Sub-Block (Overview / Description tab only) */}
                {tab.key === "description" && result.causes && result.causes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-zinc-500" />
                      <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500">
                        Etiology Causes
                      </p>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-zinc-400 pl-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{String(result.causes)}</span>
                    </div>
                  </div>
                )}

              </div>
            </TabsContent>
          ))}
        </div>

      </div>
    </Tabs>
  );
}