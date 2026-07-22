import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

interface NebulaCloud {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  phase: number;
  phaseSpeed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  flickerPhase: number;
  flickerSpeed: number;
}

/**
 * NebulaCanvas renders a deep-space nebula effect.
 * It uses overlapping radial gradients for clouds and small dots for stars.
 */
export function NebulaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<NebulaCloud[]>([]);
  const starsRef = useRef<Star[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    const COLORS = [
      { r: 88, g: 28, b: 135, a: 0.2 }, // Deep Purple
      { r: 30, g: 58, b: 138, a: 0.15 }, // Deep Blue
      { r: 131, g: 24, b: 67, a: 0.12 }, // Deep Pink
      { r: 76, g: 29, b: 149, a: 0.15 }, // Indigo
    ];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Create nebula clouds
      const cloudCount = 8;
      cloudsRef.current = Array.from({ length: cloudCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.max(width, height) * (0.2 + Math.random() * 0.3),
        color: COLORS[Math.floor(Math.random() * COLORS.length)] as any,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.0004 + Math.random() * 0.0008,
      }));

      // Create stars
      const starCount = Math.floor((width * height) / 12000);
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.4 + Math.random() * 1.2,
        opacity: 0.2 + Math.random() * 0.7,
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: 0.01 + Math.random() * 0.02,
      }));
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Background tint (semi-transparent overlay)
      ctx.fillStyle = 'rgba(2, 2, 5, 0.45)';
      ctx.fillRect(0, 0, width, height);

      // Clouds
      ctx.globalCompositeOperation = 'screen';
      cloudsRef.current.forEach((cloud: any) => {
        if (!reducedMotion) {
          cloud.x += cloud.vx;
          cloud.y += cloud.vy;
          cloud.phase += cloud.phaseSpeed;

          // Wrap around with margin
          const margin = cloud.radius;
          if (cloud.x < -margin) cloud.x = width + margin;
          if (cloud.x > width + margin) cloud.x = -margin;
          if (cloud.y < -margin) cloud.y = height + margin;
          if (cloud.y > height + margin) cloud.y = -margin;
        }

        const pulse = 1 + Math.sin(cloud.phase) * 0.1;
        const currentRadius = cloud.radius * pulse;

        const grad = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          currentRadius,
        );
        const { r, g, b, a } = cloud.color;
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a * 0.4})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // Stars
      ctx.globalCompositeOperation = 'source-over';
      starsRef.current.forEach((star) => {
        const flicker = reducedMotion
          ? 1
          : 0.7 + Math.sin(time * star.flickerSpeed + star.flickerPhase) * 0.3;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * flicker})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // In reduced motion, we only render once or on resize
      }
    };

    init();
    window.addEventListener('resize', init);

    if (reducedMotion) {
      render(0);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', init);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
