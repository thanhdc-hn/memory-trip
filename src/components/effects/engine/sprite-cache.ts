/**
 * Offscreen emoji sprite cache.
 *
 * Drawing an emoji with `ctx.fillText` every frame re-rasterizes the glyph and
 * is a known canvas hotspot. Instead we rasterize each (glyph, size, dpr) once
 * to a small offscreen canvas and the renderer blits it with `drawImage`.
 *
 * Safe under jsdom: if a 2D context isn't available the sprite canvas is still
 * created and cached (drawing is skipped), so callers get a stable element.
 */
const cache = new Map<string, HTMLCanvasElement>();

const key = (glyph: string, size: number, dpr: number) =>
  `${glyph}|${size}|${dpr}`;

/** Acquire a 2D context, tolerating environments (jsdom) where it's absent. */
function get2dContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  try {
    return canvas.getContext('2d');
  } catch {
    return null;
  }
}

export function getEmojiSprite(
  glyph: string,
  size: number,
  dpr = 1,
): HTMLCanvasElement {
  const cacheKey = key(glyph, size, dpr);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  const side = Math.max(1, Math.ceil(size * dpr));
  canvas.width = side;
  canvas.height = side;

  const ctx = get2dContext(canvas);
  if (ctx) {
    ctx.clearRect(0, 0, side, side);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${size * dpr * 0.9}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText(glyph, side / 2, side / 2);
  }

  cache.set(cacheKey, canvas);
  return canvas;
}

/** Clear the sprite cache (used by tests and on teardown). */
export function clearSpriteCache(): void {
  cache.clear();
}
