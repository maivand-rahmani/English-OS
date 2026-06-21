import type { HTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "default" | "lg";
};

const sizeClasses = {
  sm: "size-4",
  default: "size-6",
  lg: "size-8",
} as const;

export function Spinner({
  className,
  size = "default",
  ...props
}: SpinnerProps) {
  return (
    <div
      {...props}
      role="status"
      aria-label="Loading"
      className={cn("flex items-center justify-center", className)}
    >
      <LoaderCircle
        aria-hidden
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
      />
    </div>
  );
}

type SpinnerPageProps = {
  message?: string;
};

export function SpinnerPage({ message }: SpinnerPageProps) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}
