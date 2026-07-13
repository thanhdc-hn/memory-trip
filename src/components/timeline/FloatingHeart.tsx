import { Heart } from 'lucide-react';

import { useEffect } from 'react';

import { cn } from '@/lib/utils';

interface FloatingHeartProps {
  x: number;
  y: number;
  onComplete: () => void;
  className?: string;
  color?: string;
}

export function FloatingHeart({
  x,
  y,
  onComplete,
  className,
  color = '#FF4B4B',
}: FloatingHeartProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000); // Remove after animation ends (1s)
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={cn('pointer-events-none absolute z-50', className)}
      style={{
        left: x,
        top: y,
        animation: 'heart-fly 1s ease-out forwards',
        color: color,
      }}
    >
      <Heart className="h-[38.4px] w-[38.4px] fill-current" />
      <style>{`
        @keyframes heart-fly {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -150px) scale(1.5) rotate(15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
