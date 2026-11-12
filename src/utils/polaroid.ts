export type FrameDecoration = 'tape' | 'sticker';

/**
 * Deterministically pick the corner decoration of a polaroid frame from a
 * post id, so a memory keeps the same look across renders and devices while
 * the timeline as a whole feels hand-arranged. Uses the last hex digit, which
 * is independent from the first digits that drive the frame rotation.
 */
export function getFrameDecoration(seed: string): FrameDecoration {
  const digit = parseInt(seed.slice(-1), 16);
  return Number.isNaN(digit) || digit % 2 === 0 ? 'tape' : 'sticker';
}
