"use client";

import { Drawer } from "@base-ui/react/drawer";
import { X } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { buttonVariants } from "./button";

type MobileSheetProps = {
  children: React.ReactNode;
  className?: string;
  description?: string;
  footer?: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function MobileSheet({
  children,
  className,
  description,
  footer,
  onOpenChange,
  open,
  title,
}: MobileSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="down">
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Drawer.Popup className="fixed inset-x-0 bottom-0 z-[60] flex justify-center outline-none">
          <Drawer.Content
            className={cn(
              "w-full max-w-3xl rounded-t-[1.9rem] border border-surface-stroke bg-surface-panel-strong px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-18px_60px_rgba(17,17,20,0.22)] outline-none sm:px-5",
              className,
            )}
          >
            <div className="mx-auto h-1.5 w-14 rounded-full bg-black/12 dark:bg-white/12" />

            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Drawer.Title className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </Drawer.Title>
                {description ? (
                  <Drawer.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </Drawer.Description>
                ) : null}
              </div>

              <Drawer.Close
                aria-label="Close sheet"
                className={cn(buttonVariants({ size: "icon-sm", variant: "outline" }))}
              >
                <X className="size-4" />
              </Drawer.Close>
            </div>

            <div className="mobile-card-rhythm mt-5 max-h-[70vh] overflow-y-auto pr-1">
              {children}
            </div>

            {footer ? (
              <div className="mt-5 border-t border-surface-stroke pt-4">{footer}</div>
            ) : null}
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
