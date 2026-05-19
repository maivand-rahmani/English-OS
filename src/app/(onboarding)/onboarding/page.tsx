import Link from "next/link";

import { buttonVariants } from "@/shared/ui/button";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/60 bg-[var(--surface-1)] p-6 shadow-[var(--shell-shadow)] backdrop-blur-xl sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Onboarding placeholder
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
          The onboarding route is reserved and ready for the next phase.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          This route exists so profile setup, goal capture, and first-roadmap
          generation can be added without reshaping the app structure later.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Capture learner level, goals, and study rhythm.",
            "Generate the first roadmap and recommended resources.",
            "Send the learner into Dashboard as the daily home base.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/sign-in" className={buttonVariants({ size: "lg" })}>
            Review auth setup
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Preview the app shell
          </Link>
        </div>
      </div>
    </main>
  );
}
