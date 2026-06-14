import type { ReactNode } from "react";

interface CommonLayoutProps {
  children: ReactNode;
}

export default function CommonLayout({
  children,
}: CommonLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
}