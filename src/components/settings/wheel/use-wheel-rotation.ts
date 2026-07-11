import { useEffect, useRef, useState } from 'react';

interface UseWheelRotationProps {
  itemCount: number;
  initialIndex: number;
  onActiveIndexChange?: (index: number) => void;
}

export function useWheelRotation({
  itemCount,
  initialIndex,
  onActiveIndexChange,
}: UseWheelRotationProps) {
  const angleStep = 360 / itemCount;
  const [rotation, setRotation] = useState(-initialIndex * angleStep);
  const [isDragging, setIsDragging] = useState(false);
  const startAngleRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    // atan2 returns angle in radians, convert to degrees
    // Subtract 90 degrees so that 12 o'clock is 0 degrees
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    return angle;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startAngleRef.current = getAngle(e.clientX, e.clientY);
    startRotationRef.current = rotation;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentAngle = getAngle(e.clientX, e.clientY);
    const delta = currentAngle - startAngleRef.current;

    // Smoothly update rotation without snapping during drag
    setRotation(startRotationRef.current + delta);
  };

  const onPointerUp = () => {
    setIsDragging(false);
    // Snap to nearest index
    const nearestIndex = Math.round(-rotation / angleStep);
    setRotation(-nearestIndex * angleStep);
  };

  // Normalize activeIndex to be within [0, itemCount - 1]
  const activeIndex =
    ((Math.round(-rotation / angleStep) % itemCount) + itemCount) % itemCount;

  useEffect(() => {
    onActiveIndexChange?.(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  const rotateToIndex = (index: number) => {
    setRotation(-index * angleStep);
  };

  return {
    rotation,
    activeIndex,
    isDragging,
    containerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    rotateToIndex,
    angleStep,
  };
}
