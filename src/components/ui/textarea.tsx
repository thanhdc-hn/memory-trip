import { type TextareaHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'border-border ring-offset-surface placeholder:text-text/40 focus-visible:ring-primary font-handwritten flex min-h-[120px] w-full rounded-2xl border-2 bg-white px-4 py-3 text-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
