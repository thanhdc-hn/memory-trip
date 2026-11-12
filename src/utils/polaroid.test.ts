import { describe, expect, it } from 'vitest';

import { getFrameDecoration } from './polaroid';

describe('getFrameDecoration', () => {
  it('is deterministic for the same id', () => {
    const id = '3f2a9c1e-7b64-4d0a-9e55-1c2d3e4f5a6b';
    expect(getFrameDecoration(id)).toBe(getFrameDecoration(id));
  });

  it('uses tape for an even last hex digit and a sticker for an odd one', () => {
    expect(getFrameDecoration('aaaaaaaa-0000-0000-0000-00000000000a')).toBe(
      'tape',
    );
    expect(getFrameDecoration('aaaaaaaa-0000-0000-0000-00000000000b')).toBe(
      'sticker',
    );
  });

  it('mixes both decorations across ids', () => {
    const ids = Array.from(
      { length: 16 },
      (_, i) => `00000000-0000-0000-0000-00000000000${i.toString(16)}`,
    );
    const kinds = new Set(ids.map(getFrameDecoration));
    expect(kinds).toEqual(new Set(['tape', 'sticker']));
  });

  it('falls back to tape for ids that do not end in a hex digit', () => {
    expect(getFrameDecoration('')).toBe('tape');
    expect(getFrameDecoration('not-an-idz')).toBe('tape');
  });
});
