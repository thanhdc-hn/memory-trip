import { describe, expect, it } from 'vitest';

import {
  DEFAULT_THEME,
  getNextTheme,
  getThemeById,
  isThemeId,
} from './theme-utils';
import { THEMES } from './themes';

describe('theme-utils', () => {
  describe('isThemeId', () => {
    it('returns true for every registered theme id', () => {
      for (const theme of THEMES) {
        expect(isThemeId(theme.id)).toBe(true);
      }
    });

    it('returns false for unknown or non-string values', () => {
      expect(isThemeId('teal')).toBe(false);
      expect(isThemeId('')).toBe(false);
      expect(isThemeId(null)).toBe(false);
      expect(isThemeId(undefined)).toBe(false);
      expect(isThemeId(42)).toBe(false);
      expect(isThemeId({})).toBe(false);
    });
  });

  describe('getThemeById', () => {
    it('returns the matching definition', () => {
      expect(getThemeById('sunset').id).toBe('sunset');
    });

    it('falls back to the first theme for an unknown id', () => {
      expect(getThemeById('nope')).toBe(THEMES[0]);
      expect(getThemeById('nope').id).toBe(DEFAULT_THEME);
    });
  });

  describe('getNextTheme', () => {
    it('advances in registry order', () => {
      for (let i = 0; i < THEMES.length - 1; i++) {
        expect(getNextTheme(THEMES[i].id)).toBe(THEMES[i + 1].id);
      }
    });

    it('wraps from the last theme back to the first (Night → Summer)', () => {
      const last = THEMES[THEMES.length - 1].id;
      expect(last).toBe('night');
      expect(THEMES[0].id).toBe('summer');
      expect(getNextTheme(last)).toBe(THEMES[0].id);
    });

    it('falls back to the first theme for an unknown id', () => {
      expect(getNextTheme('nope')).toBe(THEMES[0].id);
    });
  });
});
