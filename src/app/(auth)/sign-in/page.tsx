import Link from "next/link";
import { redirect } from "next/navigation";

import {
  isDatabaseConfigured,
  isGithubAuthConfigured,
} from "@/shared/config/env";
import { auth, signIn } from "@/server/auth";
import { Button, buttonVariants } from "@/shared/ui/button";

async function signInWithGithub() {
  "use server";

  await signIn("github", { redirectTo: "/dashboard" });
}

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-muted-foreground">Sign in</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Authentication scaffold
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            The styled auth page has been removed. This route is now a simple
            working screen for GitHub sign-in and guest access while the final
            direction is still undecided.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isGithubAuthConfigured ? (
              <form action={signInWithGithub}>
                <Button size="lg" type="submit">
                  Sign in with GitHub
                </Button>
              </form>
            ) : (
              <Button size="lg" disabled>
                GitHub sign-in pending setup
              </Button>
            )}

            <Link
              href="/dashboard"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Continue in guest mode
            </Link>
          </div>
        </section>

        <aside className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Setup status</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-md border border-border bg-background px-4 py-3">
              <p className="font-medium text-foreground">GitHub OAuth</p>
              <p className="mt-2 leading-6 text-muted-foreground">
                {isGithubAuthConfigured
                  ? "Configured"
                  : "Missing AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, or AUTH_SECRET"}
              </p>
            </li>

            <li className="rounded-md border border-border bg-background px-4 py-3">
              <p className="font-medium text-foreground">Prisma adapter</p>
              <p className="mt-2 leading-6 text-muted-foreground">
                {isDatabaseConfigured
                  ? "Database URL detected"
                  : "Missing DATABASE_URL and DIRECT_URL"}
              </p>
            </li>

            <li className="rounded-md border border-border bg-background px-4 py-3">
              <p className="font-medium text-foreground">Route handlers</p>
              <p className="mt-2 leading-6 text-muted-foreground">
                `/api/auth/[...nextauth]` and `proxy.ts` are already wired.
              </p>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
