import * as React from "react";

import { cn } from "@/shared/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> & {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, options, value, onChange, placeholder, ariaLabel, ...props },
    ref
  ) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className={cn(
          "flex h-10 w-full appearance-none rounded-[0.875rem] border border-surface-stroke bg-surface-panel px-4 py-2.5 text-sm transition-all duration-[var(--motion-duration-fast)] ease-out hover:border-surface-stroke-strong focus-visible:outline-none focus-visible:border-surface-stroke-strong focus-visible:ring-2 focus-visible:ring-surface-module-lavender/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
