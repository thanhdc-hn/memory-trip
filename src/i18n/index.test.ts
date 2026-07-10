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
  beforeEach(() => {
    vi.stubGlobal('navigator', { language: 'en-US' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to browser language when nothing is stored', async () => {
    vi.stubGlobal('navigator', { language: 'ja-JP' });
    const i18n = await loadI18n();
    expect(i18n.language).toBe('ja');
    expect(document.documentElement.getAttribute('data-lang')).toBe('ja');
  });

  it('defaults to en when browser language is not supported', async () => {
    vi.stubGlobal('navigator', { language: 'fr-FR' });
    const i18n = await loadI18n();
    expect(i18n.language).toBe('en');
  });

  it('reads the stored language even if browser language is different', async () => {
    vi.stubGlobal('navigator', { language: 'ja-JP' });
    localStorage.setItem(STORAGE_KEY.LANGUAGE, JSON.stringify('vi'));
    const i18n = await loadI18n();
    expect(i18n.language).toBe('vi');
    expect(document.documentElement.getAttribute('data-lang')).toBe('vi');
  });

  it('ignores an unsupported stored language and falls back to browser language', async () => {
    vi.stubGlobal('navigator', { language: 'ja-JP' });
    localStorage.setItem(STORAGE_KEY.LANGUAGE, JSON.stringify('fr'));
    const i18n = await loadI18n();
    expect(i18n.language).toBe('ja');
  });

  it('persists and applies the language on change', async () => {
    const i18n = await loadI18n();
    await i18n.changeLanguage('en');
    expect(localStorage.getItem(STORAGE_KEY.LANGUAGE)).toBe(
      JSON.stringify('en'),
    );
    expect(document.documentElement.getAttribute('data-lang')).toBe('en');

    await i18n.changeLanguage('ja');
    expect(localStorage.getItem(STORAGE_KEY.LANGUAGE)).toBe(
      JSON.stringify('ja'),
    );
    expect(document.documentElement.getAttribute('data-lang')).toBe('ja');
  });
});
