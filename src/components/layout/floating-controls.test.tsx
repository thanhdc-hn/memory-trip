import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import i18n from '@/i18n';

import { FloatingControls } from './floating-controls';

beforeEach(async () => {
  await i18n.changeLanguage('vi');
});

afterEach(() => localStorage.clear());

describe('FloatingControls', () => {
  it('toggles language between vi and en', () => {
    render(<FloatingControls />);
    const langBtn = screen.getByLabelText('Đổi ngôn ngữ');
    expect(langBtn).toHaveTextContent('en');

    fireEvent.click(langBtn);
    expect(i18n.language).toBe('en');
    expect(document.documentElement.getAttribute('data-lang')).toBe('en');
  });
});
