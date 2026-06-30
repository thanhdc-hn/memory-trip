import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SELECTION,
  getEffectById,
  getSeasonalEffect,
  isEffectId,
  isEffectSelection,
  resolveEffect,
} from './effect-utils';
import { EFFECTS } from './effects';

/** Build a date on the 15th of a given 0-indexed month (mid-month, no edges). */
const monthDate = (month: number) => new Date(2026, month, 15);

describe('effect-utils', () => {
  describe('isEffectId', () => {
    it('returns true for every registered effect id', () => {
      for (const effect of EFFECTS) {
        expect(isEffectId(effect.id)).toBe(true);
      }
    });

    it('returns false for unknown or non-string values', () => {
      expect(isEffectId('auto')).toBe(false);
      expect(isEffectId('off')).toBe(false);
      expect(isEffectId('storm')).toBe(false);
      expect(isEffectId('')).toBe(false);
      expect(isEffectId(null)).toBe(false);
      expect(isEffectId(undefined)).toBe(false);
      expect(isEffectId(7)).toBe(false);
    });
  });

  describe('isEffectSelection', () => {
    it('accepts auto, off and every registered id', () => {
      expect(isEffectSelection('auto')).toBe(true);
      expect(isEffectSelection('off')).toBe(true);
      for (const effect of EFFECTS) {
        expect(isEffectSelection(effect.id)).toBe(true);
      }
    });

    it('rejects unknown or non-string values', () => {
      expect(isEffectSelection('rainbow')).toBe(false);
      expect(isEffectSelection('')).toBe(false);
      expect(isEffectSelection(null)).toBe(false);
      expect(isEffectSelection(undefined)).toBe(false);
      expect(isEffectSelection(0)).toBe(false);
    });

    it('uses auto as the default selection', () => {
      expect(DEFAULT_SELECTION).toBe('auto');
      expect(isEffectSelection(DEFAULT_SELECTION)).toBe(true);
    });
  });

  describe('getEffectById', () => {
    it('returns the matching definition', () => {
      expect(getEffectById('rain').id).toBe('rain');
      expect(getEffectById('sun').kind).toBe('css');
    });

    it('falls back to the first effect for an unknown id', () => {
      expect(getEffectById('nope')).toBe(EFFECTS[0]);
    });
  });

  describe('getSeasonalEffect', () => {
    it('maps every month to the expected seasonal effect', () => {
      const expected: Record<number, string> = {
        0: 'snow', // Jan
        1: 'snow', // Feb
        2: 'rain', // Mar
        3: 'rain', // Apr
        4: 'rain', // May
        5: 'sun', // Jun
        6: 'sun', // Jul
        7: 'sun', // Aug
        8: 'leaves', // Sep
        9: 'leaves', // Oct
        10: 'leaves', // Nov
        11: 'snow', // Dec
      };
      for (let month = 0; month < 12; month++) {
        expect(getSeasonalEffect(monthDate(month))).toBe(expected[month]);
      }
    });

    it('only ever resolves to a seasonal effect', () => {
      const seasonalIds = EFFECTS.filter((e) => e.seasonal).map((e) => e.id);
      for (let month = 0; month < 12; month++) {
        expect(seasonalIds).toContain(getSeasonalEffect(monthDate(month)));
      }
    });
  });

  describe('resolveEffect', () => {
    it('returns null when off', () => {
      expect(resolveEffect('off', monthDate(0))).toBeNull();
    });

    it('returns the seasonal effect when auto', () => {
      expect(resolveEffect('auto', monthDate(0))).toBe('snow'); // Jan
      expect(resolveEffect('auto', monthDate(6))).toBe('sun'); // Jul
    });

    it('returns a specific effect unchanged', () => {
      expect(resolveEffect('leaves', monthDate(0))).toBe('leaves');
    });

    it('falls back to seasonal for an unknown selection', () => {
      // @ts-expect-error — exercising the runtime fallback path.
      expect(resolveEffect('storm', monthDate(6))).toBe('sun');
    });
  });
});
