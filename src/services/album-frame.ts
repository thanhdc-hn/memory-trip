import type { FrameDecoration } from '@/utils/polaroid';

/**
 * Themed polaroid frame for the PDF album.
 *
 * The web frame (`.polaroid-frame` in `style.css`) is driven by `--frame-*` CSS
 * custom properties. The album is rasterised on a canvas, so it reads the very
 * same tokens from the active mood and re-draws the frame with canvas
 * primitives — a new theme needs no PDF code, only its `--frame-*` block.
 *
 * Only the gradient shapes the themes actually use are understood (dot grid,
 * elliptical vignette, angled sheen). Anything else is skipped, so an exotic
 * `--frame-texture` degrades to a plain paper margin instead of failing.
 */

/** Rendered width (CSS px) of a polaroid on the timeline. CSS metrics (shadow,
 * tape, radius, texture tile…) are scaled from this to the PDF canvas. */
export const WEB_FRAME_WIDTH = 320;

export interface FrameShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface GradientStop {
  /** Position along the gradient, 0..1. */
  at: number;
  color: string;
}

export type FrameTexture =
  | {
      kind: 'dots';
      color: string;
      radius: number;
      tileW: number;
      tileH: number;
    }
  | {
      kind: 'radial';
      /** Radii and centre as fractions of the frame width / height. */
      rx: number;
      ry: number;
      cx: number;
      cy: number;
      stops: GradientStop[];
    }
  | { kind: 'linear'; angle: number; stops: GradientStop[] };

export interface PolaroidFrame {
  paper: string;
  ink: string;
  inkMuted: string;
  edge: string;
  tape: string;
  /** Corner radius in CSS px. */
  radius: number;
  shadows: FrameShadow[];
  texture: FrameTexture | null;
  /** The mood's accent emoji, used by the `sticker` decoration. */
  sticker: string | null;
}

export interface FrameRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Summer — mirrors the `:root` defaults in `style.css`. */
export const DEFAULT_FRAME: PolaroidFrame = {
  paper: '#ffffff',
  ink: '#1f2937',
  inkMuted: '#4b5563',
  edge: 'rgba(135, 206, 235, 0.4)',
  tape: 'rgba(135, 206, 235, 0.55)',
  radius: 4,
  shadows: [{ offsetX: 0, offsetY: 4, blur: 10, color: 'rgba(0, 0, 0, 0.1)' }],
  texture: null,
  sticker: null,
};

// ── Parsing ────────────────────────────────────────────────────────────────

/** Splits on `separator`, ignoring any inside parentheses (e.g. `rgba(0,0,0)`). */
function splitTopLevel(value: string, separator: RegExp): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0 && separator.test(ch)) {
      if (current.trim()) parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** `"4px"` / `"4"` → 4. */
function toLength(token: string): number | null {
  const m = token.match(/^(-?\d*\.?\d+)(?:px)?$/i);
  return m ? parseFloat(m[1]) : null;
}

/** `"55%"` → 0.55; a bare `0` → 0; anything else → null. */
function toFraction(token: string): number | null {
  const m = token.match(/^(-?\d*\.?\d+)(%)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (m[2]) return n / 100;
  return n === 0 ? 0 : null;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Understands the colour forms CSS minifiers emit (hex, rgb[a], 3/4/6/8 digits). */
function parseColor(color: string): Rgba | null {
  const value = color.trim().toLowerCase();
  const hex = value.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    let digits = hex[1];
    if (digits.length <= 4) {
      digits = [...digits].map((d) => d + d).join('');
    }
    const n = (i: number) => parseInt(digits.slice(i, i + 2), 16);
    return {
      r: n(0),
      g: n(2),
      b: n(4),
      a: digits.length === 8 ? n(6) / 255 : 1,
    };
  }
  const fn = value.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%)?)?\s*\)$/,
  );
  if (fn) {
    const alpha =
      fn[4] === undefined ? 1 : parseFloat(fn[4]) / (fn[5] ? 100 : 1);
    return {
      r: parseFloat(fn[1]),
      g: parseFloat(fn[2]),
      b: parseFloat(fn[3]),
      a: alpha,
    };
  }
  return null;
}

