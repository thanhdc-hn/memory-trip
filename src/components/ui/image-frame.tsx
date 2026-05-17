import * as React from "react"
import { cn } from "@/lib/utils"

interface ImageFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  alt?: string
  caption?: string
  rotation?: number
}

const ImageFrame = React.forwardRef<HTMLDivElement, ImageFrameProps>(
  ({ className, src, alt, caption, rotation = 0, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white p-3 pb-10 shadow-polaroid rounded-sm inline-block transition-transform duration-300 hover:rotate-0",
          className
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
        {...props}
      >
        <div className="aspect-square bg-sand/20 overflow-hidden rounded-sm relative">
          <img
            src={src}
            alt={alt}
            className="object-cover w-full h-full"
          />
          {children}
        </div>
        {caption && (
          <div className="mt-3 font-handwritten text-center text-text-h text-lg truncate px-2">
            {caption}
          </div>
        )}
      </div>
    )
  }
)
ImageFrame.displayName = "ImageFrame"

export { ImageFrame }
