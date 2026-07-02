import { cn } from "@/shared/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={cn("animate-slide-in-from-bottom", className)}>
      {children}
    </div>
  )
}
