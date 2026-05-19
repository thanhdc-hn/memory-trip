import { type HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Divider = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { variant?: 'solid' | 'dashed' }
>(({ className, variant = 'solid', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-border h-[2px] w-full shrink-0',
      variant === 'dashed' &&
        'border-border border-t-2 border-dashed bg-transparent',
      className,
    )}
    {...props}
  />
));
Divider.displayName = 'Divider';

export { Divider };
