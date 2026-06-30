import {
  type ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import { STORAGE_KEY } from '@/utils/constants';
import storage from '@/utils/storage';

import { DEFAULT_THEME, getThemeById, isThemeId } from './theme-utils';
import { type ThemeDefinition, type ThemeId } from './themes';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): ThemeId {
  const stored = storage.get<string>(STORAGE_KEY.THEME);
  return isThemeId(stored) ? stored : DEFAULT_THEME;
}

/**
 * Apply the mood to the document: set `data-theme` (drives all Tailwind tokens)
 * and sync the PWA `theme-color` meta to the resolved surface color so the
 * mobile browser chrome matches. Reading the computed `--surface` keeps this
 * registry-agnostic — a new mood needs no change here.
 */
function applyTheme(theme: ThemeId): void {
  const root = window.document.documentElement;
  root.setAttribute('data-theme', theme);

  const surface = getComputedStyle(root).getPropertyValue('--surface').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && surface) {
    meta.setAttribute('content', surface);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme);

  // useLayoutEffect applies before paint to minimize any wrong-theme frame on
  // first mount (the pre-mount script in index.html handles the reload case).
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (next: ThemeId) => {
    storage.set(STORAGE_KEY.THEME, next);
    setThemeState(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/** Active theme metadata (label, swatch, decorative accent emoji). */
export function useThemeMeta(): ThemeDefinition {
  const { theme } = useTheme();
  return getThemeById(theme);
}
