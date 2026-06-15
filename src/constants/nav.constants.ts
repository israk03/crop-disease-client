import type { ElementType } from "react";

import {
  LayoutDashboard,
  Tractor,
  Wheat,
  ScanLine,
  History,
  CloudSun,
  Bell,
  Users,
  MessageSquare,
  Star,
  ShieldCheck,
  BarChart3,
  MapPin,
  AlertTriangle,
  FileText,
  Settings,
  User,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: ElementType;
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Farmer Navigation
// ─────────────────────────────────────────────────────────────────────────────

export const FARMER_NAV: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: ROUTES.FARMER.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Farm",
    items: [
      {
        label: "My Farms",
        href: ROUTES.FARMER.FARMS,
        icon: Tractor,
      },
      {
        label: "Crops",
        href: ROUTES.FARMER.FARMS,
        icon: Wheat,
      },
    ],
  },

  {
    title: "Detection",
    items: [
      {
        label: "Detect Disease",
        href: ROUTES.FARMER.DETECT,
        icon: ScanLine,
      },
      {
        label: "Detection History",
        href: ROUTES.FARMER.DETECTIONS,
        icon: History,
      },
    ],
  },

  {
    title: "Community",
    items: [
      {
        label: "Forum",
        href: ROUTES.FARMER.COMMUNITY,
        icon: MessageSquare,
      },
      {
        label: "Experts",
        href: ROUTES.FARMER.EXPERTS,
        icon: Users,
      },
      {
        label: "Consultations",
        href: ROUTES.FARMER.CONSULTATIONS,
        icon: ShieldCheck,
      },
    ],
  },

  {
    title: "Insights",
    items: [
      {
        label: "Weather Advisory",
        href: ROUTES.FARMER.WEATHER,
        icon: CloudSun,
      },
      {
        label: "Disease Alerts",
        href: ROUTES.FARMER.ALERTS,
        icon: AlertTriangle,
      },
    ],
  },

  {
    title: "Account",
    items: [
      {
        label: "Notifications",
        href: ROUTES.FARMER.NOTIFICATIONS,
        icon: Bell,
      },
      {
        label: "Profile",
        href: ROUTES.FARMER.PROFILE,
        icon: User,
      },
      {
        label: "Settings",
        href: ROUTES.FARMER.SETTINGS,
        icon: Settings,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Expert Navigation
// ─────────────────────────────────────────────────────────────────────────────

export const EXPERT_NAV: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: ROUTES.EXPERT.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Consultations",
    items: [
      {
        label: "All Consultations",
        href: ROUTES.EXPERT.CONSULTATIONS,
        icon: MessageSquare,
      },
    ],
  },

  {
    title: "Community",
    items: [
      {
        label: "Forum",
        href: ROUTES.EXPERT.COMMUNITY,
        icon: Users,
      },
    ],
  },

  {
    title: "Account",
    items: [
      {
        label: "Reviews",
        href: ROUTES.EXPERT.REVIEWS,
        icon: Star,
      },
      {
        label: "Notifications",
        href: ROUTES.EXPERT.NOTIFICATIONS,
        icon: Bell,
      },
      {
        label: "Profile",
        href: ROUTES.EXPERT.PROFILE,
        icon: User,
      },
      {
        label: "Settings",
        href: ROUTES.EXPERT.SETTINGS,
        icon: Settings,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Admin Navigation
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_NAV: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Management",
    items: [
      {
        label: "Users",
        href: ROUTES.ADMIN.USERS,
        icon: Users,
      },
      {
        label: "Experts",
        href: ROUTES.ADMIN.EXPERTS,
        icon: ShieldCheck,
      },
    ],
  },

  {
    title: "Monitoring",
    items: [
      {
        label: "Detections",
        href: ROUTES.ADMIN.DETECTIONS,
        icon: ScanLine,
      },
      {
        label: "Consultations",
        href: ROUTES.ADMIN.CONSULTATIONS,
        icon: MessageSquare,
      },
      {
        label: "Alerts",
        href: ROUTES.ADMIN.ALERTS,
        icon: AlertTriangle,
      },
    ],
  },

  {
    title: "Intelligence",
    items: [
      {
        label: "Analytics",
        href: ROUTES.ADMIN.ANALYTICS,
        icon: BarChart3,
      },
      {
        label: "Outbreak Map",
        href: ROUTES.ADMIN.OUTBREAKS,
        icon: MapPin,
      },
      {
        label: "Reports",
        href: "/admin/reports",
        icon: FileText,
      },
    ],
  },

  {
    title: "Account",
    items: [
      {
        label: "Notifications",
        href: ROUTES.ADMIN.NOTIFICATIONS,
        icon: Bell,
      },
      {
        label: "Profile",
        href: ROUTES.ADMIN.PROFILE,
        icon: User,
      },
      {
        label: "Settings",
        href: ROUTES.ADMIN.SETTINGS,
        icon: Settings,
      },
    ],
  },
];