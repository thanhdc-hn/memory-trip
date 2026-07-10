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
    fireEvent.click(screen.getByRole('combobox', { name: /language/i }));
    fireEvent.click(screen.getByRole('option', { name: /Tiếng Việt/i }));
    expect(i18n.language).toBe('vi');
    expect(document.documentElement.getAttribute('data-lang')).toBe('vi');
  });

  it('selects a theme and persists it', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('combobox', { name: /theme/i }));
    fireEvent.click(screen.getByRole('option', { name: /Ocean/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
    expect(localStorage.getItem(STORAGE_KEY.THEME)).toBe(
      JSON.stringify('ocean'),
    );
  });

  it('selects an effect and persists it', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('combobox', { name: /effects/i }));
    fireEvent.click(screen.getByRole('option', { name: /Snow/i }));
    expect(useEffectStore.getState().selection).toBe('snow');
    expect(localStorage.getItem(STORAGE_KEY.EFFECT)).toContain('snow');
  });

  it('selects the Spring leaves effect', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('combobox', { name: /effects/i }));
    fireEvent.click(screen.getByRole('option', { name: /Spring leaves/i }));
    expect(useEffectStore.getState().selection).toBe('spring-leaves');
    expect(localStorage.getItem(STORAGE_KEY.EFFECT)).toContain('spring-leaves');
  });

  it('selects the Night theme', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('combobox', { name: /theme/i }));
    fireEvent.click(screen.getByRole('option', { name: /Night/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('night');
    expect(localStorage.getItem(STORAGE_KEY.THEME)).toBe(
      JSON.stringify('night'),
    );
  });

  it('marks Auto as the active effect by default', () => {
    render(<SettingsPanel />, { wrapper });
    // Check the text content of the combobox (trigger)
    expect(
      screen.getByRole('combobox', { name: /effects/i }),
    ).toHaveTextContent(/Auto/i);
  });

  it('switches effect selection to Off', () => {
    render(<SettingsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('combobox', { name: /effects/i }));
    fireEvent.click(screen.getByRole('option', { name: /Off/i }));
    expect(useEffectStore.getState().selection).toBe('off');
    expect(
      screen.getByRole('combobox', { name: /effects/i }),
    ).toHaveTextContent(/Off/i);
  });
});
