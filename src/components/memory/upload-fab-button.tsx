import { type ButtonHTMLAttributes } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadFabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export function UploadFabButton({ label = "Post Memory", className, ...props }: UploadFabButtonProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-slow hover:pause">
      <Button
        variant="sticker"
        size="sticker"
        className={cn("rounded-full h-16 px-8 flex gap-2 items-center", className)}
        {...props}
      >
        <Plus className="h-6 w-6 stroke-[3px]"/>
        <span className="mt-1">{label}</span>
      </Button>
    </div>
  )
}
