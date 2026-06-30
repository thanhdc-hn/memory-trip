import {
  EFFECTS,
  type EffectDefinition,
  type EffectId,
  type EffectSelection,
} from './effects';

/** The default selection: derive the effect from the current season. */
export const DEFAULT_SELECTION: EffectSelection = 'auto';

/** Type guard: is `value` a registered effect id? */
export function isEffectId(value: unknown): value is EffectId {
  return typeof value === 'string' && EFFECTS.some((e) => e.id === value);
}

/** Type guard: is `value` a valid persisted selection (`auto` | `off` | id)? */
export function isEffectSelection(value: unknown): value is EffectSelection {
  return value === 'auto' || value === 'off' || isEffectId(value);
}

/** Look up an effect definition, falling back to the first entry on a miss. */
export function getEffectById(id: string): EffectDefinition {
  return EFFECTS.find((e) => e.id === id) ?? EFFECTS[0];
}

/**
 * Map a date to its seasonal effect (northern hemisphere / Vietnam-friendly).
 * The four seasonal effects cover the four seasons; spring leans on gentle rain
 * rather than a literal blossom (blossom arrives in Phase 2). Adjust this table
 * freely — it is the only place the season → effect policy lives.
 *
 * - Dec, Jan, Feb → snow
 * - Mar, Apr, May → rain
 * - Jun, Jul, Aug → sun
 * - Sep, Oct, Nov → leaves
 */
export function getSeasonalEffect(date: Date = new Date()): EffectId {
  const month = date.getMonth(); // 0 (Jan) – 11 (Dec)
  if (month === 11 || month <= 1) return 'snow';
  if (month <= 4) return 'rain';
  if (month <= 7) return 'sun';
  return 'leaves';
}

/**
 * Resolve a persisted selection to the effect that should actually render:
 * - `off`  → `null` (render nothing).
 * - `auto` → the current seasonal effect.
 * - an id  → that effect (falling back to seasonal for an unknown id).
 */
export function resolveEffect(
  selection: EffectSelection,
  date: Date = new Date(),
): EffectId | null {
  if (selection === 'off') return null;
  if (selection === 'auto') return getSeasonalEffect(date);
  return isEffectId(selection) ? selection : getSeasonalEffect(date);
}
