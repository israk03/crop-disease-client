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
}

const TABS: TabConfig[] = [
  {
    key: "description",
    label: "Overview",
    icon: Info,
    iconColor: "text-blue-500",
  },
  {
    key: "organicTreatment",
    label: "Organic",
    icon: Leaf,
    iconColor: "text-emerald-500",
  },
  {
    key: "chemicalTreatment",
    label: "Chemical",
    icon: FlaskConical,
    iconColor: "text-purple-500",
  },
  {
    key: "preventiveMeasures",
    label: "Prevention",
    icon: Shield,
    iconColor: "text-amber-500",
  },
];

function renderContent(value: unknown) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return (
      <p className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 py-2 italic">
        No specific protocols recorded for this metric.
      </p>
    );
  }

  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2.5">
        {value.map((item, idx) => (
          <li 
            key={idx} 
            className="flex items-start gap-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
      {String(value)}
    </p>
  );
}

export function TreatmentTabs({ result }: TreatmentTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full select-none">
      
      {/* High-Contrast Tab Segment List Controls */}
      <TabsList className="grid grid-cols-4 w-full bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl h-11">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className="flex items-center justify-center gap-1.5 text-[11px] font-bold font-mono tracking-wide uppercase rounded-lg transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
          >
            <tab.icon className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", tab.iconColor)} />
            <span className="hidden md:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Target Content Presentation Panels */}
      {TABS.map((tab) => (
        <TabsContent
          key={tab.key}
          value={tab.key}
          className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400/30 transition-all"
        >
          {/* Context Header Sub-Row */}
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
              <tab.icon className={cn("h-4 w-4 shrink-0", tab.iconColor)} />
            </div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              {tab.label} Protocol Data
            </h4>
          </div>

          {/* Core Descriptive Text Block */}
          <div className="px-0.5">
            {renderContent(result[tab.key])}
          </div>

          {/* Secondary Structural Inversion Trigger block (Causes Overview Only) */}
          {tab.key === "description" &&
            result.causes &&
            result.causes.length > 0 && (
              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 space-y-3">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Pathological Etiology & Causes
                  </p>
                </div>

                <ul className="space-y-2">
                  {result.causes.map((cause, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed"
                    >
                      <span className="flex h-1.5 w-1.5 rounded-full bg-rose-400 dark:bg-rose-500/80 mt-1.5 shrink-0 ring-4 ring-rose-500/10" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </TabsContent>
      ))}
    </Tabs>
  );
}