import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Leaf, Cpu, ShieldCheck, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | Crop Disease Platform",
  description: "Sign in to your AgriSense account to manage crop pathology logs and communicate with experts.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-12 bg-background select-none">
      {/* Left Column: Platform Branding & Core System Matrix */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between bg-emerald-950 p-12 text-white overflow-hidden border-r border-emerald-900">
        {/* Subtle Decorative Farm Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        
        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30">
            <Leaf className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight bg-linear-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent">
            AgriSense AI
          </span>
        </div>

        {/* System & Operations Context */}
        <div className="relative z-10 my-auto space-y-8 max-w-sm">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight leading-tight">
              Monitor farm pathology metrics seamlessly.
            </h2>
            <p className="text-emerald-300/80 text-sm">
              Log back into your command center to check outstanding field diagnostics and run model analytics.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-900/60 border border-emerald-800 text-emerald-400 mt-0.5">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Vision Model Pipeline</h4>
                <p className="text-xs text-emerald-300/70">Asynchronous background workers optimizing disease telemetry charts.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-900/60 border border-emerald-800 text-emerald-400 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Verified Crop Diagnostics</h4>
                <p className="text-xs text-emerald-300/70">Secure, encrypted access to diagnostic history, maps, and treatment metrics.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-900/60 border border-emerald-800 text-emerald-400 mt-0.5">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Active Consultations</h4>
                <p className="text-xs text-emerald-300/70">Real-time Socket.io lines connecting field findings with expert desks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-emerald-400/60 font-mono">
          PRODUCTION-READY AGRI-TECH V1.0
        </div>
      </div>

      {/* Right Column: Login Form Container */}
      <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50/50 dark:bg-zinc-950/20">
        <LoginForm />
      </div>
    </main>
  );
}