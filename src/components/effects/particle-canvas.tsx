import { useEffect, useRef } from 'react';

import { type ParticleEffectSpec, type RenderSpec } from './effect-configs';
import {
  type Particle,
  type ParticleSystem,
  createParticleSystem,
  renderX,
  resizeParticleSystem,
  stepParticleSystem,
} from './engine/particle-system';
import { createRng } from './engine/rng';
import { getEmojiSprite } from './engine/sprite-cache';

/** Largest delta we integrate in one frame (caps catch-up after a pause). */
const MAX_FRAME_DT = 0.05;
/** Cap DPR so high-density-display phones don't pay for huge canvases. */
const MAX_DPR = 2;

function pickFrom<T>(items: readonly T[], variant: number): T {
  return items[Math.min(items.length - 1, Math.floor(variant * items.length))];
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  render: RenderSpec,
  dpr: number,
): void {
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(renderX(p), p.y);

  switch (render.kind) {
    case 'circle': {
      ctx.fillStyle = pickFrom(render.colors, p.variant);
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'line': {
      ctx.strokeStyle = pickFrom(render.colors, p.variant);
      ctx.lineWidth = render.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Slant the streak slightly with the horizontal drift.
      ctx.lineTo(p.driftX * 0.06, render.length);
      ctx.stroke();
      break;
    }
    case 'glyph': {
      ctx.rotate((p.rotation * Math.PI) / 180);
      const sprite = getEmojiSprite(
        pickFrom(render.glyphs, p.variant),
        p.size,
        dpr,
      );
      ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
      break;
    }
  }

  ctx.restore();
}

/**
 * Renders a particle effect on a full-size `<canvas>`.
 *
 * Owns the runtime concerns the pure engine deliberately avoids: a rAF loop with
 * a clamped delta, DPR-aware sizing, `ResizeObserver` re-fitting, and pausing
 * while the tab is hidden (battery). Reduced-motion gating lives in the parent
 * layer, which simply doesn't mount this when motion is reduced.
 */
export function ParticleCanvas({ spec }: { spec: ParticleEffectSpec }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // unsupported / jsdom — nothing to animate

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let system: ParticleSystem | null = null;
    let raf = 0;
    let lastTime = 0;
    let running = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bounds = { width, height };
      system = system
        ? resizeParticleSystem(system, bounds)
        : createParticleSystem(spec.config, bounds, createRng(Date.now()));
    };

    const frame = (time: number) => {
      if (!running || !system) return;
      const dt = lastTime
        ? Math.min((time - lastTime) / 1000, MAX_FRAME_DT)
        : 0;
      lastTime = time;
      stepParticleSystem(system, dt);
      ctx.clearRect(0, 0, system.bounds.width, system.bounds.height);
      for (const particle of system.particles) {
        drawParticle(ctx, particle, spec.render, dpr);
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };

    resize();
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(resize);
      observer.observe(canvas);
    }
    document.addEventListener('visibilitychange', onVisibility);
    if (document.visibilityState !== 'hidden') start();

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [spec]);

  return (
    <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
  );
}
