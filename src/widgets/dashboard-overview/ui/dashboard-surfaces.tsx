import type { ComponentType, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <article
      className={cn(
        "relative rounded-[1.75rem] border border-white/70 bg-[var(--surface-1)] shadow-[var(--shadow-soft)] animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

type SectionEyebrowProps = {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
};

export function SectionEyebrow({ children, icon: Icon }: SectionEyebrowProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      <Icon className="size-3.5" />
      {children}
    </div>
  );
}

type SummaryBadgeProps = {
  label: string;
  value: string;
  accent: "neutral" | "rose" | "blue";
};

export function SummaryBadge({ label, value, accent }: SummaryBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
        accent === "neutral" && "border-white/70 bg-[var(--surface-2)]",
        accent === "rose" &&
          "border-rose-100/70 bg-[linear-gradient(180deg,rgba(255,242,247,0.92),rgba(255,250,252,0.86))]",
        accent === "blue" &&
          "border-sky-100/70 bg-[linear-gradient(180deg,rgba(241,248,255,0.92),rgba(250,252,255,0.9))]",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-foreground">{value}</p>
    </div>
  );
}

type PlanRowProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  headline: string;
  meta: string;
  state: string;
};

export function PlanRow({
  icon: Icon,
  title,
  headline,
  meta,
  state,
}: PlanRowProps) {
  return (
    <div className="grid gap-3 rounded-[1.35rem] border border-white/70 bg-[var(--surface-2)] px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <div className="flex size-11 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(17,17,20,0.18)]">
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{headline}</p>
        <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
      </div>

      <div className="rounded-full border border-white/70 bg-[var(--surface-3)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
        {state}
      </div>
    </div>
  );
}

type InfoTileProps = {
  label: string;
  value: string;
};

export function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="rounded-[1.25rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

type MetricTileProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
};

export function MetricTile({ icon: Icon, label, value, detail }: MetricTileProps) {
  return (
    <div className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-3 text-base font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}

type QuickActionCardProps = {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
  title: string;
  eyebrow: string;
  detail: string;
  footer: string;
};

export function QuickActionCard({
  children,
  icon: Icon,
  title,
  eyebrow,
  detail,
  footer,
}: QuickActionCardProps) {
  return (
    <div className="rounded-[1.35rem] border border-white/70 bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(17,17,20,0.18)]">
          <Icon className="size-4.5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{title}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">{detail}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {footer}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function SmallTag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/70 bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}
