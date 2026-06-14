export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-background"
      role="status"
      aria-label="Loading page"
    >
      {/* Logo / Brand */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
        <span className="font-display text-2xl font-bold text-primary">
          AgriSense
        </span>
      </div>

      {/* Spinner */}
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-t-primary animate-spin" />
      </div>

      {/* Text */}
      <p className="mt-6 text-sm text-muted-foreground">
        Loading agricultural intelligence...
      </p>
    </div>
  );
}