function isTransparent(color: string): boolean {
  return color.trim().toLowerCase() === 'transparent'
    ? true
    : parseColor(color)?.a === 0;
}

/** Same colour, fully transparent — so gradients fade out without darkening
 * (canvas interpolates un-premultiplied, unlike CSS). */
function withZeroAlpha(color: string): string {
  const c = parseColor(color);
  return c ? `rgba(${c.r}, ${c.g}, ${c.b}, 0)` : 'rgba(0, 0, 0, 0)';
}

/**
 * Parses a CSS `box-shadow` list (`0 4px 10px rgba(…), 0 0 14px #fff`).
 * Inset shadows and entries without a colour are ignored.
 */
export function parseShadows(value: string): FrameShadow[] {
  const shadows: FrameShadow[] = [];
  for (const entry of splitTopLevel(value, /,/)) {
    const lengths: number[] = [];
    let color: string | null = null;
    let inset = false;
    for (const part of splitTopLevel(entry, /\s/)) {
      const length = toLength(part);
      if (length !== null) lengths.push(length);
      else if (part.toLowerCase() === 'inset') inset = true;
      else color = part;
    }
    if (inset || color === null || lengths.length < 2) continue;
    shadows.push({
      offsetX: lengths[0],
      offsetY: lengths[1],
      blur: Math.max(0, lengths[2] ?? 0),
      color,
    });
  }
  return shadows;
}

function parseStops(args: string[]): GradientStop[] | null {
  if (args.length < 2) return null;
  const raw: { color: string; at: number | undefined }[] = [];
  for (const arg of args) {
    const parts = splitTopLevel(arg, /\s/);
    if (parts.length === 0 || parts.length > 2) return null;
    const at = parts[1] === undefined ? undefined : toFraction(parts[1]);
    if (at === null) return null;
    raw.push({ color: parts[0], at });
  }
  raw[0].at ??= 0;
  raw[raw.length - 1].at ??= 1;

  const base = raw.find((s) => !isTransparent(s.color))?.color;
  if (base === undefined) return null;

  const stops: GradientStop[] = [];
  for (const { color, at } of raw) {
    if (at === undefined) return null;
    stops.push({
      at: Math.min(1, Math.max(0, at)),
      color: isTransparent(color) ? withZeroAlpha(base) : color,
    });
  }
  return stops;
}

function parseTile(size: string): [number, number] | null {
  const parts = size.trim().split(/\s+/).map(toLength);
  const [w, h = w] = parts;
  if (w === null || w === undefined || h === null || w <= 0 || h <= 0) {
    return null;
  }
  return [w, h];
}

/**
 * Parses `--frame-texture` (+ `--frame-texture-size`) into a drawable
 * description. Returns null for `none` and for gradient shapes it does not know.
 */
export function parseTexture(texture: string, size = ''): FrameTexture | null {
  const match = texture
    .trim()
    .match(/^(radial|linear)-gradient\(([\s\S]*)\)$/i);
  if (!match) return null;

  const args = splitTopLevel(match[2], /,/);
  const first = args[0] ?? '';

  if (match[1].toLowerCase() === 'linear') {
    const angle = first.match(/^(-?\d*\.?\d+)deg$/i);
    const stops = angle ? parseStops(args.slice(1)) : null;
    if (!angle || !stops) return null;
    return { kind: 'linear', angle: parseFloat(angle[1]), stops };
  }

  // `radial-gradient(<rx> <ry> at <cx> <cy>, …stops)` — an elliptical vignette.
  const geometry = first.match(
    /^(\d*\.?\d+)%\s+(\d*\.?\d+)%\s+at\s+(\S+)\s+(\S+)$/i,
  );
  if (geometry) {
    const cx = toFraction(geometry[3]);
    const cy = toFraction(geometry[4]);
    const stops = parseStops(args.slice(1));
    if (cx === null || cy === null || !stops) return null;
    return {
      kind: 'radial',
      rx: parseFloat(geometry[1]) / 100,
      ry: parseFloat(geometry[2]) / 100,
      cx,
      cy,
      stops,
    };
  }

  // `radial-gradient(<color> <r>, transparent <r>)` tiled by the size — a dot grid.
  const head = splitTopLevel(first, /\s/);
  const tile = parseTile(size);
  if (args.length === 2 && head.length === 2 && tile) {
    const radius = toLength(head[1]);
    const tail = splitTopLevel(args[1], /\s/)[0];
    if (radius !== null && radius > 0 && isTransparent(tail)) {
      return {
        kind: 'dots',
        color: head[0],
        radius,
        tileW: tile[0],
        tileH: tile[1],
      };
    }
  }
  return null;
}

