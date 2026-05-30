import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import i18n from '@/i18n';

import NotFound from './not-found';

afterEach(() => localStorage.clear());

describe('NotFound localization', () => {
  it.each(['vi', 'en'])('renders in %s', async (lng) => {
    await i18n.changeLanguage(lng);
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByText(i18n.t('misc:notFound.title'))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('misc:notFound.backHome')),
    ).toBeInTheDocument();
  });
});
