import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[0.875rem] border border-surface-stroke bg-surface-panel px-4 py-2.5 text-sm transition-all duration-200 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-surface-stroke-strong focus-visible:outline-none focus-visible:border-surface-stroke-strong focus-visible:ring-2 focus-visible:ring-surface-module-lavender/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface SearchInputProps extends InputProps {
  iconClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, iconClassName, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", iconClassName)} />
        <Input
          className={cn("pl-10", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { Input, SearchInput }
