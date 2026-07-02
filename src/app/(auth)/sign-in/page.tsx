import Link from "next/link";
import { redirect } from "next/navigation";

import { isGithubAuthConfigured } from "@/shared/config/env";
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
      <div className="mx-auto w-full max-w-xl">
        {!session ? (
          <div className="mb-6 rounded-2xl border border-surface-stroke bg-surface-panel p-5">
            <p className="text-sm font-semibold text-foreground">New to English OS?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with a 60-second setup — tell us your level and goal, and we&apos;ll build a calm learning path for you.
            </p>
            <div className="mt-3">
              <Link href="/onboarding" className={buttonVariants({ size: "sm" })}>
                Get started
              </Link>
            </div>
          </div>
        ) : null}
        <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-muted-foreground">Sign in</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Welcome to English OS
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Sign in to sync your progress across devices, or continue as a guest to try it out first.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isGithubAuthConfigured ? (
              <form action={signInWithGithub}>
                <Button size="lg" type="submit">
                  Sign in with GitHub
                </Button>
              </form>
            ) : (
              <Button size="lg" disabled>
                GitHub sign-in unavailable
              </Button>
            )}

            <Link
              href="/dashboard"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Continue as guest
            </Link>
            <p className="text-xs text-muted-foreground">Your data will be saved on this device only.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
