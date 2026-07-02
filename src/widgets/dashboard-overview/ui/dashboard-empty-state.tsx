import Link from "next/link";
import { Sparkles } from "lucide-react";

import { buttonVariants } from "@/shared/ui/button";

import { DashboardCard, SectionEyebrow } from "@/shared/ui/surfaces";

export function DashboardEmptyState() {
  return (
    <DashboardCard className="overflow-hidden bg-[linear-gradient(180deg,var(--surface-panel-strong),var(--surface-panel))] p-6 sm:p-7">
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,var(--surface-module-pink),transparent_60%),radial-gradient(circle_at_top_right,var(--surface-module-blue),transparent_55%)]" />
      <div className="relative">
        <SectionEyebrow icon={Sparkles}>Dashboard reset</SectionEyebrow>
        <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Curated content is not loaded yet.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Once a roadmap template is available, this screen will surface the
          next block, best support resource, review pressure, and output
          actions from one calm control center.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/roadmap" className={buttonVariants({ size: "lg" })}>
            Open roadmap
          </Link>
          <Link
            href="/resources"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Open resources
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}
