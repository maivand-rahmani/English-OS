"use client";

import type { AppSection } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";

type MobileSectionLanesProps = {
  section: AppSection;
};

export function MobileSectionLanes({ section }: MobileSectionLanesProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {section.sidebarTitle}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {section.sidebarDescription}
          </p>
        </div>
      </div>

      <div
        aria-label={`${section.title} lanes`}
        className="mobile-chip-row mt-4"
        role="list"
      >
        {section.sidebarItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={cn(
                "mobile-chip inline-flex min-w-fit items-center gap-2 rounded-full border border-surface-stroke bg-surface-panel px-3 py-2 text-sm font-medium text-muted-foreground shadow-soft",
                index === 0 &&
                  "border-transparent bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(17,17,20,0.16)]",
              )}
              role="listitem"
            >
              {Icon ? <Icon className="size-3.5" /> : null}
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
