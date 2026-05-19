import { type HTMLAttributes, type ImgHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-sand/20 relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm',
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<
  HTMLImageElement,
  ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    alt="Avatar"
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-peach/30 text-coral flex h-full w-full items-center justify-center rounded-full font-bold',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
