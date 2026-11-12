import { describe, expect, it } from 'vitest';

import { css, getFrameBlock, readToken } from '@/test/frame-css';

import { THEMES } from './themes';

const REQUIRED_TOKENS = [
  '--frame-paper',
  '--frame-ink',
  '--frame-ink-muted',
  '--frame-edge',
  '--frame-shadow',
  '--frame-tape',
] as const;

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('themed polaroid frames', () => {
  it.each(THEMES.map((t) => t.id))(
    '%s defines every required frame token',
    (id) => {
      const block = getFrameBlock(id);
      for (const token of REQUIRED_TOKENS) {
        expect(
          readToken(block, token),
          `${id} is missing ${token}`,
        ).toBeTruthy();
      }
    },
  );

  it.each(THEMES.map((t) => t.id))(
    '%s keeps caption text readable on its paper (WCAG AA)',
    (id) => {
      const block = getFrameBlock(id);
      const paper = readToken(block, '--frame-paper')!;
      const ink = readToken(block, '--frame-ink')!;
      const muted = readToken(block, '--frame-ink-muted')!;

      expect(paper).toMatch(/^#[0-9a-f]{6}$/i);
      expect(contrast(ink, paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(muted, paper)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('gives themes distinct frames instead of one shared look', () => {
    const papers = new Set(
      THEMES.map((t) => readToken(getFrameBlock(t.id), '--frame-paper')),
    );
    expect(papers.size).toBeGreaterThan(THEMES.length / 2);
  });

  it('registers the paper colors with Tailwind so bg-paper resolves', () => {
    expect(css).toMatch(/--color-paper:\s*var\(--paper\)/);
    expect(css).toMatch(/--color-paper-text:\s*var\(--paper-text\)/);
    expect(css).toMatch(
      /--color-paper-text-muted:\s*var\(--paper-text-muted\)/,
    );
  });
});
