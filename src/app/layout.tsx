import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import "./globals.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      "https://agrisense.com"
  ),

  title: {
    default: "AgriSense",
    template: "%s | AgriSense",
  },

  description:
    "AI-powered crop disease detection, smart farm management, agricultural analytics, expert consultations, disease alerts, and weather-based farming recommendations.",

  keywords: [
    "agriculture",
    "crop disease detection",
    "plant disease",
    "AI agriculture",
    "smart farming",
    "farm management",
    "agricultural advisory",
    "crop monitoring",
    "expert consultation",
    "disease prediction",
  ],

  applicationName: "AgriSense",

  authors: [
    {
      name: "AgriSense Team",
    },
  ],

  creator: "AgriSense",
  publisher: "AgriSense",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AgriSense",

    title: "AgriSense",
    description:
      "AI-powered crop disease detection and agricultural intelligence platform.",

    url:
      process.env.NEXT_PUBLIC_APP_URL ??
      "https://agrisense.com",
  },

  twitter: {
    card: "summary_large_image",

    title: "AgriSense",

    description:
      "AI-powered crop disease detection and agricultural intelligence platform.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`
          ${inter.variable}
          ${manrope.variable}
          font-sans
          antialiased
          min-h-screen
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}

            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}