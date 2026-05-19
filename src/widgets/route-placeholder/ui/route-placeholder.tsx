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

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {section.title} placeholder
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm font-semibold text-foreground">
            What lands here next
          </p>
          <ul className="mt-4 space-y-3">
            {focusPoints.map((item) => (
              <li
                key={item}
                className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm font-semibold text-foreground">Section intent</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {section.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
      </div>
    </section>
  );
}
