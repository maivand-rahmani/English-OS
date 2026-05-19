import Link from "next/link";

import {
  type AppSectionKey,
  getAppSection,
} from "@/shared/config/navigation";
import { buttonVariants } from "@/shared/ui/button";

type RoutePlaceholderProps = {
  sectionKey: AppSectionKey;
  title: string;
  description: string;
  focusPoints: string[];
  nextStepHref: string;
  nextStepLabel: string;
};

export function RoutePlaceholder({
  sectionKey,
  title,
  description,
  focusPoints,
  nextStepHref,
  nextStepLabel,
}: RoutePlaceholderProps) {
  const section = getAppSection(sectionKey);
  const SectionIcon = section.icon;

  return (
    <section className="space-y-[var(--layout-gap)]">
      <div className="grid gap-[var(--layout-gap)] xl:grid-cols-[minmax(0,1.35fr)_20rem]">
        <div className="rounded-[1.75rem] border border-white/70 bg-[var(--surface-1)] p-6 shadow-[var(--shadow-soft)] sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <SectionIcon className="size-3.5" />
            {section.title} scaffold
          </div>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={nextStepHref} className={buttonVariants({ size: "lg" })}>
              {nextStepLabel}
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Open auth setup
            </Link>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/70 bg-[var(--surface-2)] p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Section intent
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {section.description}
          </p>

          <div className="mt-5 rounded-[1.25rem] border border-white/70 bg-[var(--surface-3)] p-4">
            <p className="text-sm font-semibold text-foreground">Build note</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This route now lives inside the shared shell, so later phases can
              add real workflow UI without revisiting global navigation.
            </p>
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-dashed border-black/10 bg-black/5 p-4">
            <p className="text-sm font-semibold text-foreground">
              Next handoff
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep route files thin and land section-specific widgets here as
              the roadmap advances.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-[var(--layout-gap)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-[1.6rem] border border-white/70 bg-[var(--surface-2)] p-5 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold text-foreground">
            What lands here next
          </p>
          <ul className="mt-4 grid gap-3">
            {focusPoints.map((item) => (
              <li
                key={item}
                className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-3)] px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.6rem] border border-white/70 bg-[var(--surface-2)] p-5 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold text-foreground">
            Shell coverage
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-3)] px-4 py-3 text-muted-foreground">
              Shared top-level navigation is already mounted for this section.
            </li>
            <li className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-3)] px-4 py-3 text-muted-foreground">
              Local sidebar lanes are visible and ready for deep links later.
            </li>
            <li className="rounded-[1.2rem] border border-white/70 bg-[var(--surface-3)] px-4 py-3 text-muted-foreground">
              Theme attributes, spacing tokens, and shell motion now apply here
              consistently.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
