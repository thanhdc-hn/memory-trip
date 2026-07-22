import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

/** Cap DPR so high-density-display phones don't pay for huge canvases. */
const MAX_DPR = 2;

interface Point {
  x: number;
  y: number;
}

interface Filament {
  points: Point[];
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  maxPoints: number;
  width: number;
  opacity: number;
  colorShift: number; // Subtle variation from base color
}

interface InkColor {
  h: number;
  s: number;
  l: number;
}

interface InkDrop {
  x: number;
  y: number;
  filaments: Filament[];
  age: number;
  maxAge: number;
  color: InkColor;
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
 * Renders a reactive ink diffusion effect on a full-size <canvas>.
 * Mimics a drop of ink falling into clear water and slowly dissolving.
 */
export function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<InkDrop[]>([]);
  const causticsRef = useRef<Caustic[]>([]);

  const INK_COLORS: InkColor[] = [
    { h: 240, s: 30, l: 15 }, // Deep Indigo
    { h: 200, s: 80, l: 30 }, // Deep Blue
    { h: 280, s: 70, l: 35 }, // Purple
    { h: 340, s: 80, l: 40 }, // Crimson
    { h: 180, s: 70, l: 35 }, // Teal
    { h: 160, s: 60, l: 25 }, // Dark Green
    { h: 30, s: 90, l: 40 }, // Burnt Orange
    { h: 200, s: 40, l: 20 }, // Grey Blue
  ];

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

      // Initialize or re-distribute caustics (dancing light patterns)
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

    const createFilament = (x: number, y: number, angle: number): Filament => {
      const speed = 0.4 + Math.random() * 0.8;
      return {
        points: [{ x, y }],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        speed,
        maxPoints: 30 + Math.random() * 40,
        width: 0.8 + Math.random() * 1.5,
        opacity: 0.5 + Math.random() * 0.3,
        colorShift: (Math.random() - 0.5) * 20, // Variation in luminosity/saturation
      };
    };

    const addDrop = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const numFilaments = 8 + Math.floor(Math.random() * 8);
      const filaments = [];
      for (let i = 0; i < numFilaments; i++) {
        const angle =
          (i / numFilaments) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        filaments.push(createFilament(x, y, angle));
      }

      const baseColor =
        INK_COLORS[Math.floor(Math.random() * INK_COLORS.length)];

      dropsRef.current.push({
        x,
        y,
        filaments,
        age: 0,
        maxAge: 400 + Math.random() * 200,
        color: baseColor,
      });
    };

    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        for (let i = 0; i < e.touches.length; i++) {
          addDrop(e.touches[i].clientX, e.touches[i].clientY);
        }
      } else {
        addDrop(e.clientX, e.clientY);
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

      const drops = dropsRef.current;
      ctx.save();
      // Multiply allows colors to combine/blend realistically (subtractive mixing)
      ctx.globalCompositeOperation = 'multiply';

      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        drop.age++;

        if (drop.age > drop.maxAge) {
          drops.splice(i, 1);
          continue;
        }

        const lifeRatio = drop.age / drop.maxAge;

        for (const f of drop.filaments) {
          // Update filament head
          if (f.points.length < f.maxPoints) {
            const head = f.points[f.points.length - 1];

            // Procedural curving (noise approximation)
            f.angle += Math.sin(drop.age * 0.04 + f.angle * 2) * 0.15;
            f.vx = Math.cos(f.angle) * f.speed;
            f.vy = Math.sin(f.angle) * f.speed;

            f.points.push({
              x: head.x + f.vx,
              y: head.y + f.vy,
            });
          }

          const currentOpacity = f.opacity * Math.pow(1 - lifeRatio, 1.5);
          if (currentOpacity <= 0.01) continue;

          ctx.beginPath();
          ctx.moveTo(f.points[0].x, f.points[0].y);

          for (let j = 1; j < f.points.length; j++) {
            // Slight fluid drift for each segment
            const p = f.points[j];
            p.x += Math.sin(drop.age * 0.02 + j * 0.1) * 0.15;
            p.y += 0.08; // Subtle sinking

            ctx.lineTo(p.x, p.y);
          }

          // Render with "bleeding" effect
          const { h, s, l } = drop.color;
          // Apply filament-specific shift for depth
          const finalL = Math.max(0, Math.min(100, l + f.colorShift));
          ctx.strokeStyle = `hsl(${h}, ${s}%, ${finalL}%)`;

          ctx.globalAlpha = currentOpacity;
          // Width grows over time to simulate diffusion
          ctx.lineWidth =
            f.width + lifeRatio * 18 * (f.points.length / f.maxPoints);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      }
      ctx.restore();

      // Occasional ambient ink drop
      if (Math.random() < 0.004) {
        addDrop(Math.random() * width, Math.random() * height);
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
