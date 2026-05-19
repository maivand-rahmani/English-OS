"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Sparkles } from "lucide-react";

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
  const userInitial = userLabel.trim().charAt(0).toUpperCase() || "G";
  const SectionIcon = currentSection.icon;

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[var(--app-shell-max-width)] overflow-hidden rounded-[2rem] border border-white/65 bg-[var(--surface-1)] shadow-[var(--shell-shadow)] backdrop-blur-2xl lg:min-h-[calc(100vh-3rem)]">
        {/* ===== ICON RAIL — per‑page navigation icons ===== */}
        <aside className="border-b border-white/55 bg-[var(--surface-2)] lg:flex lg:w-[var(--icon-rail-width)] lg:flex-col lg:border-r lg:border-b-0">
          <div className="flex w-full items-center justify-between gap-4 px-4 py-4 lg:flex-1 lg:flex-col lg:justify-start lg:px-3 lg:py-6">
            {/* Logo + branding */}
            <div className="flex items-center gap-3 lg:flex-col">
              <Link
                href="/dashboard"
                className="flex size-12 items-center justify-center rounded-[1.1rem] border border-white/70 bg-[var(--surface-3)] text-sm font-semibold tracking-[0.22em] text-foreground shadow-[var(--shadow-soft)] transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5"
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

            {/* Bottom status card */}
            <div className="hidden w-full lg:mt-auto lg:block">
              <div className="rounded-[1.35rem] border border-white/65 bg-[var(--surface-3)] p-3 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <p className="text-xs font-medium text-foreground">
                    Shell active
                  </p>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Theme tokens and section routes are now persistent.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ===== MAIN AREA ===== */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/60 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-center">
              <div className="hidden xl:block">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {currentSection.eyebrow}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {currentSection.description}
                </p>
              </div>

              <nav
                aria-label="Top navigation"
                className="overflow-x-auto xl:justify-self-center"
              >
                <div className="inline-flex min-w-max items-center gap-1 rounded-full border border-white/70 bg-[var(--surface-2)] p-1.5 shadow-[var(--shadow-soft)]">
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
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/70 bg-[var(--surface-2)] text-muted-foreground shadow-[var(--shadow-soft)] transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5 hover:text-foreground"
                  aria-label="Search"
                >
                  <Search className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/70 bg-[var(--surface-2)] text-muted-foreground shadow-[var(--shadow-soft)] transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5 hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                </button>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-[var(--surface-3)] px-2 py-2 shadow-[var(--shadow-soft)]">
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

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <SectionIcon className="size-3.5" />
                  {currentSection.eyebrow}
                </div>
                <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
                  {currentSection.title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {currentSection.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3 shadow-[var(--shadow-soft)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Focus
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    Persistent shell, calm transitions, local section clarity.
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-white/70 bg-[var(--surface-2)] px-4 py-3 shadow-[var(--shadow-soft)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Build state
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="size-4" />
                    Application shell in progress
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ===== MAIN CONTENT — full width, no inner sidebar ===== */}
          <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <main
              key={pathname}
              className="h-full rounded-[1.75rem] border border-white/65 bg-[var(--surface-3)] p-4 shadow-[var(--shadow-soft)] animate-in fade-in slide-in-from-bottom-3 duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)] sm:p-5 lg:p-6"
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
