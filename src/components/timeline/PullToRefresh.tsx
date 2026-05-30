import { RefreshCw } from 'lucide-react';

import { type ReactNode, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
}

const THRESHOLD = 70;
const MAX_PULL = 110;

export function PullToRefresh({
  onRefresh,
  children,
  className,
}: PullToRefreshProps) {
  const startY = useRef(0);
  const pulling = useRef(false);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !refreshing) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling.current) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) {
      setDistance(0);
      return;
    }
    setDistance(Math.min(delta * 0.5, MAX_PULL));
  };

  const handleTouchEnd = async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (distance >= THRESHOLD) {
      setRefreshing(true);
      setDistance(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setDistance(0);
  };

  const active = distance >= THRESHOLD;

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: distance }}
      >
        <RefreshCw
          className={cn(
            'text-primary h-6 w-6',
            refreshing && 'animate-spin',
            !refreshing && active && 'rotate-180',
            'transition-transform duration-200',
          )}
          style={
            !refreshing
              ? { opacity: Math.min(distance / THRESHOLD, 1) }
              : undefined
          }
        />
      </div>
      {children}
    </div>
  );
}