/** `'"🌸"'` (the JSON string `applyTheme` publishes) → `🌸`. */
function parseEmoji(value: string): string | null {
  const raw = value.trim();
  if (!raw || raw === 'none') return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'string' && parsed ? parsed : null;
  } catch {
    return raw.replace(/^["']|["']$/g, '') || null;
  }
}

/**
 * Builds a frame from a custom-property reader. Missing tokens fall back to the
 * Summer defaults so a half-loaded stylesheet still yields a usable frame.
 */
export function parsePolaroidFrame(
  read: (token: string) => string,
): PolaroidFrame {
  const token = (name: string, fallback: string) =>
    read(name).trim() || fallback;

  const shadowValue = read('--frame-shadow').trim();
  const radius = toLength(read('--frame-radius').trim());

  return {
    paper: token('--frame-paper', DEFAULT_FRAME.paper),
    ink: token('--frame-ink', DEFAULT_FRAME.ink),
    inkMuted: token('--frame-ink-muted', DEFAULT_FRAME.inkMuted),
    edge: token('--frame-edge', DEFAULT_FRAME.edge),
    tape: token('--frame-tape', DEFAULT_FRAME.tape),
    radius: radius ?? DEFAULT_FRAME.radius,
    shadows: shadowValue ? parseShadows(shadowValue) : DEFAULT_FRAME.shadows,
    texture: parseTexture(
      read('--frame-texture'),
      read('--frame-texture-size'),
    ),
    sticker: parseEmoji(read('--theme-emoji')),
  };
}

/** The frame of the mood currently applied to the document. */
export function readPolaroidFrame(
  root: HTMLElement = document.documentElement,
): PolaroidFrame {
  const styles = getComputedStyle(root);
  return parsePolaroidFrame((name) => styles.getPropertyValue(name));
}

// ── Painting ───────────────────────────────────────────────────────────────

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function addStops(gradient: CanvasGradient, stops: GradientStop[]) {
  for (const { at, color } of stops) gradient.addColorStop(at, color);
}

function paintTexture(
  ctx: CanvasRenderingContext2D,
  texture: FrameTexture,
  { left, top, width, height }: FrameRect,
  scale: number,
) {
  if (texture.kind === 'dots') {
    const tileW = texture.tileW * scale;
    const tileH = texture.tileH * scale;
    const radius = texture.radius * scale;
    if (!(tileW > 0 && tileH > 0 && radius > 0)) return;
    ctx.fillStyle = texture.color;
    ctx.beginPath();
    for (let y = top + tileH / 2; y < top + height; y += tileH) {
      for (let x = left + tileW / 2; x < left + width; x += tileW) {
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    return;
  }

  if (texture.kind === 'radial') {
    const sx = texture.rx * width;
    const sy = texture.ry * height;
    if (!(sx > 0 && sy > 0)) return;
    const cx = left + texture.cx * width;
    const cy = top + texture.cy * height;
    // A canvas radial gradient is circular; scale the space to get an ellipse.
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    addStops(gradient, texture.stops);
    ctx.fillStyle = gradient;
    ctx.fillRect((left - cx) / sx, (top - cy) / sy, width / sx, height / sy);
    return;
  }

  // CSS angles: 0deg points up, 90deg right; the gradient line spans the box.
  const angle = (texture.angle * Math.PI) / 180;
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const length = Math.abs(width * dx) + Math.abs(height * dy);
  const cx = left + width / 2;
  const cy = top + height / 2;
  const gradient = ctx.createLinearGradient(
    cx - (dx * length) / 2,
    cy - (dy * length) / 2,
    cx + (dx * length) / 2,
    cy + (dy * length) / 2,
  );
  addStops(gradient, texture.stops);
  ctx.fillStyle = gradient;
  ctx.fillRect(left, top, width, height);
}

/**
 * Paints the frame body — shadow, paper, margin texture and hairline edge —
 * into `rect` (in the caller's, possibly rotated, coordinate space). `scale`
 * converts the CSS px metrics of the frame tokens to canvas px.
 */
export function paintFrame(
  ctx: CanvasRenderingContext2D,
  frame: PolaroidFrame,
  rect: FrameRect,
  scale: number,
) {
  const { left, top, width, height } = rect;
  const radius = frame.radius * scale;

  // CSS paints the first shadow on top, so lay them down back to front.
  for (const shadow of [...frame.shadows].reverse()) {
    ctx.save();
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur * scale;
    ctx.shadowOffsetX = shadow.offsetX * scale;
    ctx.shadowOffsetY = shadow.offsetY * scale;
    ctx.fillStyle = frame.paper;
    roundRect(ctx, left, top, width, height, radius);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = frame.paper;
  roundRect(ctx, left, top, width, height, radius);
  ctx.fill();
  if (frame.texture) {
    ctx.clip();
    paintTexture(ctx, frame.texture, rect, scale);
  }
  ctx.restore();

  // The CSS border is drawn inside the box, so inset the stroke by half.
  const edge = Math.max(1, scale);
  ctx.save();
  ctx.strokeStyle = frame.edge;
  ctx.lineWidth = edge;
  roundRect(
    ctx,
    left + edge / 2,
    top + edge / 2,
    width - edge,
    height - edge,
    Math.max(0, radius - edge / 2),
  );
  ctx.stroke();
  ctx.restore();
}

function paintTape(
  ctx: CanvasRenderingContext2D,
  frame: PolaroidFrame,
  { left, top, width }: FrameRect,
  scale: number,
) {
  const w = 60 * scale;
  const h = 20 * scale;
  ctx.save();
  // 9px above the top edge, centred, tilted a few degrees.
  ctx.translate(left + width / 2, top + scale);
  ctx.rotate((-3 * Math.PI) / 180);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 3 * scale;
  ctx.shadowOffsetY = scale;
  ctx.fillStyle = frame.tape;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

const EMOJI_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

function paintSticker(
  ctx: CanvasRenderingContext2D,
  emoji: string,
  { left, top, width }: FrameRect,
  scale: number,
) {
  ctx.save();
  // Peeking out of the top-right corner, tilted the other way from the tape.
  ctx.translate(left + width - 8 * scale, top + 2 * scale);
  ctx.rotate((12 * Math.PI) / 180);
  ctx.font = `${24 * scale}px ${EMOJI_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // White die-cut outline, then a soft drop shadow — like the CSS sticker.
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 0;
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    ctx.shadowOffsetX = dx * scale;
    ctx.shadowOffsetY = dy * scale;
    ctx.fillText(emoji, 0, 0);
  }
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 3 * scale;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2 * scale;
  ctx.fillText(emoji, 0, 0);
  ctx.restore();
}

/**
 * Paints the corner decoration on top of the finished card: washi tape or the
 * mood's emoji sticker (falling back to tape when the mood has no emoji).
 */
export function paintDecoration(
  ctx: CanvasRenderingContext2D,
  frame: PolaroidFrame,
  rect: FrameRect,
  decoration: FrameDecoration | 'none',
  scale: number,
) {
  if (decoration === 'none') return;
  if (decoration === 'sticker' && frame.sticker) {
    paintSticker(ctx, frame.sticker, rect, scale);
  } else {
    paintTape(ctx, frame, rect, scale);
  }
}
