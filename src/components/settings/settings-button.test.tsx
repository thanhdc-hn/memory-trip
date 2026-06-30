import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ReactNode } from 'react';

import { DEFAULT_SELECTION } from '@/components/effects/effect-utils';
import { ThemeProvider } from '@/components/theme/theme-provider';
import i18n from '@/i18n';
import { useEffectStore } from '@/store/effect.store';
import { STORAGE_KEY } from '@/utils/constants';

import { SettingsButton } from './settings-button';

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

describe('SettingsButton', () => {
  it('opens the settings modal with the three pickers', () => {
    render(<SettingsButton />, { wrapper });
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // A control from each section is present.
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ocean' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Snow' })).toBeInTheDocument();
  });

  it('changes language and theme from inside the modal', () => {
    render(<SettingsButton />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    fireEvent.click(screen.getByRole('button', { name: 'Forest' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('forest');

    fireEvent.click(screen.getByRole('button', { name: 'Tiếng Việt' }));
    expect(i18n.language).toBe('vi');
  });

  it('closes via the close button', () => {
    render(<SettingsButton />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the first-run hint, then dismisses it once settings are opened', () => {
    render(<SettingsButton />, { wrapper });
    expect(screen.getByText('Settings live here')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.queryByText('Settings live here')).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY.SETTINGS_HINT_SEEN)).toBe('true');
  });

  it('does not show the hint when it was already dismissed', () => {
    localStorage.setItem(STORAGE_KEY.SETTINGS_HINT_SEEN, 'true');
    render(<SettingsButton />, { wrapper });
    expect(screen.queryByText('Settings live here')).toBeNull();
  });

  it('moves focus into the dialog when opened (focus trap)', async () => {
    render(<SettingsButton />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    const dialog = screen.getByRole('dialog');
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    );
  });
});
