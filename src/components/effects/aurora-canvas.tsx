import { useEffect, useRef } from 'react';

interface Ribbon {
  x: number;
  color: string;
  opacity: number;
  width: number;
  speed: number;
  amplitude: number;
  frequency: number;
  offset: number;
}

/**
 * AuroraCanvas renders a flowing northern lights effect.
 * It uses multiple ribbons of light that sway using sine wave combinations.
 */
export function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ribbonsRef = useRef<Ribbon[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const COLORS = [
      '#00ffcc', // Green-Teal
      '#00ff95', // Spring Green
      '#7000ff', // Deep Purple
      '#00d4ff', // Cyan
      '#b300ff', // Magenta-Purple
    ];

    const createRibbons = () => {
      ribbonsRef.current = Array.from({ length: 5 }, (_, i) => ({
        x: (width / 6) * (i + 1),
        color: COLORS[i % COLORS.length],
        opacity: 0.15 + Math.random() * 0.15,
        width: 150 + Math.random() * 100,
        speed: 0.0004 + Math.random() * 0.0006,
        amplitude: 60 + Math.random() * 60,
        frequency: 0.001 + Math.random() * 0.002,
        offset: Math.random() * Math.PI * 2,
      }));
    };

    const init = () => {
      resize();
      createRibbons();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      // 'screen' mode is perfect for additive light effects like Aurora
      ctx.globalCompositeOperation = 'screen';

      ribbonsRef.current.forEach((ribbon) => {
        const t = time * ribbon.speed + ribbon.offset;

        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.2, ribbon.color);
        grad.addColorStop(0.5, ribbon.color);
        grad.addColorStop(0.8, ribbon.color);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        // Subtle pulsing opacity
        ctx.globalAlpha = ribbon.opacity * (0.7 + Math.sin(t * 0.8) * 0.3);
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const step = 20;
        const points = Math.ceil(height / step) + 1;

        for (let i = 0; i < points; i++) {
          const y = i * step;
          // Combine multiple sine waves for organic "sway"
          const xOffset =
            Math.sin(t + i * 0.15) * ribbon.amplitude +
            Math.cos(t * 0.5 + i * 0.1) * (ribbon.amplitude * 0.5) +
            Math.sin(t * 0.2 + i * 0.05) * (ribbon.amplitude * 0.3);

          const x = ribbon.x + xOffset;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    init();
    window.addEventListener('resize', init);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-60"
      style={{ filter: 'blur(45px)' }}
      aria-hidden="true"
    />
  );
}
