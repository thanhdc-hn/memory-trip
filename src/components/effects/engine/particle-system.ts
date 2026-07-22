/**
 * Pure particle simulation core — no canvas, no DOM, no React. The canvas
 * renderer (see particle-canvas) owns the rAF loop and drawing; this module
 * owns only the math, so it is fully unit-testable in jsdom.
 *
 * Coordinate system: origin top-left, +y downward (screen space). Sway is a
 * horizontal oscillation applied at *render* time via `renderX`, so the base
 * `x` integrates only the constant drift and stays easy to reason about.
 */

export interface Bounds {
  width: number;
  height: number;
}

/** Inclusive numeric range `[min, max]`. */
export type Range = readonly [min: number, max: number];

/** Data-only motion description for one particle effect. */
export interface ParticleEffectConfig {
  /** Target density expressed as particles per AREA_UNIT (100,000 px²). */
  density: number;
  /** Hard per-effect cap regardless of viewport size. */
  maxCount: number;
  /** Vertical fall speed, px/s. */
  speed: Range;
  /** Particle size, px. */
  size: Range;
  /** Constant horizontal drift, px/s (e.g. wind, rain angle). */
  drift: Range;
  /** Horizontal sway oscillation (applied at render via `renderX`). */
  sway: {
    /** Peak horizontal offset, px. */
    amplitude: Range;
    /** Oscillation speed, rad/s. */
    frequency: Range;
  };
  /** Rotation speed, deg/s. */
  spin: Range;
  /** Opacity, 0..1. */
  opacity: Range;
}

export interface Particle {
  /** Base horizontal position; sway is added at render time. */
  x: number;
  y: number;
  /** Fall speed, px/s. */
  vy: number;
  /** Constant horizontal velocity, px/s. */
  driftX: number;
  swayAmplitude: number;
  swayFrequency: number;
  swayPhase: number;
  /** Rotation, degrees. */
  rotation: number;
  /** Rotation speed, deg/s. */
  spin: number;
  size: number;
  opacity: number;
  /** Stable 0..1 value for picking a color/glyph variant at render time. */
  variant: number;
}

export interface ParticleSystem {
  particles: Particle[];
  config: ParticleEffectConfig;
  bounds: Bounds;
  rng: () => number;
}

/** Reference area for the density → count conversion. */
export const AREA_UNIT = 100_000;
/** Absolute safety ceiling on particle count, any effect, any viewport. */
export const GLOBAL_CEILING = 300;
/** Off-screen margin before a particle wraps / respawns. */
const RESPAWN_MARGIN = 8;

/**
 * Particle count derived from viewport area so "subtle" holds across phone and
 * desktop, clamped by both the effect's `maxCount` and the global ceiling.
 */
export function computeParticleCount(
  config: ParticleEffectConfig,
  bounds: Bounds,
): number {
  const area = Math.max(0, bounds.width) * Math.max(0, bounds.height);
  const raw = Math.round((config.density * area) / AREA_UNIT);
  return Math.min(Math.max(raw, 0), config.maxCount, GLOBAL_CEILING);
}

function pick(rng: () => number, [min, max]: Range): number {
  return min + (max - min) * rng();
}

function spawnParticle(
  config: ParticleEffectConfig,
  bounds: Bounds,
  rng: () => number,
  opts: { atTop?: boolean; atBottom?: boolean } = {},
): Particle {
  const size = pick(rng, config.size);
  let y = rng() * bounds.height;
  if (opts.atTop) y = -size;
  else if (opts.atBottom) y = bounds.height + size;

  return {
    x: rng() * bounds.width,
    y,
    vy: pick(rng, config.speed),
    driftX: pick(rng, config.drift),
    swayAmplitude: pick(rng, config.sway.amplitude),
    swayFrequency: pick(rng, config.sway.frequency),
    swayPhase: rng() * Math.PI * 2,
    rotation: rng() * 360,
    spin: pick(rng, config.spin),
    size,
    opacity: pick(rng, config.opacity),
    variant: rng(),
  };
}

/** Build a system pre-filled with particles scattered across the bounds. */
export function createParticleSystem(
  config: ParticleEffectConfig,
  bounds: Bounds,
  rng: () => number,
): ParticleSystem {
  const count = computeParticleCount(config, bounds);
  const particles = Array.from({ length: count }, () =>
    spawnParticle(config, bounds, rng),
  );
  return { particles, config, bounds, rng };
}

/**
 * Advance every particle by `dt` seconds (mutates and returns the system).
 * Particles wrap horizontally and respawn at the top once fully past the bottom,
 * giving a continuous ambient stream.
 */
export function stepParticleSystem(
  system: ParticleSystem,
  dt: number,
): ParticleSystem {
  const { bounds, config, rng } = system;
  const wrapWidth = bounds.width + 2 * RESPAWN_MARGIN;

  for (const p of system.particles) {
    p.y += p.vy * dt;
    p.x += p.driftX * dt;
    p.swayPhase += p.swayFrequency * dt;
    p.rotation += p.spin * dt;

    if (p.x < -RESPAWN_MARGIN) p.x += wrapWidth;
    else if (p.x > bounds.width + RESPAWN_MARGIN) p.x -= wrapWidth;

    if (p.vy < 0) {
      // Moving up (e.g. rising particles)
      if (p.y + p.size < 0) {
        Object.assign(
          p,
          spawnParticle(config, bounds, rng, { atBottom: true }),
        );
      }
    } else {
      // Moving down or static
      if (p.y - p.size > bounds.height) {
        Object.assign(p, spawnParticle(config, bounds, rng, { atTop: true }));
      }
    }
  }

  return system;
}

/** Re-fit the particle pool to a new viewport size (add/trim, keep survivors). */
export function resizeParticleSystem(
  system: ParticleSystem,
  bounds: Bounds,
): ParticleSystem {
  system.bounds = bounds;
  const target = computeParticleCount(system.config, bounds);
  const current = system.particles.length;

  if (target > current) {
    for (let i = current; i < target; i++) {
      system.particles.push(spawnParticle(system.config, bounds, system.rng));
    }
  } else if (target < current) {
    system.particles.length = target;
  }

  return system;
}

/** Horizontal draw position: base position plus the current sway offset. */
export function renderX(p: Particle): number {
  return p.x + Math.sin(p.swayPhase) * p.swayAmplitude;
}
