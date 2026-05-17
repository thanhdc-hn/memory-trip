import * as React from "react"
import { Heart } from "lucide-react"
import { ImageFrame } from "@/components/ui/image-frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MemoryPostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string
  title: string
  author: string
  authorAvatar?: string
  date: string
  likes?: number
  comments?: number
  tags?: string[]
  rotation?: number
}

export const MemoryPostCard = React.forwardRef<HTMLDivElement, MemoryPostCardProps>(
  ({
     imageUrl,
     title,
     author,
     authorAvatar,
     date,
     likes = 0,
     comments = 0,
     tags = [],
     rotation = 0,
     className,
     ...props
   }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3 group", className)}
        {...props}
      >
        <ImageFrame
          src={imageUrl}
          caption={title}
          rotation={rotation}
          className="w-full"
        >
          <div className="absolute top-2 left-2">
            <Badge variant="nickname" className="bg-white/80 backdrop-blur-sm border-none shadow-sm">
              {author}
            </Badge>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Heart className="h-4 w-4"/>
            </Button>
          </div>
        </ImageFrame>

        <div className="flex items-center justify-between px-2">
          <div className="flex gap-1">
            {tags.map(tag => (
              <Badge key={tag} variant="tag">#{tag}</Badge>
            ))}
          </div>
          <span className="text-xs text-text/50 font-rounded">{date}</span>
        </div>
      </div>
    )
  }
)
MemoryPostCard.displayName = "MemoryPostCard"
