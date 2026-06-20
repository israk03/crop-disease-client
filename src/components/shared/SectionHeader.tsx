import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  href,
  hrefLabel = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-zinc-100 dark:border-zinc-900/60 select-none", 
        className
      )}
    >
      {/* Informational Header Group */}
      <div className="space-y-1 max-w-2xl">
        <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-50 tracking-tight uppercase">
          {title}
        </h2>

        {description && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 tracking-wide font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Global Interface Navigation Route Action */}
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-xs font-bold font-mono text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors shrink-0 self-start sm:self-auto bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-400/5 dark:hover:bg-emerald-400/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/10 dark:border-emerald-400/10"
        >
          <span>{hrefLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      )}
    </div>
  );
}