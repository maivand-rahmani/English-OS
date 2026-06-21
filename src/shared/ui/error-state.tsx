import type { ComponentType, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { IconWell } from "@/shared/ui/surfaces";

type ErrorStateProps = {
  icon?: ComponentType<{ className?: string }>;
  title?: string;
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
  className?: string;
};

export function ErrorState({
  icon: Icon,
  title = "Something went wrong",
  message,
  onRetry,
  children,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-[2.4rem] border border-surface-stroke bg-surface-panel px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? (
        <IconWell
          icon={Icon}
          className="mb-4 size-12 rounded-[1.25rem] bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400"
        />
      ) : null}
      <h2 className="max-w-md text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {message ? (
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {message}
        </p>
      ) : null}
      {onRetry ? (
        <div className="mt-6">
          <Button variant="outline" size="default" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
      {children}
    </div>
  );
}
