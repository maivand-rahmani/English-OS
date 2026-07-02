import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[0.875rem] border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:-translate-y-0.5 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(17,17,20,0.18)] hover:bg-primary/90 hover:shadow-[0_14px_30px_rgba(17,17,20,0.22)]",
        outline:
          "border-surface-stroke-strong bg-surface-panel text-foreground hover:bg-surface-panel-strong hover:border-surface-stroke",
        secondary:
          "bg-surface-module-lavender text-foreground hover:bg-surface-module-lavender/80",
        ghost: "hover:bg-surface-panel hover:text-foreground",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[0.625rem] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[0.75rem] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon:
          "size-8 bg-surface-dark-control text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-surface-dark-control/90 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-[var(--motion-duration-fast)] ease-out",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] bg-surface-dark-control text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-surface-dark-control/90 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-[var(--motion-duration-fast)] ease-out in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] bg-surface-dark-control text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-surface-dark-control/90 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-[var(--motion-duration-fast)] ease-out in-data-[slot=button-group]:rounded-lg",
        "icon-lg":
          "size-9 bg-surface-dark-control text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-surface-dark-control/90 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-[var(--motion-duration-fast)] ease-out",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
