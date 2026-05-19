import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-coral text-white hover:bg-coral/90 shadow-md',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
        sticker:
          'bg-primary text-white border-4 border-white font-handwritten text-xl shadow-sticker hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none',
        secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-md',
        outline: 'border-2 border-border bg-white hover:bg-sand/20 text-text',
        ghost: 'hover:bg-sand/20 text-text',
        link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-accent text-text hover:bg-accent/90 shadow-md',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
        sticker: 'px-8 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
