import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEY } from '@/utils/constants';

async function loadI18n() {
  vi.resetModules();
  return (await import('./index')).default;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-lang');
});

afterEach(() => {
  localStorage.clear();
});

describe('i18n init', () => {
  it('defaults to vi when nothing is stored', async () => {
    const i18n = await loadI18n();
    expect(i18n.language).toBe('vi');
    expect(document.documentElement.getAttribute('data-lang')).toBe('vi');
  });

  it('reads the stored language', async () => {
    localStorage.setItem(STORAGE_KEY.LANGUAGE, JSON.stringify('en'));
    const i18n = await loadI18n();
    expect(i18n.language).toBe('en');
    expect(document.documentElement.getAttribute('data-lang')).toBe('en');
  });

  it('ignores an unsupported stored language and falls back to vi', async () => {
    localStorage.setItem(STORAGE_KEY.LANGUAGE, JSON.stringify('fr'));
    const i18n = await loadI18n();
    expect(i18n.language).toBe('vi');
  });

  it('persists and applies the language on change', async () => {
    const i18n = await loadI18n();
    await i18n.changeLanguage('en');
    expect(localStorage.getItem(STORAGE_KEY.LANGUAGE)).toBe(
      JSON.stringify('en'),
    );
    expect(document.documentElement.getAttribute('data-lang')).toBe('en');
  });
});
