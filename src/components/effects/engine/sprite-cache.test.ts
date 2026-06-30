import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearSpriteCache, getEmojiSprite } from './sprite-cache';

beforeEach(() => {
  // jsdom has no real 2D context; stub it to null so the cache exercises its
  // context-less path quietly (the renderer guards on a null context too).
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  clearSpriteCache();
  vi.restoreAllMocks();
});

describe('getEmojiSprite', () => {
  it('returns a canvas sized to size * dpr', () => {
    const sprite = getEmojiSprite('🍂', 20, 2);
    expect(sprite).toBeInstanceOf(HTMLCanvasElement);
    expect(sprite.width).toBe(40);
    expect(sprite.height).toBe(40);
  });

  it('returns the same cached instance for identical args', () => {
    const a = getEmojiSprite('🍂', 20, 2);
    const b = getEmojiSprite('🍂', 20, 2);
    expect(a).toBe(b);
  });

  it('returns distinct instances for different glyph / size / dpr', () => {
    const base = getEmojiSprite('🍂', 20, 2);
    expect(getEmojiSprite('🌸', 20, 2)).not.toBe(base);
    expect(getEmojiSprite('🍂', 24, 2)).not.toBe(base);
    expect(getEmojiSprite('🍂', 20, 1)).not.toBe(base);
  });

  it('rebuilds after the cache is cleared', () => {
    const a = getEmojiSprite('🍂', 20, 2);
    clearSpriteCache();
    expect(getEmojiSprite('🍂', 20, 2)).not.toBe(a);
  });
});
