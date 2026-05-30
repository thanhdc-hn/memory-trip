import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import { ArchivedTeamState } from '@/components/join/ArchivedTeamState';
import { InvalidTeamState } from '@/components/join/InvalidTeamState';
import i18n from '@/i18n';

afterEach(() => localStorage.clear());

describe('Join states localization', () => {
  it.each(['vi', 'en'])('renders invalid state in %s', async (lng) => {
    await i18n.changeLanguage(lng);
    render(
      <MemoryRouter>
        <InvalidTeamState />
      </MemoryRouter>,
    );
    expect(screen.getByText(i18n.t('join:invalid.title'))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('join:invalid.backHome')),
    ).toBeInTheDocument();
  });

  it.each(['vi', 'en'])('renders archived state in %s', async (lng) => {
    await i18n.changeLanguage(lng);
    render(<ArchivedTeamState name="Trip 2026" />);
    expect(screen.getByText(i18n.t('join:archived.label'))).toBeInTheDocument();
    expect(screen.getByText('Trip 2026')).toBeInTheDocument();
  });
});
