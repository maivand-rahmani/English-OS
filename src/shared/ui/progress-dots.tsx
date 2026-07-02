import * as React from "react";

import { cn } from "@/shared/lib/utils";

export type ProgressDotsProps = React.HTMLAttributes<HTMLDivElement> & {
  current: number;
  total: number;
  ariaLabel?: string;
};

const ProgressDots = React.forwardRef<HTMLDivElement, ProgressDotsProps>(
  ({ className, current, total, ariaLabel, ...props }, ref) => {
    const safeCurrent = Math.min(Math.max(current, 1), total);
    const dots = Array.from({ length: total }, (_, index) => index + 1);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={safeCurrent}
        aria-valuemin={1}
        aria-valuemax={total}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        {dots.map((index) => {
          const isCurrent = index === safeCurrent;
          const isCompleted = index > safeCurrent;
          return (
            <span
              key={index}
              aria-hidden="true"
              data-state={
                isCurrent ? "current" : isCompleted ? "completed" : "upcoming"
              }
              className={cn(
                "block rounded-full border-2 transition-all duration-[var(--motion-duration-fast)] ease-out",
                isCurrent
                  ? "size-3 border-transparent bg-primary"
                  : isCompleted
                    ? "size-2 border-primary bg-primary/40"
                    : "size-2 border-surface-stroke-strong bg-surface-panel"
              )}
            />
          );
        })}
      </div>
    );
  }
);
ProgressDots.displayName = "ProgressDots";

export { ProgressDots };
