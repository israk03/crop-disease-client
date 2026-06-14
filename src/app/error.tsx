"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background px-6"
      role="alert"
    >
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          An unexpected error occurred while processing your request. You can try again or reload the page.
        </p>

        {/* Dev Error Details */}
        {isDev && (
          <pre className="mt-4 w-full overflow-auto rounded-lg bg-destructive/5 p-3 text-left text-xs text-destructive">
            {error.message}
          </pre>
        )}

        {/* Actions */}
        <div className="mt-8">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </main>
  );
}