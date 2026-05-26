import { useEffect, useState } from 'react';

interface InstagramHeartOverlayProps {
  /** Increment to trigger a new heart pop. */
  trigger: number;
}

const ANIMATION_DURATION = 900;

export function InstagramHeartOverlay({ trigger }: InstagramHeartOverlayProps) {
  const [activeKey, setActiveKey] = useState<number | null>(null);

  useEffect(() => {
    if (trigger === 0) return;
    setActiveKey(trigger);
    const t = setTimeout(() => setActiveKey(null), ANIMATION_DURATION + 50);
    return () => clearTimeout(t);
  }, [trigger]);

  if (activeKey === null) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
      <div key={activeKey} className="ig-heart-pop">
        <svg
          viewBox="0 0 120 120"
          className="h-32 w-32 md:h-40 md:w-40"
          style={{
            filter:
              'drop-shadow(0 10px 18px rgba(255, 127, 80, 0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
          }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="ig-heart-grad"
              x1="0.25"
              y1="0"
              x2="0.75"
              y2="1"
            >
              <stop offset="0%" stopColor="#FFC2B0" />
              <stop offset="55%" stopColor="#FF8265" />
              <stop offset="100%" stopColor="#E85A45" />
            </linearGradient>
            <radialGradient id="ig-heart-gloss" cx="0.35" cy="0.3" r="0.4">
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
            fill="url(#ig-heart-grad)"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Soft glossy highlight for the dreamy scrapbook feel */}
          <ellipse
            cx="44"
            cy="38"
            rx="16"
            ry="10"
            fill="url(#ig-heart-gloss)"
            transform="rotate(-22 44 38)"
          />
        </svg>
      </div>

      <style>{`
        @keyframes ig-heart-pop {
          0%   { transform: scale(0.2) rotate(-6deg); opacity: 0; }
          18%  { transform: scale(1.18) rotate(2deg); opacity: 1; }
          34%  { transform: scale(0.96) rotate(-1deg); opacity: 1; }
          50%  { transform: scale(1.02) rotate(0deg);  opacity: 1; }
          70%  { transform: scale(1) rotate(0deg);     opacity: 1; }
          100% { transform: scale(1.08) rotate(0deg);  opacity: 0; }
        }
        .ig-heart-pop {
          will-change: transform, opacity;
          animation: ig-heart-pop ${ANIMATION_DURATION}ms cubic-bezier(0.34, 1.4, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
}
