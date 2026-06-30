import { THEMES, type ThemeDefinition, type ThemeId } from './themes';

/** The default/fallback mood (first registry entry). */
export const DEFAULT_THEME: ThemeId = THEMES[0].id;

/** Type guard: is `value` a registered theme id? */
export function isThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === 'string' && THEMES.some((theme) => theme.id === value)
  );
}

/** Look up a theme definition, falling back to the default on an unknown id. */
export function getThemeById(id: string): ThemeDefinition {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

/**
 * Next mood in registry order, wrapping from the last back to the first.
 * Unknown ids resolve to the first theme.
 */
export function getNextTheme(id: string): ThemeId {
  const index = THEMES.findIndex((theme) => theme.id === id);
  const nextIndex = (index + 1) % THEMES.length;
  return THEMES[nextIndex].id;
}
