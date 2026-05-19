"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  appNavigation,
  getAppSectionByPathname,
} from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  userLabel: string;
};

export function AppShell({ children, userLabel }: AppShellProps) {
  const pathname = usePathname();
  const currentSection = getAppSectionByPathname(pathname);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-border pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                English OS
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-foreground">
                {currentSection.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {currentSection.description}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">{userLabel}</p>
          </div>

          <nav className="mt-5 flex flex-wrap gap-2">
            {appNavigation.map((item) => {
              const isActive = item.key === currentSection.key;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">
              {currentSection.sidebarTitle}
            </p>
            <ul className="mt-4 space-y-2">
              {currentSection.sidebarItems.map((item) => (
                <li
                  key={item.label}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </aside>

          <main className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
