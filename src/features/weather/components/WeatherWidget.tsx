"use client";

import { Droplets, Wind, Thermometer, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Advisory, WeatherCurrent } from "@/types/api.types";

interface WeatherWidgetProps {
  current: WeatherCurrent;
  advisories: Advisory[];
  location: string;
  isLoading?: boolean;
}

const advisoryPriorityStyles: Record<string, string> = {
  LOW: "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40",
  MEDIUM:
    "border-amber-200 bg-amber-50/40 dark:border-amber-900/20 dark:bg-amber-950/10",
  HIGH:
    "border-orange-200 bg-orange-50/40 dark:border-orange-900/20 dark:bg-orange-950/10",
  URGENT:
    "border-rose-200 bg-rose-50/40 dark:border-rose-900/20 dark:bg-rose-950/10",
};

const advisoryTextColor: Record<string, string> = {
  LOW: "text-zinc-600 dark:text-zinc-400",
  MEDIUM: "text-amber-700 dark:text-amber-400 font-bold",
  HIGH: "text-orange-700 dark:text-orange-400 font-bold",
  URGENT: "text-rose-700 dark:text-rose-400 font-bold",
};

export function WeatherWidget({
  current,
  advisories,
  location,
  isLoading = false,
}: WeatherWidgetProps) {
  if (isLoading) {
    return (
      <div className="space-y-5 p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/40 animate-pulse select-none">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
          </div>
          <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
        <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800/40"
            />
          ))}
        </div>
      </div>
    );
  }

  const topAdvisories = advisories?.slice(0, 2) ?? [];
  const condition = current?.conditions?.[0];

  return (
    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm space-y-5 select-none">
      {/* Geolocation Title and Imagery Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Current Microclimate
          </p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {location}
          </p>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 capitalize">
            {condition?.description ?? "Telemetry unavailable"}
          </p>
        </div>

        {condition?.icon && (
          <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-center p-0.5 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
              alt={condition?.description || "weather condition tracking icon"}
              width={44}
              height={44}
              className="object-contain filter drop-shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Main Temperature Gauge Accent Block */}
      <div className="flex items-baseline gap-1.5 py-1">
        <p className="text-4xl font-extrabold font-display text-zinc-900 dark:text-zinc-50 tracking-tighter tabular-nums leading-none">
          {current.temperature}
        </p>
        <span className="text-lg font-bold font-mono text-zinc-400 dark:text-zinc-500">°C</span>
      </div>

      {/* Agricultural Ambient Metric Grid Layout */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            icon: Droplets,
            label: "Humidity",
            value: `${current.humidity}%`,
            color: "text-blue-500 dark:text-blue-400",
          },
          {
            icon: Wind,
            label: "Wind Speed",
            value: `${current.windSpeed} m/s`,
            color: "text-emerald-500 dark:text-emerald-400",
          },
          {
            icon: Thermometer,
            label: "Feels Like",
            value: `${current.feelsLike}°C`,
            color: "text-amber-500 dark:text-amber-400",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-zinc-50 border border-zinc-100 p-2.5 dark:bg-zinc-900/60 dark:border-zinc-850 transition-colors"
          >
            <Icon className={cn("h-3.5 w-3.5 shrink-0", color)} />
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 font-mono tabular-nums mt-0.5">
              {value}
            </p>
            <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wide text-center">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Dynamic Crop Cultivation Advisories Feed */}
      {topAdvisories.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-1.5 px-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
            <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Agronomic Risk Bulletins
            </p>
          </div>
          
          {topAdvisories.map((advisory, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border p-3 space-y-1 shadow-sm transition-all duration-200",
                advisoryPriorityStyles[advisory.priority]
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className={cn("text-xs font-bold tracking-tight", advisoryTextColor[advisory.priority])}>
                  {advisory.title}
                </p>
                <span className="text-[9px] font-mono font-bold px-1.5 py-px bg-white dark:bg-zinc-900 rounded border border-inherit shadow-sm opacity-80">
                  {advisory.priority}
                </span>
              </div>

              <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                {advisory.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}