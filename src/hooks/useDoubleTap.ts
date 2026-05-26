import { useCallback, useEffect, useRef } from 'react';

type AnyEvent = React.MouseEvent | React.TouchEvent;

interface UseDoubleTapOptions {
  onDoubleTap: (coords: { x: number; y: number }) => void;
  onSingleTap?: (coords: { x: number; y: number }) => void;
  delay?: number;
}

export function useDoubleTap({
  onDoubleTap,
  onSingleTap,
  delay = 280,
}: UseDoubleTapOptions) {
  const lastTap = useRef<number>(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(
    () => () => {
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
    },
    [],
  );

  return useCallback(
    (e: AnyEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      let clientX = 0;
      let clientY = 0;

      if ('changedTouches' in e && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      const coords = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };

      const now = Date.now();
      const isDouble = now - lastTap.current < delay;

      // Reject double-tap if the two taps were far apart (likely two separate taps)
      if (isDouble && lastPos.current) {
        const dx = coords.x - lastPos.current.x;
        const dy = coords.y - lastPos.current.y;
        if (Math.hypot(dx, dy) > 60) {
          lastTap.current = now;
          lastPos.current = coords;
          return;
        }
      }

      if (isDouble) {
        e.preventDefault();
        if ('stopPropagation' in e) e.stopPropagation();

        if (singleTapTimer.current) {
          clearTimeout(singleTapTimer.current);
          singleTapTimer.current = null;
        }
        lastTap.current = 0;
        lastPos.current = null;
        onDoubleTap(coords);
        return;
      }

      lastTap.current = now;
      lastPos.current = coords;

      if (onSingleTap) {
        if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
        singleTapTimer.current = setTimeout(() => {
          singleTapTimer.current = null;
          onSingleTap(coords);
        }, delay);
      }
    },
    [onDoubleTap, onSingleTap, delay],
  );
}
