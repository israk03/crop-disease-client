import Link from "next/link";
import { Home, Search, Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        {/* Brand Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-10 w-10 text-primary" />
        </div>

        {/* Error Code */}
        <h1 className="font-display text-7xl font-bold tracking-tight text-foreground">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, may have been moved,
          or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}