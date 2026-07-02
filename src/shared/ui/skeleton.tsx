import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden
      className={cn(
        "animate-pulse rounded-[1.25rem] bg-surface-panel-muted",
        className,
      )}
    />
  );
}

type SkeletonCardProps = SkeletonProps & {
  lines?: number;
};

export function SkeletonCard({
  className,
  lines = 3,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      {...props}
      aria-hidden
      className={cn(
        "rounded-[2rem] border border-surface-stroke bg-surface-panel p-6",
        className,
      )}
    >
      <Skeleton className="mb-4 h-3.5 w-24 rounded-full" />
      <Skeleton className="mb-3 h-5 w-3/4" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-3",
              i === lines - 1 ? "w-1/2" : "w-full",
            )}
          />
        ))}
      </div>
    </div>
  );
}

type SkeletonGridProps = {
  count?: number;
  className?: string;
};

export function SkeletonGrid({ count = 3, className }: SkeletonGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}
