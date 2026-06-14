import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join AgriSense — AI-powered agricultural intelligence platform",
};

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 25% 25%,
              hsl(142 71% 35% / 0.08) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 75% 75%,
              hsl(142 69% 58% / 0.06) 0%,
              transparent 50%
            )
          `,
        }}
      />

      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}