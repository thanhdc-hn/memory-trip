import { useState, type FormEvent } from "react"
import { Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function AdminAuthModal({ onLogin }: { onLogin: (password: string) => Promise<boolean> }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password) return

    setIsSubmitting(true)
    setError(false)

    const success = await onLogin(password)
    if (!success) {
      setError(true)
      setIsSubmitting(false)
      // Reset shake after animation
      setTimeout(() => setError(false), 500)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className={cn(
        "w-full max-w-sm p-8 flex flex-col items-center gap-6 transition-all",
        error && "animate-shake"
      )}>
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
          <Shield className="w-8 h-8 text-primary"/>
        </div>

        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-gray-900">Admin Access</div>
          <p className="text-gray-500">Please enter your password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            autoFocus
          />
          <Button
            type="submit"
            className="w-full h-12 text-lg rounded-2xl"
            disabled={isSubmitting || !password}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Unlock Dashboard"}
          </Button>
        </form>

        {error && (
          <p className="text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
            Invalid credentials. Please try again.
          </p>
        )}
      </div>
    </div>
  )
}
