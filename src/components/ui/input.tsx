import { Eye, EyeOff } from 'lucide-react';

import { type InputHTMLAttributes, forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  const inputElement = (
    <input
      type={resolvedType}
      className={cn(
        'border-border ring-offset-surface placeholder:text-text/40 focus-visible:ring-primary font-rounded flex h-11 w-full rounded-2xl border-2 bg-white px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        // Leave room for the toggle button so text doesn't overlap it.
        isPassword && 'pr-11',
        className,
      )}
      ref={ref}
      {...props}
    />
  );

  if (!isPassword) return inputElement;

  return (
    <div className="relative w-full">
      {inputElement}
      <button
        type="button"
        // Keep the field from blurring/submitting when toggling.
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={props.disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-pressed={showPassword}
        tabIndex={-1}
        className="text-text/40 hover:text-text/70 focus-visible:ring-primary absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
