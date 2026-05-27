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
        <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-muted-foreground">Sign in</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Sign in to English OS
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Sign in to access your personalized learning dashboard with roadmap,
            resources, and guided practice.
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
                GitHub sign-in unavailable
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

      </div>
    </main>
  );
}
