import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ReactNode } from 'react';

import { STORAGE_KEY } from '@/utils/constants';

import { ThemeProvider, useTheme, useThemeMeta } from './theme-provider';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

afterEach(() => {
  localStorage.clear();
});

describe('ThemeProvider', () => {
  it('defaults to summer and applies data-theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('summer');
    expect(document.documentElement.getAttribute('data-theme')).toBe('summer');
  });

  it('persists the selected theme and applies it to the document', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => result.current.setTheme('ocean'));

    expect(result.current.theme).toBe('ocean');
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(localStorage.getItem(STORAGE_KEY.THEME)).toBe(
      JSON.stringify('ocean'),
    );
  });

  it('reads the persisted theme on mount', () => {
    localStorage.setItem(STORAGE_KEY.THEME, JSON.stringify('forest'));
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('forest');
  });

  it('falls back to summer for an invalid stored value', () => {
    localStorage.setItem(STORAGE_KEY.THEME, JSON.stringify('rainbow'));
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('summer');
  });

  it('exposes the active theme metadata via useThemeMeta', () => {
    localStorage.setItem(STORAGE_KEY.THEME, JSON.stringify('forest'));
    const { result } = renderHook(() => useThemeMeta(), { wrapper });
    expect(result.current.id).toBe('forest');
    expect(result.current.accentEmoji).toBe('🌿');
  });
});
