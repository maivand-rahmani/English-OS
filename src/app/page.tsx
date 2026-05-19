import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { appNavigation } from "@/shared/config/navigation";
import { buttonVariants } from "@/shared/ui/button";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-[var(--surface-1)] p-6 shadow-[var(--shell-shadow)] backdrop-blur-xl sm:p-8">
        <div className="inline-flex items-center rounded-full border border-border/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Phase 1 foundation
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                English OS
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                A personal operating system for learning English with roadmap,
                resources, and guided practice built in.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                The project foundation is now wired for App Router, Tailwind,
                shadcn/ui, Prisma, and Auth.js. The next phases can build on
                stable routes instead of starting from a blank repo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
                Open the app shell
              </Link>
              <Link
                href="/sign-in"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Check auth setup
              </Link>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-border/80 bg-white/75 p-5 shadow-sm backdrop-blur dark:bg-black/20">
            <p className="text-sm font-semibold text-foreground">
              Base sections ready
            </p>
            <ul className="mt-4 space-y-3">
              {appNavigation.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                >
                  <span className="font-medium text-foreground">{item.title}</span>
                  <span className="text-sm text-muted-foreground">
                    Placeholder route
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
