import type { ComponentType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export type SurfaceTone =
  | "default"
  | "pink"
  | "lavender"
  | "blue"
  | "green"
  | "cream";

const surfaceToneClasses: Record<SurfaceTone, string> = {
  default: "bg-surface-panel",
  pink: "bg-surface-module-pink",
  lavender: "bg-surface-module-lavender",
  blue: "bg-surface-module-blue",
  green: "bg-surface-module-green",
  cream: "bg-surface-module-cream",
};

type WorkspaceFrameProps = {
  children: ReactNode;
  className?: string;
};

export function WorkspaceFrame({ children, className }: WorkspaceFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2.4rem] border border-surface-stroke bg-surface-panel-strong shadow-float backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

type InsetPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: SurfaceTone;
};

export function InsetPanel({
  children,
  className,
  tone = "default",
  ...props
}: InsetPanelProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-[1.55rem] border border-surface-stroke-strong shadow-panel transition-all duration-[var(--motion-duration-fast)] ease-out hover:translate-y-[-1px] hover:shadow-[0_14px_36px_rgba(20,20,30,0.07)]",
        tone === "default" ? "bg-surface-panel-muted" : surfaceToneClasses[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

type IconWellProps = {
  icon: ComponentType<{ className?: string }>;
  className?: string;
};

export function IconWell({ icon: Icon, className }: IconWellProps) {
  return (
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-[1rem] bg-surface-dark-control text-primary-foreground shadow-control",
        className,
      )}
    >
      <Icon className="size-4.5" />
    </div>
  );
}

type DashboardCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: SurfaceTone;
};

export function DashboardCard({
  children,
  className,
  tone = "default",
  ...props
}: DashboardCardProps) {
  return (
    <article
      {...props}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-surface-stroke shadow-panel animate-in fade-in slide-in-from-bottom-4 duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)] transition-all duration-[var(--motion-duration-fast)] ease-out hover:translate-y-[-2px] hover:shadow-[0_16px_40px_rgba(20,20,30,0.08)]",
        surfaceToneClasses[tone],
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
    <div className="inline-flex items-center gap-2 rounded-full border border-surface-stroke-strong bg-surface-pill px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      <Icon className="size-3.5" />
      {children}
    </div>
  );
}

type SummaryBadgeProps = {
  label: string;
  value: string;
  accent: "neutral" | "pink" | "lavender" | "blue" | "green" | "cream";
};

export function SummaryBadge({ label, value, accent }: SummaryBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-[1.45rem] border border-surface-stroke-strong px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
        accent === "neutral" && "bg-surface-panel-muted",
        accent === "pink" && "bg-surface-module-pink",
        accent === "lavender" && "bg-surface-module-lavender",
        accent === "blue" && "bg-surface-module-blue",
        accent === "green" && "bg-surface-module-green",
        accent === "cream" && "bg-surface-module-cream",
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
  tone?: SurfaceTone;
};

export function PlanRow({
  icon: Icon,
  title,
  headline,
  meta,
  state,
  tone = "default",
}: PlanRowProps) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-[1.55rem] border border-surface-stroke-strong px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center",
        surfaceToneClasses[tone],
      )}
    >
      <IconWell icon={Icon} />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{headline}</p>
        <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
      </div>
      <div className="rounded-full border border-surface-stroke-strong bg-surface-pill px-3 py-1 text-xs font-medium text-muted-foreground">
        {state}
      </div>
    </div>
  );
}

type InfoTileProps = {
  label: string;
  value: string;
  tone?: SurfaceTone;
  detail?: string;
};

export function InfoTile({ label, value, tone = "default", detail }: InfoTileProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border border-surface-stroke-strong px-4 py-3 transition-all duration-[var(--motion-duration-fast)] ease-out hover:translate-y-[-1px] hover:shadow-[0_12px_32px_rgba(20,20,30,0.06)]",
        surfaceToneClasses[tone],
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
      {detail ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}

type MetricTileProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: SurfaceTone;
  detail?: string;
};

export function MetricTile({
  icon: Icon,
  label,
  value,
  tone,
  detail,
}: MetricTileProps) {
  return (
    <div
      className={cn(
        "rounded-[1.45rem] border border-surface-stroke-strong px-4 py-3 transition-all duration-[var(--motion-duration-fast)] ease-out hover:translate-y-[-1px] hover:shadow-[0_12px_32px_rgba(20,20,30,0.06)]",
        surfaceToneClasses[tone],
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
      {detail ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}

type QuickActionCardProps = {
  detail?: string;
  eyebrow?: string;
  footer?: string;
  icon?: ComponentType<{ className?: string }>;
  label?: string;
  description?: string;
  tone?: SurfaceTone;
  title?: string;
  [key: string]: unknown;
};

export function QuickActionCard({
  detail,
  eyebrow,
  footer,
  icon: Icon,
  label,
  description,
  tone,
  title,
  children,
}: QuickActionCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.55rem] border border-surface-stroke-strong px-4 py-4 transition-all duration-[var(--motion-duration-fast)] ease-out hover:translate-y-[-2px] hover:shadow-[0_16px_40px_rgba(20,20,30,0.08)]",
        surfaceToneClasses[(tone as SurfaceTone) ?? "default"],
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        {label && <p className="text-sm font-semibold text-foreground">{label}</p>}
      </div>
      {eyebrow ? (
        <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
      ) : null}
      {detail || description ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {detail ?? description}
        </p>
      ) : null}
      {footer ? (
        <p className="mt-3 text-xs font-medium text-muted-foreground">{footer}</p>
      ) : null}
      {children as ReactNode}
    </div>
  );
}

type SmallTagProps = {
  children: ReactNode;
  className?: string;
};

export function SmallTag({ children, className }: SmallTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-surface-stroke-strong bg-surface-pill px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
