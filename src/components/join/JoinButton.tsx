import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function JoinButton({
  onClick,
  loading,
  disabled,
}: {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="sticker"
      size="lg"
      className={cn(
        'group w-full rounded-2xl py-6 text-[16px] transition-all sm:text-2xl',
        loading && 'pointer-events-none opacity-80',
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className="flex items-center gap-2">
        {loading ? (
          'JOINING...'
        ) : (
          <>
            JOIN MEMORY SPACE
            <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          </>
        )}
      </span>
    </Button>
  );
}
