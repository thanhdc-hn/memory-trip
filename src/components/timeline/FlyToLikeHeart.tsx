import { useEffect, useState } from 'react';

interface FlyItem {
  id: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
  delay: number;
  scale: number;
}

interface FlyToLikeHeartProps {
  trigger: number;
  from: { x: number; y: number } | null;
  to: { x: number; y: number } | null;
}

const FLY_DURATION_MS = 1000;

export function FlyToLikeHeart({ trigger, from, to }: FlyToLikeHeartProps) {
  const [items, setItems] = useState<FlyItem[]>([]);

  useEffect(() => {
    if (trigger === 0 || !from || !to) return;

    const delay = Math.random() * 0.1;
    const item: FlyItem = {
      id: trigger,
      x: from.x,
      y: from.y,
      moveX: to.x - from.x,
      moveY: to.y - from.y,
      delay,
      scale: 0.9 + Math.random() * 0.2,
    };

    setItems((prev) => [...prev, item]);

    const timeout = setTimeout(
      () => setItems((prev) => prev.filter((it) => it.id !== item.id)),
      FLY_DURATION_MS + 200 + delay * 1000,
    );

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="mt-fly-like"
          style={{
            position: 'absolute',
            left: `${item.x}px`,
            top: `${item.y}px`,
            ['--mt-mx' as string]: `${item.moveX}px`,
            ['--mt-my' as string]: `${item.moveY}px`,
            ['--mt-scale' as string]: `${item.scale}`,
            animationDelay: `${item.delay}s`,
            willChange: 'transform, opacity',
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 120 120"
            className="h-20 w-20 md:h-24 md:w-24"
            style={{
              filter:
                'drop-shadow(0 10px 18px rgba(255, 127, 80, 0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
            }}
          >
            <defs>
              <linearGradient id="fly-heart-grad" x1="0.25" y1="0" x2="0.75" y2="1">
                <stop offset="0%" stopColor="#FFC2B0" />
                <stop offset="55%" stopColor="#FF8265" />
                <stop offset="100%" stopColor="#E85A45" />
              </linearGradient>
              <radialGradient id="fly-heart-gloss" cx="0.35" cy="0.3" r="0.4">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            <path
              d="M60 104
                 C 60 104, 14 76, 14 44
                 C 14 24, 30 14, 44 14
                 C 53 14, 58 19, 60 25
                 C 62 19, 67 14, 76 14
                 C 90 14, 106 24, 106 44
                 C 106 76, 60 104, 60 104 Z"
              fill="url(#fly-heart-grad)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            <ellipse
              cx="44"
              cy="38"
              rx="16"
              ry="10"
              fill="url(#fly-heart-gloss)"
              transform="rotate(-22 44 38)"
            />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes mt-fly-like {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(calc(var(--mt-scale, 1) * 0.4)) rotate(-10deg);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(-26px) scale(calc(var(--mt-scale, 1) * 1.35)) rotate(8deg);
          }
          22% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(var(--mt-scale, 1)) rotate(0deg);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(var(--mt-mx, 0px), var(--mt-my, 0px)) scale(calc(var(--mt-scale, 1) * 0.5));
          }
          90% {
            opacity: 0.6;
            transform: translate(-50%, -50%) translate(var(--mt-mx, 0px), var(--mt-my, 0px)) scale(calc(var(--mt-scale, 1) * 0.25));
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--mt-mx, 0px), var(--mt-my, 0px)) scale(calc(var(--mt-scale, 1) * 0.08));
          }
        }
        .mt-fly-like {
          animation: mt-fly-like ${FLY_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}
