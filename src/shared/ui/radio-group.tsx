import * as React from "react";

import { cn } from "@/shared/lib/utils";

export type RadioGroupOption = {
  value: string;
  label: string;
  helperText?: string;
};

export type RadioGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  options: RadioGroupOption[];
  value: string | null;
  onChange: (value: string) => void;
  ariaLabel?: string;
};

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, options, value, onChange, ariaLabel, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              data-state={isSelected ? "checked" : "unchecked"}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-[0.875rem] border px-4 py-3 text-left text-sm font-medium transition-all duration-[var(--motion-duration-fast)] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-module-lavender/50",
                isSelected
                  ? "border-transparent bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(17,17,20,0.18)]"
                  : "border-surface-stroke-strong bg-surface-panel text-foreground hover:border-surface-stroke hover:bg-surface-panel-strong"
              )}
            >
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
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-primary-foreground"
                    : "border-surface-stroke-strong"
                )}
              >
                {isSelected ? (
                  <span className="size-2 rounded-full bg-primary-foreground" />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
