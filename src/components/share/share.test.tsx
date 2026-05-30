import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ShareTeamModal } from '@/components/share/share-team-modal';
import i18n from '@/i18n';

const team = { name: 'Trip 2026', invite_code: 'abc' };

afterEach(() => localStorage.clear());

describe('Share modal localization', () => {
  it.each(['vi', 'en'])('renders in %s', async (lng) => {
    await i18n.changeLanguage(lng);
    render(<ShareTeamModal team={team} isOpen onClose={() => {}} />);
    expect(screen.getByText(i18n.t('share:title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('share:download'))).toBeInTheDocument();
  });
});
