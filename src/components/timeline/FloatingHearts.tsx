import { useEffect, useState } from 'react';

interface FloatingItem {
  id: number;
  /** Horizontal offset (px) from the spawn origin. */
  x: number;
  /** Slight initial rotation. */
  rotation: number;
  /** Start scale. */
  scale: number;
  /** Stagger delay in seconds. */
  delay: number;
  /** Total animation length in seconds. */
  duration: number;
  /** Final vertical travel distance (negative = upward). */
  rise: number;
  /** Final horizontal drift (slight sway). */
  sway: number;
  /** True when this is the sad/broken-heart micro animation. */
  isSad?: boolean;
}

interface FloatingHeartsProps {
  /** Increment to trigger a new burst. */
  trigger: number;
  /** Show the broken-heart micro animation instead of rising hearts. */
  isSad?: boolean;
  /** Spawn origin within the parent (px), defaults to bottom-center. */
  x?: number;
  y?: number;
  /** Whether the burst originated from a double-tap (slightly bigger spread). */
  isDoubleInteraction?: boolean;
}

const RISE_DURATION_MS = 2000;
const SAD_DURATION_MS = 1100;

export function FloatingHearts({
  trigger,
  isSad,
  x,
  y,
  isDoubleInteraction,
}: FloatingHeartsProps) {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    let burst: FloatingItem[] = [];

    if (isSad) {
      // Single subtle broken-heart micro animation
      burst.push({
        id: trigger,
        x: 0,
        rotation: 0,
        scale: 0.8,
        delay: 0,
        duration: SAD_DURATION_MS / 1000,
        rise: 0,
        sway: 0,
        isSad: true,
      });
    } else {
      const count = 3 + Math.floor(Math.random() * 3); // 3-5 hearts
      const spreadX = isDoubleInteraction ? 60 : 44;
      burst = Array.from({ length: count }).map((_, i) => ({
        id: trigger * 100 + i,
        x: (Math.random() - 0.5) * spreadX,
        rotation: (Math.random() - 0.5) * 28,
        scale: 0.55 + Math.random() * 0.35,
        delay: 0.06 + i * 0.07,
        duration: 1.6 + Math.random() * 0.5,
        rise: -120 - Math.random() * 70,
        sway: (Math.random() - 0.5) * 30,
      }));
    }

    setItems((prev) => [...prev, ...burst]);

    const cleanupAfter = isSad ? SAD_DURATION_MS + 200 : RISE_DURATION_MS + 600;
    const ids = new Set(burst.map((b) => b.id));
    const timeout = setTimeout(() => {
      setItems((prev) => prev.filter((h) => !ids.has(h.id)));
    }, cleanupAfter);

    return () => clearTimeout(timeout);
  }, [trigger, isSad, isDoubleInteraction]);

  const originLeft = x !== undefined ? `${x}px` : '50%';
  const originTop = y !== undefined ? `${y}px` : '85%';

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className={item.isSad ? 'mt-heart-sad' : 'mt-heart-rise'}
          style={{
            position: 'absolute',
            left: item.isSad ? '50%' : originLeft,
            top: item.isSad ? '50%' : originTop,
            // GPU-friendly: only transform/opacity animated
            ['--mt-x' as string]: `${item.x}px`,
            ['--mt-rise' as string]: `${item.rise}px`,
            ['--mt-sway' as string]: `${item.sway}px`,
            ['--mt-rot' as string]: `${item.rotation}deg`,
            ['--mt-scale' as string]: `${item.scale}`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            willChange: 'transform, opacity',
          }}
          aria-hidden="true"
        >
          {item.isSad ? (
            <span
              className="block text-2xl select-none md:text-3xl"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))',
              }}
            >
              💔
            </span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 md:h-7 md:w-7"
              style={{
                filter:
                  'drop-shadow(0 3px 6px rgba(255, 127, 80, 0.35)) drop-shadow(0 1px 1px rgba(0,0,0,0.06))',
              }}
            >
              <path
                d="M12 21s-7-4.5-7-10.5C5 7 7.5 5 10 5c1.5 0 2.5 0.8 2 2.2C12.5 5.8 13.5 5 15 5c2.5 0 4.5 2 4.5 5.5C19 16.5 12 21 12 21z"
                fill="#FF7F50"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      ))}

      <style>{`
        @keyframes mt-heart-rise {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0);
            opacity: 0;
          }
          15% {
            transform: translate(-50%, -50%) scale(var(--mt-scale, 0.8)) rotate(var(--mt-rot, 0));
            opacity: 1;
          }
          70% {
            opacity: 0.9;
          }
          100% {
            transform:
              translate(-50%, -50%)
              translate(calc(var(--mt-x, 0px) + var(--mt-sway, 0px)), var(--mt-rise, -150px))
              scale(calc(var(--mt-scale, 0.8) * 1.25))
              rotate(var(--mt-rot, 0));
            opacity: 0;
          }
        }

        @keyframes mt-heart-sad {
          0% {
            transform: translate(-50%, -50%) scale(0.4) rotate(0);
            opacity: 0;
          }
          25% {
            transform: translate(-50%, -50%) scale(1.05) rotate(-6deg);
            opacity: 1;
          }
          45% {
            transform: translate(-50%, -50%) scale(1) rotate(5deg);
            opacity: 1;
          }
          65% {
            transform: translate(-50%, -50%) scale(1) rotate(-3deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(14px) scale(0.85) rotate(0);
            opacity: 0;
          }
        }

        .mt-heart-rise {
          animation-name: mt-heart-rise;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mt-heart-sad {
          animation-name: mt-heart-sad;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.34, 1.2, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
