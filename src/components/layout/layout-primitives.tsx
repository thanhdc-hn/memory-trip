import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function AppLayout({ children, header, footer }: {
  children: ReactNode,
  header?: ReactNode,
  footer?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30 flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 py-8 md:py-12 flex flex-col gap-12">
        {header}
        <main className="flex-1">
          {children}
        </main>
        {footer}
      </div>
    </div>
  )
}

export function MasonryGrid({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12", className)}>
      {children}
    </div>
  )
}

export function CenteredContent({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center gap-6", className)}>
      {children}
    </div>
  )
}
