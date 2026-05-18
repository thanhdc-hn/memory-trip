import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const Divider = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { variant?: 'solid' | 'dashed' }
>(({ className, variant = 'solid', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "shrink-0 bg-border h-[2px] w-full",
      variant === 'dashed' && "bg-transparent border-t-2 border-dashed border-border",
      className
    )}
    {...props}
  />
))
Divider.displayName = "Divider"

export { Divider }
