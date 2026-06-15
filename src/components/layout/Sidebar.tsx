"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { NavSection } from "@/constants/nav.constants";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  sections: NavSection[];
}

export function Sidebar({ sections }: SidebarProps) {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useAuth();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(() => {
  if (typeof window === "undefined") {
    return false;
  }

  const saved = localStorage.getItem("sidebar-collapsed");
  return saved === "true";
});

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const isActive = (href: string) => {
    if (href === "/dashboard" || href.endsWith("/dashboard")) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <motion.aside
      animate={{
        width: collapsed ? 76 : 270,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="hidden md:flex relative flex-col h-screen bg-zinc-950 border-r border-zinc-800 text-zinc-400 shrink-0 overflow-hidden"
    >
      {/* Platform Branding Header */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-zinc-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Leaf className="w-4 h-4 text-emerald-400" />
        </div>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="font-display font-bold text-sm tracking-tight whitespace-nowrap bg-linear-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent"
            >
              AgriSense AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Sub-sections */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-7 custom-scrollbar">
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <AnimatePresence mode="wait">
              {!collapsed && section.title && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="px-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500 font-mono"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>

            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium relative transition-all duration-200 outline-none select-none",
                        active
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors duration-200",
                          active ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"
                        )}
                      />

                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="whitespace-nowrap tracking-wide"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Item Badges */}
                      {!collapsed && item.badge && (
                        <span className="ml-auto text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}

                      {/* Selection Strip Accent */}
                      {active && (
                        <span className="absolute left-0 top-1/3 bottom-1/3 w-0.5 rounded-r bg-emerald-400" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Authenticated User Account Block */}
      <div className="border-t border-zinc-800 p-4 bg-zinc-950 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border border-zinc-800 ring-1 ring-zinc-900 shadow-inner">
            <AvatarImage
              src={user?.avatar ?? ""}
              alt={user?.name ?? ""}
            />
            <AvatarFallback className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-900/50 font-bold font-mono">
              {user?.name ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0 space-y-0.5"
              >
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-zinc-200 truncate leading-none">
                    {user?.name ?? "Field Operator"}
                  </p>
                  {user?.role && (
                    <span className="text-[9px] font-bold uppercase tracking-wider font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">
                      {user.role.toLowerCase()}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-zinc-500 truncate font-mono">
                  {user?.email ?? ""}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="w-8 h-8 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Collapse Geometry Control Toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-5 right-3 z-20 w-5 h-5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-200 shadow-md flex items-center justify-center transition-all duration-200 hover:border-zinc-700"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}