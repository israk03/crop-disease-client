"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  MessageSquare,
  AlertTriangle,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

const FARMER_BOTTOM_NAV = [
  {
    label: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
    isActionBtn: false,
  },
  {
    label: "Detect",
    href: "/detect",
    icon: ScanLine,
    isActionBtn: true, // Special rendering indicator for the core AI pipeline
  },
  {
    label: "Community",
    href: "/community",
    icon: MessageSquare,
    isActionBtn: false,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
    isActionBtn: false,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    isActionBtn: false,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Role restriction enforcement: module reserved explicitly for farmers
  if (user?.role !== "FARMER") {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/90 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/90 pb-safe-bottom select-none shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <ul className="flex items-center justify-around h-16 px-2">
        {FARMER_BOTTOM_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          // Special layout variant for the core feature: AI Disease Analysis
          if (item.isActionBtn) {
            return (
              <li key={item.href} className="relative flex-1 flex justify-center -top-3">
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 dark:shadow-emerald-500/20 active:scale-95 transition-all duration-200 border border-emerald-500/40"
                  title={item.label}
                >
                  <Icon className="w-5 h-5 animate-pulse" />
                  <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wide">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }

          // Standard layout navigation items
          return (
            <li key={item.href} className="flex-1 h-full">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center h-full gap-1 text-[10px] font-semibold tracking-wide font-display relative transition-all duration-200",
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    active && "scale-110 text-emerald-600 dark:text-emerald-400"
                  )}
                />
                
                <span>{item.label}</span>

                {/* Micro active layout line indicator */}
                {active && (
                  <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}