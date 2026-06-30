import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { EmptyTimelineState } from '@/components/timeline/EmptyTimelineState';
import { NewMemoriesPill } from '@/components/timeline/NewMemoriesPill';
import i18n from '@/i18n';

afterEach(() => localStorage.clear());

describe('Timeline localization', () => {
  it.each(['vi', 'en'])('renders empty state in %s', async (lng) => {
    await i18n.changeLanguage(lng);
    render(
      <ThemeProvider>
        <EmptyTimelineState />
      </ThemeProvider>,
    );
    expect(
      screen.getByText(i18n.t('timeline:empty.title')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('timeline:empty.hint'))).toBeInTheDocument();
  });

  it('pluralizes the new-memories pill (en)', async () => {
    await i18n.changeLanguage('en');
    const { rerender } = render(
      <NewMemoriesPill count={1} onClick={() => {}} />,
    );
    expect(screen.getByText('1 new memory')).toBeInTheDocument();
    rerender(<NewMemoriesPill count={3} onClick={() => {}} />);
    expect(screen.getByText('3 new memories')).toBeInTheDocument();
  });
});
