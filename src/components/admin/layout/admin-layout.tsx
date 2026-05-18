import { type ReactNode } from "react"
import { ArrowLeft, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminHeader({ title, onBack, onLogout }: {
  title: string,
  onBack?: () => void,
  onLogout?: () => void
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          {onBack ? (
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="w-5 h-5"/>
            </Button>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary"/>
            </div>
          )}
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</div>
        </div>
        {onLogout && (
          <Button variant="ghost" size="icon" onClick={onLogout}
                  className="text-gray-500 hover:text-red-500 rounded-full">
            <LogOut className="w-5 h-5"/>
          </Button>
        )}
      </div>
    </header>
  )
}

export function AdminLayout({ children, header }: { children: ReactNode, header?: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center selection:bg-primary/20">
      <div className="w-full max-w-3xl min-h-screen bg-white shadow-sm flex flex-col">
        {header}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
        <div className="h-24" aria-hidden="true"/>
        {/* Bottom Safe Space */}
      </div>
    </div>
  )
}
