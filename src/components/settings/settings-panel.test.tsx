import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ReactNode } from 'react';

import { DEFAULT_SELECTION } from '@/components/effects/effect-utils';
import { ThemeProvider } from '@/components/theme/theme-provider';
import i18n from '@/i18n';
import { useEffectStore } from '@/store/effect.store';
import { STORAGE_KEY } from '@/utils/constants';

import { SettingsPanel } from './settings-panel';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

beforeEach(async () => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  useEffectStore.setState({ selection: DEFAULT_SELECTION });
  await i18n.changeLanguage('en');
});

afterEach(() => {
  localStorage.clear();
});

describe('SettingsPanel', () => {
  it('switches the language', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Tiếng Việt' }));
    expect(i18n.language).toBe('vi');
    expect(document.documentElement.getAttribute('data-lang')).toBe('vi');
  });

  it('selects a theme and persists it', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Ocean' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(localStorage.getItem(STORAGE_KEY.THEME)).toBe(
      JSON.stringify('ocean'),
    );
  });

  it('selects an effect and persists it', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Snow' }));
    expect(useEffectStore.getState().selection).toBe('snow');
    expect(localStorage.getItem(STORAGE_KEY.EFFECT)).toContain('snow');
  });

  it('marks Auto as the active effect by default', () => {
    render(<SettingsPanel />, { wrapper });
    expect(
      screen.getByRole('button', { name: 'Auto' }).getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('switches effect selection to Off', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Off' }));
    expect(useEffectStore.getState().selection).toBe('off');
    expect(
      screen.getByRole('button', { name: 'Off' }).getAttribute('aria-pressed'),
    ).toBe('true');
  });
});
