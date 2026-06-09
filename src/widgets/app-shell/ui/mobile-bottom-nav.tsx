"use client";

import Link from "next/link";

import type { AppSectionKey } from "@/shared/config/navigation";
import { appPrimaryNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";

type MobileBottomNavProps = {
  activeKey: AppSectionKey;
};

export function MobileBottomNav({ activeKey }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-stroke bg-surface-panel/95 shadow-[0_-14px_32px_rgba(17,17,20,0.12)] backdrop-blur-xl lg:hidden"
    >
      <div
        className="mx-auto grid max-w-3xl gap-1 px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        style={{
          gridTemplateColumns: `repeat(${appPrimaryNavigation.length}, minmax(0, 1fr))`,
        }}
      >
        {appPrimaryNavigation.map((item) => {
          const isActive = item.key === activeKey;
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[var(--mobile-bottom-nav-height)] flex-col items-center justify-center gap-1 rounded-[1.15rem] px-1.5 py-2 text-[0.68rem] font-semibold text-muted-foreground transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
                isActive &&
                  "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(17,17,20,0.16)]",
              )}
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
