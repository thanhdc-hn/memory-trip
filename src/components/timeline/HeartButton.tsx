import { Heart } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface HeartButtonProps {
  hasHearted: boolean;
  heartCount: number;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export function HeartButton({
  hasHearted,
  heartCount,
  onClick,
  className,
}: HeartButtonProps) {
  const [bounceKey, setBounceKey] = useState(0);
  const prev = useRef(hasHearted);

  useEffect(() => {
    if (prev.current !== hasHearted) {
      setBounceKey((k) => k + 1);
      prev.current = hasHearted;
    }
  }, [hasHearted]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={cn(
        'group flex items-center gap-1.5 rounded-full px-3 py-1.5',
        'bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white',
        'transition-colors duration-300 active:scale-95',
        className,
      )}
    >
      <span
        key={bounceKey}
        className={cn('inline-flex', bounceKey > 0 && 'mt-btn-bounce')}
        style={{ willChange: 'transform' }}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors duration-300 ease-out',
            hasHearted
              ? 'fill-rose-500 stroke-rose-500'
              : 'stroke-text/40 fill-transparent group-hover:stroke-rose-400',
          )}
        />
      </span>
      {heartCount > 0 && (
        <span
          className={cn(
            'font-rounded text-sm font-bold transition-colors duration-300',
            hasHearted ? 'text-rose-600' : 'text-text/60',
          )}
        >
          {heartCount}
        </span>
      )}
      <style>{`
        @keyframes mt-btn-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.22); }
          55%  { transform: scale(0.92); }
          80%  { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .mt-btn-bounce {
          animation: mt-btn-bounce 480ms cubic-bezier(0.34, 1.4, 0.5, 1);
        }
      `}</style>
    </button>
  );
}
