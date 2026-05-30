import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CreatePostForm } from '@/components/posts/CreatePostForm';
import i18n from '@/i18n';

function renderForm() {
  return render(
    <CreatePostForm
      teamId="t1"
      onSuccess={() => {}}
      onOptimisticPost={() => {}}
      onRollback={() => {}}
    />,
  );
}

afterEach(() => localStorage.clear());

describe('Posts localization', () => {
  it.each(['vi', 'en'])('renders create form in %s', async (lng) => {
    await i18n.changeLanguage(lng);
    renderForm();
    expect(screen.getByText(i18n.t('posts:submit'))).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(i18n.t('posts:captionPlaceholder')),
    ).toBeInTheDocument();
  });
});
