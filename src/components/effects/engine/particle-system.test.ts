import { describe, expect, it } from 'vitest';

import {
  AREA_UNIT,
  GLOBAL_CEILING,
  type ParticleEffectConfig,
  computeParticleCount,
  createParticleSystem,
  renderX,
  resizeParticleSystem,
  stepParticleSystem,
} from './particle-system';
import { createRng } from './rng';

const config: ParticleEffectConfig = {
  density: 10, // 10 particles per 100,000 px²
  maxCount: 200,
  speed: [50, 100],
  size: [10, 20],
  drift: [5, 5], // fixed drift for deterministic motion assertions
  sway: { amplitude: [0, 0], frequency: [1, 1] },
  spin: [30, 30],
  opacity: [0.5, 1],
};

const bounds = { width: 1000, height: 800 };

describe('computeParticleCount', () => {
  it('scales with viewport area', () => {
    const area = bounds.width * bounds.height; // 800,000 px²
    expect(computeParticleCount(config, bounds)).toBe(
      Math.round((config.density * area) / AREA_UNIT),
    ); // 80
  });

  it('respects the per-effect maxCount', () => {
    expect(computeParticleCount({ ...config, maxCount: 25 }, bounds)).toBe(25);
  });

  it('never exceeds the global ceiling', () => {
    const huge = { ...config, density: 100000, maxCount: 1e9 };
    expect(computeParticleCount(huge, bounds)).toBe(GLOBAL_CEILING);
  });

  it('is zero for an empty viewport', () => {
    expect(computeParticleCount(config, { width: 0, height: 0 })).toBe(0);
  });
});

describe('createParticleSystem', () => {
  it('pre-fills the computed number of particles within bounds', () => {
    const system = createParticleSystem(config, bounds, createRng(7));
    expect(system.particles).toHaveLength(computeParticleCount(config, bounds));
    for (const p of system.particles) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(bounds.width);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(bounds.height);
      expect(p.size).toBeGreaterThanOrEqual(config.size[0]);
      expect(p.size).toBeLessThanOrEqual(config.size[1]);
    }
  });

  it('is deterministic for the same seed', () => {
    const a = createParticleSystem(config, bounds, createRng(99));
    const b = createParticleSystem(config, bounds, createRng(99));
    expect(a.particles[0]).toEqual(b.particles[0]);
  });
});

describe('stepParticleSystem', () => {
  it('integrates motion by dt', () => {
    const system = createParticleSystem(config, bounds, createRng(3));
    const p = system.particles[0];
    const before = { ...p };
    const dt = 0.5;

    stepParticleSystem(system, dt);

    expect(p.y).toBeCloseTo(before.y + before.vy * dt);
    expect(p.x).toBeCloseTo(before.x + before.driftX * dt);
    expect(p.swayPhase).toBeCloseTo(
      before.swayPhase + before.swayFrequency * dt,
    );
    expect(p.rotation).toBeCloseTo(before.rotation + before.spin * dt);
  });

  it('respawns a particle at the top once it falls past the bottom', () => {
    const system = createParticleSystem(config, bounds, createRng(5));
    const p = system.particles[0];
    p.y = bounds.height + p.size + 100; // well below the bottom

    stepParticleSystem(system, 0.016);

    expect(p.y).toBeLessThanOrEqual(0); // respawned above the top edge
    expect(p.x).toBeGreaterThanOrEqual(0);
    expect(p.x).toBeLessThanOrEqual(bounds.width);
  });

  it('respawns a particle at the bottom once it floats past the top', () => {
    const upConfig = { ...config, speed: [-100, -50] as const };
    const system = createParticleSystem(upConfig, bounds, createRng(6));
    const p = system.particles[0];
    p.vy = -80;
    p.y = -p.size - 100; // well above the top

    stepParticleSystem(system, 0.016);

    expect(p.y).toBeGreaterThanOrEqual(bounds.height); // respawned below bottom edge
    expect(p.x).toBeGreaterThanOrEqual(0);
    expect(p.x).toBeLessThanOrEqual(bounds.width);
  });

  it('wraps a particle that drifts off the right edge', () => {
    const system = createParticleSystem(config, bounds, createRng(8));
    const p = system.particles[0];
    p.y = 10; // on-screen vertically, so only wrap logic applies
    p.x = bounds.width + 100; // well past the right margin
    p.driftX = 0;

    stepParticleSystem(system, 0);

    expect(p.x).toBeLessThan(bounds.width);
    expect(p.x).toBeGreaterThanOrEqual(0);
  });
});

describe('resizeParticleSystem', () => {
  it('grows the pool when the viewport enlarges', () => {
    const system = createParticleSystem(
      config,
      { width: 200, height: 200 },
      createRng(1),
    );
    const small = system.particles.length;
    resizeParticleSystem(system, { width: 2000, height: 2000 });
    expect(system.particles.length).toBeGreaterThan(small);
    expect(system.bounds).toEqual({ width: 2000, height: 2000 });
  });

  it('trims the pool when the viewport shrinks', () => {
    const system = createParticleSystem(
      config,
      { width: 2000, height: 2000 },
      createRng(1),
    );
    const big = system.particles.length;
    resizeParticleSystem(system, { width: 200, height: 200 });
    expect(system.particles.length).toBeLessThan(big);
  });
});

describe('renderX', () => {
  it('adds the sway offset to the base x', () => {
    const p = {
      x: 100,
      y: 0,
      vy: 0,
      driftX: 0,
      swayAmplitude: 20,
      swayFrequency: 0,
      swayPhase: Math.PI / 2, // sin = 1
      rotation: 0,
      spin: 0,
      size: 10,
      opacity: 1,
      variant: 0,
    };
    expect(renderX(p)).toBeCloseTo(120);
  });
});
