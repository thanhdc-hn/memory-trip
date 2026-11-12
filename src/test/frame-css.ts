import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect } from 'vitest';

/** Test helper: reads the per-theme polaroid frame tokens straight from `style.css`. */
export const css = readFileSync(
  resolve(process.cwd(), 'src/style.css'),
  'utf8',
);

/** Summer is the `:root` default; every other mood has its own override block. */
export function getFrameBlock(id: string): string {
  if (id === 'summer') {
    const root = css.match(/:root\s*\{([^}]*)\}/);
    expect(root, 'missing :root block').not.toBeNull();
    return root![1];
  }
  const start = css.indexOf('── Polaroid frames');
  expect(start, 'missing "Polaroid frames" section').toBeGreaterThan(-1);
  const block = css
    .slice(start)
    .match(new RegExp(`\\[data-theme='${id}'\\]\\s*\\{([^}]*)\\}`));
  expect(block, `missing polaroid frame block for "${id}"`).not.toBeNull();
  return block![1];
}

export function readToken(block: string, token: string): string | undefined {
  return block.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1].trim();
}

/**
 * A custom-property reader for a mood, emulating the cascade: the mood's own
 * block wins over the `:root` (Summer) defaults. Stands in for
 * `getComputedStyle(document.documentElement).getPropertyValue`, which jsdom
 * cannot resolve from a stylesheet.
 */
export function frameTokenReader(id: string): (token: string) => string {
  const root = getFrameBlock('summer');
  const own = id === 'summer' ? '' : getFrameBlock(id);
  return (token) => readToken(own, token) ?? readToken(root, token) ?? '';
}
