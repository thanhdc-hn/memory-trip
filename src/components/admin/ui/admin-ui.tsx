import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function StatBadge({ label, value, color = "primary" }: {
  label: string,
  value: string | number,
  color?: "primary" | "success" | "warning" | "destructive"
}) {
  const colorClasses = {
    primary: "bg-blue-50 text-blue-700 border-blue-100",
    success: "bg-green-50 text-green-700 border-green-100",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-100",
    destructive: "bg-red-50 text-red-700 border-red-100",
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", colorClasses[color])}>
      <span className="opacity-70">{label}:</span>
      <span>{value}</span>
    </div>
  )
}

export function EmptyState({ title, description, icon: Icon, action }: {
  title: string,
  description: string,
  icon?: any,
  action?: ReactNode
}) {
  return (
    <div
      className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-2xl border-gray-100 bg-gray-50/50">
      {Icon && <Icon className="w-12 h-12 text-gray-300 mb-4"/>}
      <div className="text-lg font-semibold text-gray-900">{title}</div>
      <p className="text-sm text-gray-500 mt-1 max-w-[250px]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-100 rounded-lg", className)}/>
  )
}
