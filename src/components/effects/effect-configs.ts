import { type EffectId } from './effects';
import { type ParticleEffectConfig } from './engine/particle-system';

/**
 * How a particle is painted. The renderer is generic; per-effect visuals live
 * here as data so adding an effect stays a data-only change.
 * - `circle` : filled dots (snow, bubbles).
 * - `line`   : thin streaks (rain).
 * - `glyph`  : a cached emoji sprite (leaves, blossom, …).
 */
export type RenderSpec =
  | { kind: 'circle'; colors: readonly string[] }
  | { kind: 'line'; colors: readonly string[]; length: number; width: number }
  | { kind: 'glyph'; glyphs: readonly string[] };

export interface ParticleEffectSpec {
  config: ParticleEffectConfig;
  render: RenderSpec;
}

/**
 * Particle effects, keyed by effect id. Phase 1 ships Snow, Rain and Leaves.
 * CSS effects (sun, and fog in Phase 2) are not in this map — the layer routes
 * those through CSS_EFFECT_CLASSES instead.
 */
export const PARTICLE_CONFIGS: Partial<Record<EffectId, ParticleEffectSpec>> = {
  snow: {
    config: {
      density: 6,
      maxCount: 90,
      speed: [30, 70],
      size: [4, 10],
      drift: [-10, 10],
      sway: { amplitude: [8, 26], frequency: [0.5, 1.3] },
      spin: [0, 0],
      opacity: [0.4, 0.9],
    },
    render: { kind: 'circle', colors: ['#ffffff', '#eaf4ff'] },
  },
  rain: {
    config: {
      density: 14,
      maxCount: 150,
      speed: [340, 560],
      size: [12, 20],
      drift: [-44, -12], // slight wind-driven slant to the left
      sway: { amplitude: [0, 0], frequency: [0, 0] }, // rain falls straight
      spin: [0, 0],
      opacity: [0.18, 0.42],
    },
    render: {
      kind: 'line',
      colors: ['#9cc2dd', '#7aa9cf'],
      length: 16,
      width: 1.4,
    },
  },
  leaves: {
    config: {
      density: 2.4,
      maxCount: 40,
      speed: [40, 95],
      size: [16, 30],
      drift: [-34, 34],
      sway: { amplitude: [22, 64], frequency: [0.4, 1.1] },
      spin: [-70, 70], // tumbling
      opacity: [0.75, 1],
    },
    render: { kind: 'glyph', glyphs: ['🍂', '🍁'] },
  },
  blossom: {
    config: {
      density: 2.2,
      maxCount: 35,
      speed: [35, 80],
      size: [14, 24],
      drift: [-20, 30],
      sway: { amplitude: [15, 45], frequency: [0.3, 0.9] },
      spin: [-40, 100],
      opacity: [0.7, 0.95],
    },
    render: { kind: 'glyph', glyphs: ['🌸'] },
  },
  fireflies: {
    config: {
      density: 1.5,
      maxCount: 25,
      speed: [-10, 10],
      size: [2, 5],
      drift: [-15, 15],
      sway: { amplitude: [10, 30], frequency: [0.2, 0.6] },
      spin: [0, 0],
      opacity: [0.2, 0.8],
    },
    render: { kind: 'circle', colors: ['#ffff88', '#ffff00', '#ccff00'] },
  },
  bubbles: {
    config: {
      density: 1.8,
      maxCount: 30,
      speed: [-50, -20],
      size: [10, 30],
      drift: [-10, 10],
      sway: { amplitude: [5, 20], frequency: [0.4, 1.2] },
      spin: [0, 0],
      opacity: [0.1, 0.4],
    },
    render: { kind: 'circle', colors: ['#ffffff'] },
  },
  butterflies: {
    config: {
      density: 1.0,
      maxCount: 15,
      speed: [-20, 20],
      size: [20, 35],
      drift: [-40, 40],
      sway: { amplitude: [30, 80], frequency: [0.5, 1.5] },
      spin: [-20, 20],
      opacity: [0.8, 1],
    },
    render: { kind: 'glyph', glyphs: ['🦋'] },
  },
  balloons: {
    config: {
      density: 0.6,
      maxCount: 10,
      speed: [-80, -40],
      size: [30, 50],
      drift: [-20, 20],
      sway: { amplitude: [10, 40], frequency: [0.2, 0.8] },
      spin: [-10, 10],
      opacity: [0.8, 1],
    },
    render: { kind: 'glyph', glyphs: ['🎈'] },
  },
  confetti: {
    config: {
      density: 3.5,
      maxCount: 60,
      speed: [120, 280],
      size: [8, 14],
      drift: [-50, 50],
      sway: { amplitude: [20, 50], frequency: [1, 3] },
      spin: [180, 720],
      opacity: [0.8, 1],
    },
    render: {
      kind: 'circle',
      colors: [
        '#ff5252',
        '#ff4081',
        '#e040fb',
        '#7c4dff',
        '#536dfe',
        '#448aff',
        '#40c4ff',
        '#18ffff',
        '#64ffda',
        '#69f0ae',
        '#b2ff59',
        '#eeff41',
        '#ffff00',
        '#ffd740',
        '#ffab40',
        '#ff6e40',
      ],
    },
  },
};

/**
 * CSS (non-particle) effects, keyed by effect id → the class applied to the
 * ambient layer div. The matching styles live in `style.css`. Adding a CSS
 * effect = one entry here + one `style.css` block (+ registry entry + i18n).
 */
export const CSS_EFFECT_CLASSES: Partial<Record<EffectId, string>> = {
  sun: 'mt-effect-sun',
  fog: 'mt-effect-fog',
};
