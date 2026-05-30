import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import i18n from '@/i18n';

import Home from './home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

afterEach(() => localStorage.clear());

describe('Home localization', () => {
  it.each(['vi', 'en'])('renders %s strings', async (lng) => {
    await i18n.changeLanguage(lng);
    renderHome();
    expect(screen.getByText(i18n.t('home:recentTitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('home:howItWorks'))).toBeInTheDocument();
  });
});
