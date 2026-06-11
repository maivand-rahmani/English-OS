import Link from "next/link";
import { Sparkles, Target } from "lucide-react";

import { buttonVariants } from "@/shared/ui/button";

import { DashboardCard, SectionEyebrow } from "@/shared/ui/surfaces";

export function DashboardEmptyState() {
  return (
    <section className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.2fr)_20rem]">
      <DashboardCard className="bg-[linear-gradient(180deg,var(--surface-panel-strong),var(--surface-panel))] p-6 sm:p-7">
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
      </DashboardCard>

      <DashboardCard className="p-5">
        <SectionEyebrow icon={Target}>What this page will answer</SectionEyebrow>
        <ul className="mt-5 grid gap-3">
          {[
            "What should I do today?",
            "What needs review right now?",
            "Where am I making progress?",
            "What is the best next resource?",
          ].map((item) => (
            <li
              key={item}
              className="rounded-[1.2rem] border border-surface-stroke-strong bg-surface-panel-muted px-4 py-3 text-sm text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </DashboardCard>
    </section>
  );
}
