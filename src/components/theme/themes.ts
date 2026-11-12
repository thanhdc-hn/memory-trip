/**
 * Theme registry — the single source of truth for selectable visual "moods".
 *
 * Ordering here defines the order moods appear in the Settings theme picker
 * and by `getNextTheme`. Adding a mood = one entry here + one matching
 * `[data-theme]` block in `style.css` + one matching polaroid-frame block
 * (`--frame-*` tokens, see the "Polaroid frames" section of `style.css`) + two
 * i18n label keys (en/vi `common.json`). No application-logic edits are required.
 *
 * `accentEmoji` also becomes the sticker on the themed polaroid frames, in the
 * timeline and in the exported PDF album (`src/services/album-frame.ts` reads
 * the same `--frame-*` tokens, so the PDF needs no per-mood code either).
 *
 * Fields:
 * - `id`          : value written to `<html data-theme>` and persisted.
 * - `labelKey`    : i18n key (in the `common` namespace) for the display name.
 * - `swatch`      : representative color for the switcher button preview.
 * - `accentEmoji` : decorative-only accent shown in a few signature spots
 *                   (e.g. the polaroid frame sticker via `--theme-emoji`).
 */
interface ThemeMeta {
  readonly id: string;
  readonly labelKey: string;
  readonly swatch: string;
  readonly accentEmoji: string;
}

export const THEMES = [
  {
    id: 'summer',
    labelKey: 'theme.summer',
    swatch: '#87ceeb',
    accentEmoji: '✨',
  },
  {
    id: 'sunset',
    labelKey: 'theme.sunset',
    swatch: '#ff7f50',
    accentEmoji: '🌅',
  },
  {
    id: 'ocean',
    labelKey: 'theme.ocean',
    swatch: '#0e7490',
    accentEmoji: '🌊',
  },
  {
    id: 'forest',
    labelKey: 'theme.forest',
    swatch: '#2f855a',
    accentEmoji: '🌿',
  },
  {
    id: 'night',
    labelKey: 'theme.night',
    swatch: '#0b1220',
    accentEmoji: '🌙',
  },
  {
    id: 'sakura',
    labelKey: 'theme.sakura',
    swatch: '#fbcfe8',
    accentEmoji: '🌸',
  },
  {
    id: 'autumn',
    labelKey: 'theme.autumn',
    swatch: '#d97706',
    accentEmoji: '🍂',
  },
  {
    id: 'lavender',
    labelKey: 'theme.lavender',
    swatch: '#a78bfa',
    accentEmoji: '🪻',
  },
  {
    id: 'arctic',
    labelKey: 'theme.arctic',
    swatch: '#bae6fd',
    accentEmoji: '❄️',
  },
  {
    id: 'matcha',
    labelKey: 'theme.matcha',
    swatch: '#a7c080',
    accentEmoji: '🍵',
  },
  {
    id: 'honey',
    labelKey: 'theme.honey',
    swatch: '#f59e0b',
    accentEmoji: '🍯',
  },
  {
    id: 'cosmos',
    labelKey: 'theme.cosmos',
    swatch: '#c084fc',
    accentEmoji: '🌌',
  },
] as const satisfies readonly ThemeMeta[];

export type ThemeId = (typeof THEMES)[number]['id'];
export type ThemeDefinition = (typeof THEMES)[number];
