"use client";

import {
  ScanLine,
  Tractor,
  Wheat,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";
import { useMyRegionAlerts } from "@/features/alerts/hooks/use-alerts";
import { useWeatherForFarm } from "@/features/weather/hooks/use-weather";

import { StatCard } from "@/components/shared/StatCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AlertFeedCard } from "@/features/alerts/components/AlertFeedCard";
import { WeatherWidget } from "@/features/weather/components/WeatherWidget";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useMyDetections } from "@/features/detaction/hooks/use-detections";
import { useMyFarms } from "@/features/farm/hook/use-farms";
import { RecentDetectionCard } from "@/features/detaction/components/RecentDetectionCard";
import { cn } from "@/lib/utils";

export default function FarmerDashboardPage() {
  const { user } = useAuthStore();

  const detectionsQuery = useMyDetections({ limit: 5 });
  const farmsQuery = useMyFarms();
  const alertsQuery = useMyRegionAlerts();

  const farms = farmsQuery.data ?? [];

  // Weather query optimization targeting primary asset operational node
  const firstFarmId = farms.length > 0 ? farms[0]._id : undefined;
  const weatherQuery = useWeatherForFarm(firstFarmId);

  const detections = detectionsQuery.detections ?? [];
  const alerts = alertsQuery.alerts ?? [];

  const completedCount = detections.filter(
    (d) => d.status === "COMPLETED"
  ).length;

  const activeFarms = farms.length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="space-y-6 max-w-350 mx-auto pb-12">
      
      {/* Platform Greeting & CTA Navigation Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200 dark:bg-zinc-900/20 dark:border-zinc-800 shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-display uppercase">
            {greeting}, {user?.name?.split(" ")[0] ?? "Farmer"} <span className="inline-block animate-bounce origin-bottom">👋</span>
          </h2>
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 tracking-wide">
            Workspace updated in real-time. Here is today&apos;s crop diagnostics summary.
          </p>
        </div>

        <Link href={ROUTES.FARMER.DETECT} className="w-full sm:w-auto shrink-0">
          <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white gap-2 rounded-xl shadow-md shadow-emerald-600/10 active:scale-[0.98] transition-transform font-semibold text-xs uppercase tracking-wider h-10">
            <ScanLine className="h-4 w-4" />
            <span>Scan Crop Image</span>
          </Button>
        </Link>
      </div>

      {/* Grid Layout Allocation for Stat Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Scans"
          value={detectionsQuery.meta?.total ?? 0}
          icon={ScanLine}
          isLoading={detectionsQuery.isLoading}
        />

        <StatCard
          label="Active Fields"
          value={activeFarms}
          icon={Tractor}
          variant="success"
          isLoading={farmsQuery.isLoading}
        />

          <StatCard
            label="Outbreak Alerts"
            value={alerts.length}
            icon={AlertTriangle}
            variant={
              alerts.some((a) => a.outbreakLevel === "CRITICAL")
                ? "danger"
                : "warning"
            }
            isLoading={alertsQuery.isLoading}
          />

        <StatCard
          label="Resolved Logs"
          value={completedCount}
          icon={Wheat}
          variant="success"
          isLoading={detectionsQuery.isLoading}
        />
      </div>

      {/* Main Multi-Column Analytics Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Core Telemetry Data (Scans & regional alerts) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section Block: Recent Pathology Analyses */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
            <SectionHeader
              title="Recent Detections"
              description="Your latest computer vision pathology logs"
              href={ROUTES.FARMER.DETECTIONS}
              hrefLabel="View history"
            />

            {detectionsQuery.isLoading ? (
              <div className="space-y-3 pt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 border border-zinc-100 dark:border-zinc-800/60 rounded-xl bg-zinc-50/40 dark:bg-zinc-950/20 animate-pulse"
                  >
                    <div className="h-12 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                      <div className="h-3 w-40 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : detections.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <Sparkles className="w-6 h-6 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  No operational diagnostic logs discovered yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 pt-1">
                {detections.map((detection) => (
                  <RecentDetectionCard
                    key={detection._id}
                    detection={detection}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section Block: Regional Biological Outbreaks */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
            <SectionHeader
              title="Regional Threat Alerts"
              description="Active biological threats monitored in your grid zone"
              href={ROUTES.FARMER.ALERTS}
              hrefLabel="All regional alerts"
            />

            {alertsQuery.isLoading ? (
              <div className="h-24 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 animate-pulse rounded-2xl" />
            ) : alerts.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 font-mono">
                  ✓ Zone Clear: No active regional biosecurity alerts identified.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {alerts.slice(0, 3).map((alert) => (
                  <AlertFeedCard key={alert._id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Environmental Context Modules */}
        <div className="space-y-6">
          
          {/* Section Block: Microclimate Data Sync Widget */}
          {weatherQuery.data ? (
            <WeatherWidget
              current={weatherQuery.data.current}
              advisories={weatherQuery.data.advisories}
              location={weatherQuery.data.location.name}
            />
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/40 shadow-sm border-dashed">
              <p className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                Microclimate Data Locked
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                Configure a production asset field node inside profile to receive local weather telemetry streams.
              </p>
            </div>
          )}

          {/* Section Block: Operational Quick Shortcut Panels */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3.5 px-0.5">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Action Control Shortcuts
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "Upload Leaf Diagnostic Image",
                  href: ROUTES.FARMER.DETECT,
                  icon: ScanLine,
                  color: "text-emerald-500 dark:text-emerald-400",
                },
                {
                  label: "Manage Production Farms",
                  href: ROUTES.FARMER.FARMS,
                  icon: Tractor,
                  color: "text-blue-500 dark:text-blue-400",
                },
                {
                  label: "Consult Agronomic Expert",
                  href: ROUTES.FARMER.EXPERTS,
                  icon: MessageSquare,
                  color: "text-amber-500 dark:text-amber-400",
                },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={href} href={href} className="block group">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50/30 dark:border-zinc-800/40 dark:bg-zinc-900/40 group-hover:bg-zinc-50 group-hover:border-zinc-200 dark:group-hover:bg-zinc-850 dark:group-hover:border-zinc-700 transition-all duration-200">
                    <Icon className={cn("h-4 w-4 shrink-0", color)} />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors truncate">
                      {label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 ml-auto shrink-0 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}