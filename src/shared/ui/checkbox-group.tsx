import * as React from "react";

import { cn } from "@/shared/lib/utils";

export type CheckboxGroupOption = {
  value: string;
  label: string;
  helperText?: string;
};

export type CheckboxGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  options: CheckboxGroupOption[];
  value: string[];
  onChange: (value: string[]) => void;
  ariaLabel?: string;
  orientation?: "vertical" | "horizontal";
};

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      ariaLabel,
      orientation = "vertical",
      ...props
    },
    ref
  ) => {
    const selected = React.useMemo(() => new Set(value), [value]);

    const toggle = React.useCallback(
      (optionValue: string) => {
        const next = new Set(selected);
        if (next.has(optionValue)) {
          next.delete(optionValue);
        } else {
          next.add(optionValue);
        }
        onChange(Array.from(next));
      },
      [onChange, selected]
    );

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex w-full gap-2",
          orientation === "horizontal"
            ? "flex-row flex-wrap"
            : "flex-col",
          className
        )}
        {...props}
      >
        {options.map((option) => {
          const isSelected = selected.has(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              data-state={isSelected ? "checked" : "unchecked"}
              onClick={() => toggle(option.value)}
              className={cn(
                "flex items-center gap-3 rounded-[0.875rem] border px-4 py-3 text-left text-sm font-medium transition-all duration-[var(--motion-duration-fast)] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-module-lavender/50",
                isSelected
                  ? "border-transparent bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(17,17,20,0.18)]"
                  : "border-surface-stroke-strong bg-surface-panel text-foreground hover:border-surface-stroke hover:bg-surface-panel-strong"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                  isSelected
                    ? "border-primary-foreground bg-primary-foreground/15"
                    : "border-surface-stroke-strong bg-surface-panel"
                )}
              >
                {isSelected ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-3 text-primary-foreground"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="5 10.5 8.5 14 15 6.5" />
                  </svg>
                ) : null}
              </span>
              <span className="flex flex-col gap-0.5">
                <span>{option.label}</span>
                {option.helperText ? (
                  <span
                    className={cn(
                      "text-xs font-normal",
                      isSelected
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {option.helperText}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };
