import { type HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface ImageFrameProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  caption?: string;
  rotation?: number;
}

const ImageFrame = forwardRef<HTMLDivElement, ImageFrameProps>(
  ({ className, src, alt, caption, rotation = 0, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'shadow-polaroid inline-block rounded-sm bg-white p-3 pb-10 transition-transform duration-300 hover:rotate-0',
          className,
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
        {...props}
      >
        <div className="bg-sand/20 relative aspect-square overflow-hidden rounded-sm">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          {children}
        </div>
        {caption && (
          <div className="font-handwritten text-text-h mt-3 truncate px-2 text-center text-lg">
            {caption}
          </div>
        )}
      </div>
    );
  },
);
ImageFrame.displayName = 'ImageFrame';

export { ImageFrame };
