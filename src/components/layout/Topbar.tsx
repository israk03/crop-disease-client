"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Sun, Moon, Menu, User, Settings, LogOut, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getInitials, cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);

  

  const getPageTitle = () => {
    const segment =
      pathname.split("/").filter(Boolean).pop() ?? "dashboard";

    return (
      segment.charAt(0).toUpperCase() +
      segment.slice(1).replace(/-/g, " ")
    );
  };

  const profileRoute =
    user?.role === "ADMIN"
      ? ROUTES.ADMIN.PROFILE
      : user?.role === "EXPERT"
      ? ROUTES.EXPERT.PROFILE
      : ROUTES.FARMER.PROFILE;

  const settingsRoute =
    user?.role === "ADMIN"
      ? ROUTES.ADMIN.SETTINGS
      : user?.role === "EXPERT"
      ? ROUTES.EXPERT.SETTINGS
      : ROUTES.FARMER.SETTINGS;

  const notificationsRoute =
    user?.role === "ADMIN"
      ? ROUTES.ADMIN.NOTIFICATIONS
      : user?.role === "EXPERT"
      ? ROUTES.EXPERT.NOTIFICATIONS
      : ROUTES.FARMER.NOTIFICATIONS;

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Mobile Sidebar Trigger Toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          onClick={onMenuClick}
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Semantic Page Title Typography */}
        <h1 className="hidden sm:block text-sm font-bold text-zinc-900 dark:text-zinc-50 font-display tracking-tight uppercase">
          {getPageTitle()}
        </h1>
      </div>

      {/* Control Actions Container */}
      <div className="flex items-center gap-2.5">
        
        {/* Dynamic Context Search Form */}
        <div
          className={cn(
            "relative flex items-center transition-all duration-300 ease-in-out rounded-xl border border-transparent",
            searchOpen 
              ? "w-64 bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 px-2" 
              : "w-9"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-9 h-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 shrink-0 rounded-xl",
              searchOpen && "hover:bg-transparent dark:hover:bg-transparent text-emerald-600 dark:text-emerald-400"
            )}
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <Search className="w-4 h-4" />
          </Button>

          {searchOpen && (
            <Input
              autoFocus
              placeholder="Search assets, fields, diagnostics..."
              onBlur={() => {
                // Short timeout to avoid blocking clicks inside search context
                setTimeout(() => setSearchOpen(false), 200);
              }}
              className="h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-xs text-zinc-800 dark:text-zinc-200 px-1 placeholder:text-zinc-400"
            />
          )}
        </div>

        {/* Light / Dark Mode System Theme Switcher */}
        <Button
  variant="ghost"
  size="icon"
  className="w-9 h-9"
  onClick={() =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }
>
  {resolvedTheme === "dark" ? (
    <Sun className="w-4 h-4" />
  ) : (
    <Moon className="w-4 h-4" />
  )}
</Button>

        {/* real-time notification Center Access Bell */}
        <Link href={notificationsRoute}>
          <Button
            variant="ghost"
            size="icon"
            className="relative w-9 h-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Bell className="w-4 h-4" />
            {/* Outbreak / System Event Ping Accent Indicator */}
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </Button>
        </Link>

        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* User Workspace Profile Navigation Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-xl p-0 hover:opacity-90 transition-opacity focus-visible:ring-emerald-600 border border-zinc-200 dark:border-zinc-800"
            >
              <Avatar className="h-full w-full rounded-xl">
                <AvatarImage
                  src={user?.avatar ?? ""}
                  alt={user?.name ?? ""}
                />
                <AvatarFallback className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold font-mono rounded-xl">
                  {user?.name ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-60 p-1.5 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-lg"
          >
            {/* Identity Card Block */}
            <div className="px-3 py-2.5 space-y-1 bg-zinc-50/60 dark:bg-zinc-950/40 rounded-lg border border-zinc-100 dark:border-zinc-850 mb-1.5">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {user?.name}
                </p>
                {user?.role && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-1 rounded dark:text-emerald-400">
                    {user.role.toLowerCase()}
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                {user?.email}
              </p>
            </div>

            {/* Profile Route Links */}
            <DropdownMenuItem className="rounded-lg text-xs py-2 px-3 text-zinc-700 dark:text-zinc-300 focus:bg-zinc-50 dark:focus:bg-zinc-800 cursor-pointer">
              <Link href={profileRoute} className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>

            {/* Settings Route Links */}
            <DropdownMenuItem className="rounded-lg text-xs py-2 px-3 text-zinc-700 dark:text-zinc-300 focus:bg-zinc-50 dark:focus:bg-zinc-800 cursor-pointer">
              <Link href={settingsRoute} className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>Workspace Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 border-zinc-100 dark:border-zinc-800" />

            {/* Authentication Destruction Interface Trigger */}
            <DropdownMenuItem
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="rounded-lg text-xs py-2 px-3 text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-600 dark:focus:text-rose-400 cursor-pointer flex items-center gap-2 font-medium"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                  <span>Terminating...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Session</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}