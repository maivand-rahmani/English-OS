import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { DashboardCard, SectionEyebrow } from "@/shared/ui/surfaces";

type DashboardCelebrationCardProps = {
  title: string;
  message: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

export function DashboardCelebrationCard({
  title,
  message,
  primaryAction,
  secondaryAction,
}: DashboardCelebrationCardProps) {
  return (
    <DashboardCard tone="lavender" className="overflow-hidden p-6 sm:p-7">
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_right,var(--surface-module-pink),transparent_55%)]" />

      <div className="relative">
        <SectionEyebrow icon={CheckCircle}>All done</SectionEyebrow>

        <h3 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h3>

        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          {message}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryAction.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full",
            )}
          >
            {primaryAction.label}
          </Link>

          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full",
              )}
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>
    </DashboardCard>
  );
}
