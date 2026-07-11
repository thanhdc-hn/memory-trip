import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';

import { useWheelRotation } from './use-wheel-rotation';

export interface RadialItem<T> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  swatch?: string;
}

export interface RadialWheelPickerProps<T> {
  items: RadialItem<T>[];
  value: T;
  onChange: (value: T) => void;
  onConfirm: (value: T) => void;
  onPreview?: (value: T) => void;
  className?: string;
  useUprightLabels?: boolean;
  reducedMotion?: boolean;
}

export function RadialWheelPicker<T>({
  items,
  value,
  onChange,
  onConfirm,
  onPreview,
  className,
  useUprightLabels = true,
  reducedMotion = false,
}: RadialWheelPickerProps<T>) {
  const initialIndex = useMemo(() => {
    const idx = items.findIndex((item) => item.id === value);
    return idx === -1 ? 0 : idx;
  }, [items, value]);

  const {
    rotation,
    activeIndex,
    isDragging,
    containerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    rotateToIndex,
  } = useWheelRotation({
    itemCount: items.length,
    initialIndex,
    onActiveIndexChange: (idx) => {
      const newValue = items[idx].id;
      onChange(newValue);
      onPreview?.(newValue);
    },
  });

  const angleStep = 360 / items.length;
  const radius = 110; // Slightly increased radius
  const transitionDuration = reducedMotion ? 'duration-150' : 'duration-500';
  const transitionTiming = 'ease-in-out';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rotateToIndex(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      rotateToIndex(activeIndex + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm(items[activeIndex].id);
    }
  };

  return (
    <div
      className={cn(
        'group relative flex aspect-square h-[280px] w-[280px] touch-none items-center justify-center outline-none select-none',
        className,
      )}
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listbox"
      aria-activedescendant={`wheel-item-${items[activeIndex].id}`}
      aria-label="Selection wheel"
    >
      {/* Indicator at 12 o'clock */}
      <div
        className="pointer-events-none absolute -top-5 left-1/2 z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="border-t-primary h-0 w-0 border-t-12 border-r-8 border-l-8 border-r-transparent border-l-transparent drop-shadow-sm" />
      </div>

      {/* Center content */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full px-4 text-center">
          <div className="text-text line-clamp-2 text-xl leading-tight font-bold drop-shadow-md">
            {items[activeIndex].label}
          </div>
        </div>
      </div>

      {/* The Wheel Container */}
      <div
        className={cn(
          'border-border/20 bg-secondary/5 relative aspect-square h-55 w-55 rounded-full border shadow-inner backdrop-blur-md transition-transform',
          isDragging ? 'duration-0' : transitionDuration,
          !isDragging && transitionTiming,
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {items.map((item, i) => {
          const itemAngle = i * angleStep;
          const isActive = activeIndex === i;
          const scale = isActive ? 1.25 : 0.9;
          const opacity = isActive ? 1 : 0.4;

          return (
            <div
              key={item.id as string}
              id={`wheel-item-${item.id}`}
              className={cn(
                'absolute top-1/2 left-1/2 transition-all',
                isDragging ? 'duration-0' : transitionDuration,
                !isDragging && transitionTiming,
                isActive ? 'z-20' : 'z-0',
              )}
              style={{
                transform: `translate(-50%, -50%) rotate(${itemAngle}deg) translateY(-${radius}px) ${useUprightLabels ? `rotate(${-itemAngle - rotation}deg)` : ''} scale(${scale})`,
                opacity,
              }}
            >
              <div
                className={cn(
                  'bg-card/90 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-2 ring-transparent transition-all',
                  isActive && 'ring-primary shadow-primary/30 shadow-xl',
                )}
              >
                {item.swatch ? (
                  <div
                    className="h-8 w-8 rounded-full border border-black/10"
                    style={{ backgroundColor: item.swatch }}
                  />
                ) : (
                  <span className="text-2xl" role="img" aria-label={item.label}>
                    {item.icon}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle outer glow for the active item area */}
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full blur-xl" />
    </div>
  );
}
