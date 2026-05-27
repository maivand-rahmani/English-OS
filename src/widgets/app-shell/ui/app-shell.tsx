"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { SearchInput } from "@/shared/ui/input";

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
  const isDashboard = currentSection.key === "dashboard";
  const userInitial = userLabel.trim().charAt(0).toUpperCase() || "G";

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[var(--app-shell-max-width)] overflow-hidden rounded-[2rem] border border-white/65 bg-surface-1 shadow-[var(--shell-shadow)] backdrop-blur-2xl lg:min-h-[calc(100vh-3rem)]">
        {/* ===== ICON RAIL — per‑page navigation icons ===== */}
        <aside className="border-b border-white/55 bg-surface-2 lg:flex lg:w-[var(--icon-rail-width)] lg:flex-col lg:border-r lg:border-b-0">
          <div className="flex w-full items-center justify-between gap-4 px-4 py-4 lg:flex-1 lg:flex-col lg:justify-start lg:px-3 lg:py-6">
            {/* Logo + branding */}
            <div className="flex items-center gap-3 lg:flex-col">
              <Link
                href="/dashboard"
                className="flex size-12 items-center justify-center rounded-[1.1rem] border border-white/70 bg-surface-3 text-sm font-semibold tracking-[0.22em] text-foreground shadow-soft transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5"
              >
                EO
              </Link>
              <div className="lg:text-center">
                <p className="text-sm font-semibold text-foreground">
                  English OS
                </p>
                <p className="text-xs text-muted-foreground">
                  Learn with structure
                </p>
              </div>
            </div>

            {/* Per‑page section navigation icons */}
            <nav
              aria-label={`${currentSection.title} navigation`}
              className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {currentSection.sidebarItems.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  title={item.label}
                  className={cn(
                    "group flex h-11 min-w-11 items-center justify-center rounded-[1rem] border border-transparent bg-white/35 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/70 hover:text-foreground lg:w-11",
                    index === 0 &&
                      "border-black/10 bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(17,17,20,0.22)]"
                  )}
                >
                  {item.icon ? (
                    <item.icon className="size-4" />
                  ) : (
                    <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                      {item.label
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")
                        .slice(0, 3)}
                    </span>
                  )}
                </button>
              ))}
            </nav>

          </div>
        </aside>

        {/* ===== MAIN AREA ===== */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/60 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <nav
                aria-label="Top navigation"
                className="overflow-x-auto"
              >
                <div className="inline-flex min-w-max items-center gap-1 rounded-full border border-white/70 bg-surface-2 p-1.5 shadow-soft">
                  {appNavigation.map((item) => {
                    const isActive = item.key === currentSection.key;

                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:text-foreground sm:px-5",
                          isActive &&
                            "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(17,17,20,0.18)]"
                        )}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="flex items-center justify-start gap-2 xl:justify-end">
                <SearchInput
                  placeholder="Search resources..."
                  className="w-64"
                />
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/70 bg-surface-2 text-muted-foreground shadow-soft transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5 hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                </button>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-surface-3 px-2 py-2 shadow-soft">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {userInitial}
                  </div>
                  <div className="hidden pr-2 sm:block">
                    <p className="text-sm font-semibold text-foreground">
                      {userLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ready for focused practice
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {isDashboard ? (
                <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
                  {currentSection.title}
                </h1>
              ) : (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {currentSection.eyebrow}
                  </p>
                  <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
                    {currentSection.title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {currentSection.description}
                  </p>
                </div>
              )}
            </div>
          </header>

          {/* ===== MAIN CONTENT — full width, no inner sidebar ===== */}
          <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <main
              key={pathname}
              className="h-full animate-slide-in-from-bottom rounded-[1.75rem] border border-white/65 bg-surface-3 p-4 shadow-soft sm:p-5 lg:p-6"
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
