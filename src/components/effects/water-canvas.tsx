import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

/** Cap DPR so high-density-display phones don't pay for huge canvases. */
const MAX_DPR = 2;

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

interface Caustic {
  x: number;
  y: number;
  size: number;
  opacity: number;
  angle: number;
  speed: number;
}

/**
 * Renders a reactive water ripple effect on a full-size <canvas>.
 *
 * Unlike standard particles, this effect is reactive to clicks/touches
 * and uses global event listeners to capture interactions even though
 * the layer itself is pointer-events-none.
 */
export function WaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const causticsRef = useRef<Caustic[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let raf = 0;
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initialize or re-distribute caustics
      const count = Math.floor((width * height) / 80000);
      causticsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 150 + Math.random() * 200,
        opacity: 0.05 + Math.random() * 0.05,
        angle: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.005,
      }));
    };

    const addRipple = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        opacity: 0.6,
      });
    };

    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        for (let i = 0; i < e.touches.length; i++) {
          addRipple(e.touches[i].clientX, e.touches[i].clientY);
        }
      } else {
        addRipple(e.clientX, e.clientY);
      }
    };

    const animate = () => {
      if (!running) return;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      // Subtle background tint to feel like water
      ctx.fillStyle = 'rgba(135, 206, 235, 0.04)';
      ctx.fillRect(0, 0, width, height);

      // Draw caustics (dancing light patterns)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const c of causticsRef.current) {
        c.angle += c.speed;
        const driftX = Math.cos(c.angle) * 0.3;
        const driftY = Math.sin(c.angle) * 0.3;
        c.x = (c.x + driftX + width) % width;
        c.y = (c.y + driftY + height) % height;

        const pulse = 0.8 + Math.sin(c.angle * 2) * 0.2;
        const size = c.size * pulse;
        const gradient = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${c.opacity * pulse})`);
        gradient.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${c.opacity * 0.3 * pulse})`,
        );
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(c.x, c.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.5;
        r.opacity -= 0.005;

        if (r.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw the main ripple ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw a second, inner ring for depth
        if (r.radius > 15) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius - 15, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Occasional ambient ripple
      if (Math.random() < 0.005) {
        ripples.push({
          x: Math.random() * (canvas.width / dpr),
          y: Math.random() * (canvas.height / dpr),
          radius: 0,
          opacity: 0.3,
        });
      }

      raf = requestAnimationFrame(animate);
    };

    resize();
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(resize);
      observer.observe(canvas);
    }

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        running = true;
        raf = requestAnimationFrame(animate);
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none h-full w-full')}
      aria-hidden="true"
    />
  );
}
