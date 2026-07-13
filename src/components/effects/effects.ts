/**
 * Effects registry — the single source of truth for selectable ambient
 * "weather" effects rendered across the whole app.
 *
 * Ordering here defines the order shown in the Settings effect picker. Adding an
 * effect = one entry here + (a canvas draw config or a CSS layer class, added in
 * the engine tasks) + two i18n label keys (en/vi `common.json`). No selection /
 * provider / layer logic edits are required.
 *
 * Fields:
 * - `id`       : value persisted as the manual selection and matched by the layer.
 * - `labelKey` : i18n key (in the `common` namespace) for the display name.
 * - `icon`     : emoji shown next to the label in the picker (decorative).
 * - `kind`     : how the effect is rendered — `particle` (canvas engine) or
 *                `css` (a non-particle ambient CSS layer, e.g. sun rays / fog).
 * - `seasonal` : whether the effect participates in the `auto` season rotation.
 *                Non-seasonal effects are manual-only.
 */
export type EffectKind = 'particle' | 'css';

interface EffectMeta {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: string;
  readonly kind: EffectKind;
  readonly seasonal: boolean;
}

/**
 * Phase 1 ships the four seasonal effects. Phase 2 appends the "fun" effects
 * (blossom, meteor, bubbles, butterflies, balloons, fire) + fog as pure
 * data/draw additions — no logic changes (see docs/ambient-effects-plan.md).
 */
export const EFFECTS = [
  {
    id: 'snow',
    labelKey: 'effect.snow',
    icon: '❄️',
    kind: 'particle',
    seasonal: true,
  },
  {
    id: 'rain',
    labelKey: 'effect.rain',
    icon: '🌧️',
    kind: 'particle',
    seasonal: true,
  },
  {
    id: 'sun',
    labelKey: 'effect.sun',
    icon: '☀️',
    kind: 'css',
    seasonal: true,
  },
  {
    id: 'leaves',
    labelKey: 'effect.leaves',
    icon: '🍂',
    kind: 'particle',
    seasonal: true,
  },
  // Phase 2: "fun" effects + fog
  {
    id: 'blossom',
    labelKey: 'effect.blossom',
    icon: '🌸',
    kind: 'particle',
    seasonal: false,
  },
  {
    id: 'meteor',
    labelKey: 'effect.meteor',
    icon: '☄️',
    kind: 'particle',
    seasonal: false,
  },
  {
    id: 'spring-leaves',
    labelKey: 'effect.springLeaves',
    icon: '🍃',
    kind: 'particle',
    seasonal: false,
  },
  {
    id: 'bubbles',
    labelKey: 'effect.bubbles',
    icon: '🫧',
    kind: 'particle',
    seasonal: false,
  },
  {
    id: 'butterflies',
    labelKey: 'effect.butterflies',
    icon: '🦋',
    kind: 'particle',
    seasonal: false,
  },
  {
    id: 'balloons',
    labelKey: 'effect.balloons',
    icon: '🎈',
    kind: 'particle',
    seasonal: false,
  },
  {
    id: 'fire',
    labelKey: 'effect.fire',
    icon: '🔥',
    kind: 'css',
    seasonal: false,
  },
  {
    id: 'fog',
    labelKey: 'effect.fog',
    icon: '🌫️',
    kind: 'css',
    seasonal: false,
  },
] as const satisfies readonly EffectMeta[];

export type EffectId = (typeof EFFECTS)[number]['id'];
export type EffectDefinition = (typeof EFFECTS)[number];

/**
 * User-facing effect selection persisted in localStorage:
 * - `auto` : resolve from the current month/season (default).
 * - `off`  : no effect.
 * - an `EffectId` : a specific manually-chosen effect.
 */
export type EffectSelection = 'auto' | 'off' | EffectId;
