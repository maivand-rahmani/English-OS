import type { ComponentType, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import { IconWell } from "@/shared/ui/surfaces";

type EmptyStateAction =
  | {
      label: string;
      href: string;
      variant?: "default" | "outline" | "secondary" | "ghost";
    }
  | {
      label: string;
      onClick: () => void;
      variant?: "default" | "outline" | "secondary" | "ghost";
    };

type EmptyStateProps = {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  children?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[2.4rem] border border-dashed border-surface-stroke-strong bg-surface-panel-muted/60 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? (
        <IconWell
          icon={Icon}
          className="mb-4 size-12 rounded-[1.25rem]"
        />
      ) : null}
      <h2 className="max-w-md text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actions && actions.length > 0 ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {actions.map((action) => {
            if ("href" in action) {
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={buttonVariants({
                    size: "default",
                    variant: action.variant ?? "default",
                  })}
                >
                  {action.label}
                </Link>
              );
            }
            return (
              <Button
                key={action.label}
                size="default"
                variant={action.variant ?? "default"}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      ) : null}
      {children}
    </div>
  );
}
