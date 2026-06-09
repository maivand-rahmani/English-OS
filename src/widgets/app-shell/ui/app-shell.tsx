"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import { useMediaQuery } from "@/shared/hooks";
import {
  appHeaderActions,
  appPrimaryNavigation,
  getAppSectionByPathname,
  type AppNavigationItem,
  type AppSection,
} from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";
import { SearchInput } from "@/shared/ui/input";

import { MobileBottomNav } from "./mobile-bottom-nav";

type AppShellProps = {
  children: React.ReactNode;
  userLabel: string;
};

export function AppShell({ children, userLabel }: AppShellProps) {
  const pathname = usePathname();
  const currentSection = getAppSectionByPathname(pathname);
  const isDesktopShell = useMediaQuery("(min-width: 1024px)");
  const userInitial = userLabel.trim().charAt(0).toUpperCase() || "G";

  if (isDesktopShell) {
    return (
      <DesktopAppShell
        currentSection={currentSection}
        pathname={pathname}
        userInitial={userInitial}
        userLabel={userLabel}
      >
        {children}
      </DesktopAppShell>
    );
  }

  return (
    <MobileAppShell
      currentSection={currentSection}
      pathname={pathname}
      userInitial={userInitial}
    >
      {children}
    </MobileAppShell>
  );
}

type SharedShellProps = {
  children: React.ReactNode;
  currentSection: AppSection;
  pathname: string;
};

type DesktopAppShellProps = SharedShellProps & {
  userInitial: string;
  userLabel: string;
};

function DesktopAppShell({
  children,
  currentSection,
  pathname,
  userInitial,
  userLabel,
}: DesktopAppShellProps) {
  const isDashboard = currentSection.key === "dashboard";
  const isRoadmap = currentSection.key === "roadmap";

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[var(--app-shell-max-width)] flex-col overflow-hidden rounded-[2rem] border border-white/65 bg-surface-1 shadow-[var(--shell-shadow)] backdrop-blur-2xl lg:min-h-[calc(100vh-3rem)]">
        <header className="border-b border-white/60 px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[auto_1fr_auto] xl:items-center xl:gap-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex size-12 shrink-0 items-center justify-center rounded-[1.1rem] border border-white/70 bg-surface-3 text-sm font-semibold tracking-[0.22em] text-foreground shadow-soft transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5"
                >
                  EO
                </Link>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">English OS</p>
                  <p className="text-xs text-muted-foreground">
                    Six focused product experiences
                  </p>
                </div>
              </div>

              <nav
                aria-label="Top navigation"
                className="overflow-x-auto xl:justify-self-center"
              >
                <div className="inline-flex min-w-max items-center gap-1 rounded-full border border-white/70 bg-surface-2 p-1.5 shadow-soft">
                  {appPrimaryNavigation.map((item) => {
                    const isActive = item.key === currentSection.key;

                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:text-foreground sm:px-5",
                          isActive &&
                            "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(17,17,20,0.18)]",
                        )}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="flex items-center justify-end gap-2 xl:justify-self-end">
                <SearchInput
                  placeholder="Search resources..."
                  className="hidden w-64 min-[1180px]:block"
                />
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/70 bg-surface-2 text-muted-foreground shadow-soft transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5 hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                </button>
                {appHeaderActions.map((item) => (
                  <HeaderActionLink
                    key={item.key}
                    item={item}
                    isActive={currentSection.key === item.key}
                  />
                ))}
                <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-surface-3 px-2 py-2 shadow-soft">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {userInitial}
                  </div>
                  <div className="pr-2">
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

            <div className={cn("min-w-0", isRoadmap && "sr-only")}>
              {isRoadmap ? (
                <h1>{currentSection.title}</h1>
              ) : isDashboard ? (
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
          </div>
        </header>

        <div className="min-h-0 flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <main
            key={pathname}
            className="h-full animate-slide-in-from-bottom"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function HeaderActionLink({
  item,
  isActive,
}: {
  item: AppNavigationItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      aria-label={item.title}
      href={item.href}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-surface-stroke bg-surface-panel text-muted-foreground shadow-soft transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:-translate-y-0.5 hover:text-foreground sm:border-white/70 sm:bg-surface-2",
        isActive &&
          "border-transparent bg-black text-secondary shadow-[0_10px_24px_rgba(17,17,20,0.18)] hover:text-secondary-foreground",
      )}
    >
      <Icon className="size-4" />
    </Link>
  );
}

type MobileAppShellProps = SharedShellProps & {
  userInitial: string;
};

function MobileAppShell({
  children,
  currentSection,
  pathname,
  userInitial,
}: MobileAppShellProps) {
  const isRoadmap = currentSection.key === "roadmap";

  return (
    <div className="min-h-screen px-3 pt-3 pb-[calc(var(--mobile-bottom-nav-offset)+1rem)] sm:px-4 sm:pt-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        <section className="overflow-hidden rounded-[1.8rem] border border-surface-stroke bg-surface-1 shadow-[var(--shell-shadow)] backdrop-blur-2xl">
          <header className="border-b border-surface-stroke px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {isRoadmap ? (
                  <h1 className="sr-only">{currentSection.title}</h1>
                ) : (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {currentSection.eyebrow}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      {currentSection.title}
                    </h1>
                  </>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-surface-stroke bg-surface-panel text-muted-foreground shadow-soft"
                >
                  <Bell className="size-4" />
                </button>
                {appHeaderActions.map((item) => (
                  <HeaderActionLink
                    key={item.key}
                    item={item}
                    isActive={currentSection.key === item.key}
                  />
                ))}
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-control">
                  {userInitial}
                </div>
              </div>
            </div>
          </header>
        </section>

        <main
          key={pathname}
          className="mobile-sticky-bottom-spacing animate-slide-in-from-bottom"
        >
          {children}
        </main>
      </div>

      <MobileBottomNav activeKey={currentSection.key} />
    </div>
  );
}
