import { type HTMLAttributes, forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface ImageFrameProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  caption?: string;
  rotation?: number;
}

const ImageFrame = forwardRef<HTMLDivElement, ImageFrameProps>(
  ({ className, src, alt, caption, rotation = 0, children, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div
        ref={ref}
        className={cn(
          'shadow-polaroid bg-paper inline-block rounded-sm p-3 pb-10 transition-transform duration-300 hover:rotate-0',
          className,
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
        {...props}
      >
        <div className="bg-sand/20 relative aspect-square overflow-hidden rounded-sm">
          {!loaded && (
            <div className="bg-sand/20 absolute inset-0 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            ref={(node) => {
              if (node?.complete) setLoaded(true);
            }}
            onLoad={() => setLoaded(true)}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-500',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
          />
          {children}
        </div>
        {caption && (
          <div className="font-handwritten text-paper-text mt-3 px-2 text-center text-lg">
            {caption}
          </div>
        )}
      </div>
    );
  },
);
ImageFrame.displayName = 'ImageFrame';

export { ImageFrame };
