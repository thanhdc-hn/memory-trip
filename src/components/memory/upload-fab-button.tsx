import { Hourglass, Plus } from 'lucide-react';

import { type ButtonHTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadFabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  loading?: boolean;
}

export function UploadFabButton({
  label = 'Post Memory',
  className,
  loading,
  ...props
}: UploadFabButtonProps) {
  return (
    <div className="animate-bounce-slow hover:pause fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <Button
        disabled={loading}
        variant="sticker"
        size="sticker"
        className={cn(
          'flex h-16 items-center gap-2 rounded-full px-8',
          className,
        )}
        {...props}
      >
        {loading ? (
          <Hourglass className="animate-spin-slow h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6 stroke-[3px]" />
        )}
        <span className="mt-1">{label}</span>
      </Button>
    </div>
  );
}
