import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid } from "date-fns";

// ─────────────────────────────────────────────────────────────
// Tailwind Class Merger
// ─────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────
// Date Helpers
// ─────────────────────────────────────────────────────────────

function parseDate(date: string | Date) {
  const parsed = new Date(date);
  return isValid(parsed) ? parsed : null;
}

export function formatDate(date: string | Date): string {
  const parsed = parseDate(date);

  if (!parsed) return "-";

  return format(parsed, "MMM dd, yyyy");
}

export function formatDateTime(
  date: string | Date
): string {
  const parsed = parseDate(date);

  if (!parsed) return "-";

  return format(parsed, "MMM dd, yyyy • h:mm a");
}

export function timeAgo(
  date: string | Date
): string {
  const parsed = parseDate(date);

  if (!parsed) return "-";

  return formatDistanceToNow(parsed, {
    addSuffix: true,
  });
}

// ─────────────────────────────────────────────────────────────
// String Helpers
// ─────────────────────────────────────────────────────────────

export function capitalize(
  value?: string
): string {
  if (!value?.trim()) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1).toLowerCase()
  );
}

export function truncate(
  value: string,
  maxLength: number
): string {
  if (!value) return "";

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

export function getInitials(
  name?: string
): string {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function slugify(
  value: string
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ─────────────────────────────────────────────────────────────
// Severity Helpers
// ─────────────────────────────────────────────────────────────

export type Severity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

const severityColorMap: Record<
  Severity,
  string
> = {
  LOW:
    "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800",

  MEDIUM:
    "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800",

  HIGH:
    "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/30 dark:border-orange-800",

  CRITICAL:
    "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800",
};

const severityDotMap: Record<
  Severity,
  string
> = {
  LOW: "bg-green-500",
  MEDIUM: "bg-amber-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500",
};

export function getSeverityColor(
  severity: Severity
) {
  return severityColorMap[severity];
}

export function getSeverityDot(
  severity: Severity
) {
  return severityDotMap[severity];
}

// ─────────────────────────────────────────────────────────────
// Number Helpers
// ─────────────────────────────────────────────────────────────

export function formatNumber(
  value: number
): string {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercentage(
  value: number,
  total: number
): string {
  if (!total) return "0%";

  return `${Math.round(
    (value / total) * 100
  )}%`;
}

export function formatCurrency(
  value: number,
  currency = "USD"
): string {
  return Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─────────────────────────────────────────────────────────────
// File Helpers
// ─────────────────────────────────────────────────────────────

export function formatFileSize(
  bytes: number
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

export function isImageFile(
  fileName: string
): boolean {
  return /\.(jpg|jpeg|png|webp)$/i.test(
    fileName
  );
}

// ─────────────────────────────────────────────────────────────
// Error Helpers
// ─────────────────────────────────────────────────────────────

export function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong. Please try again.";
}