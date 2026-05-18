import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Float({ children, className, delay = 0 }: {
  children: ReactNode,
  className?: string,
  delay?: number
}) {
  return (
    <div
      className={cn("animate-float", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

export function Pop({ children, className, trigger = true }: {
  children: ReactNode,
  className?: string,
  trigger?: boolean
}) {
  return (
    <div className={cn(trigger && "animate-pop", className)}>
      {children}
    </div>
  )
}

export function Tape({ className, rotation = -5 }: { className?: string, rotation?: number }) {
  return (
    <div
      className={cn(
        "absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-[2px] border border-white/20 shadow-sm z-10",
        className
      )}
      style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
    />
  )
}
