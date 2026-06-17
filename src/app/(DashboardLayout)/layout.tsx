"use client";

import { useAuthStore } from "@/store/auth.store";

import { FarmerSidebar } from "@/components/layout/FarmerSidebar";
import { ExpertSidebar } from "@/components/layout/ExpertSidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

import { Topbar } from "@/components/layout/Topbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface DashboardLayoutProps {
  farmer: React.ReactNode;
  expert: React.ReactNode;
  admin: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({
  farmer,
  expert,
  admin,
  children,
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuthStore();

  console.log("USER:", user);
console.log("ROLE:", user?.role);

  // High-fidelity skeletal state while auth tokens are being evaluated
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 select-none">
        {/* Dark-botanical Sidebar Skeleton */}
        <div className="hidden lg:flex w-67.5 border-r border-zinc-800 bg-zinc-950 p-6 flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo placeholder */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse" />
              <div className="h-4 w-24 rounded bg-zinc-900 animate-pulse" />
            </div>

            {/* Navigation item placeholders */}
            <div className="space-y-3 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded-xl bg-zinc-900/60 border border-transparent animate-pulse"
                  style={{ animationDelay: `${i * 75}ms` }}
                />
              ))}
            </div>
          </div>

          {/* User card placeholder */}
          <div className="flex items-center gap-3 pt-4 border-t border-zinc-900">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 animate-pulse" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-20 rounded bg-zinc-900 animate-pulse" />
              <div className="h-2.5 w-32 rounded bg-zinc-900 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Topbar placeholder */}
          <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 flex items-center justify-between shrink-0">
            <div className="h-4 w-32 rounded bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            </div>
          </div>

          {/* Dashboard Canvas Area placeholder */}
          <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
            <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-900 animate-pulse mb-2" />
            
            {/* Grid distribution placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 p-4 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            <div className="h-64 rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Multi-tenant navigation distribution sorted by auth tier rules
  const sidebar =
    user?.role === "ADMIN" ? (
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar />
      </div>
    ) : user?.role === "EXPERT" ? (
      <div className="hidden lg:flex shrink-0">
        <ExpertSidebar />
      </div>
    ) : (
      <div className="hidden lg:flex shrink-0">
        <FarmerSidebar />
      </div>
    );

  // Parallel route layout slot assignment based on user validation attributes
  const slot =
    user?.role === "ADMIN"
      ? admin
      : user?.role === "EXPERT"
      ? expert
      : farmer;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 antialiased selection:bg-emerald-500/20">
      {/* Desktop Navigation Framework */}
      {sidebar}

      {/* Primary Analytics and Workspace Viewport */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6 custom-scrollbar focus:outline-none">
          <div className="max-w-[1600px] mx-auto w-full space-y-6">
            {slot}
            {children}
          </div>
        </main>
      </div>

      {/* Mobile-Responsive Touch UI Overlay */}
      <MobileBottomNav />
    </div>
  );
}