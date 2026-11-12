import { describe, expect, it } from 'vitest';

import { THEMES } from '@/components/theme/themes';
import { createCanvasMock } from '@/test/canvas-mock';
import { frameTokenReader, getFrameBlock, readToken } from '@/test/frame-css';

import {
  DEFAULT_FRAME,
  type PolaroidFrame,
  paintDecoration,
  paintFrame,
  parsePolaroidFrame,
  parseShadows,
  parseTexture,
} from './album-frame';

const RECT = { left: 0, top: 0, width: 100, height: 100 };

describe('parseShadows', () => {
  it('parses a single box-shadow', () => {
    expect(parseShadows('0 4px 10px rgba(0, 0, 0, 0.1)')).toEqual([
      { offsetX: 0, offsetY: 4, blur: 10, color: 'rgba(0, 0, 0, 0.1)' },
    ]);
  });

  it('parses a glow plus a drop shadow (commas inside rgba are kept)', () => {
    expect(
      parseShadows(
        '\n    0 0 14px rgba(34, 197, 94, 0.28), 0 4px 10px rgba(0, 0, 0, 0.45)',
      ),
    ).toEqual([
      { offsetX: 0, offsetY: 0, blur: 14, color: 'rgba(34, 197, 94, 0.28)' },
      { offsetX: 0, offsetY: 4, blur: 10, color: 'rgba(0, 0, 0, 0.45)' },
    ]);
  });

  it('understands minified colours', () => {
    expect(parseShadows('0 4px 10px #0000001a')).toEqual([
      { offsetX: 0, offsetY: 4, blur: 10, color: '#0000001a' },
    ]);
  });

  it('ignores inset shadows and `none`', () => {
    expect(parseShadows('inset 0 1px 2px #000')).toEqual([]);
    expect(parseShadows('none')).toEqual([]);
    expect(parseShadows('')).toEqual([]);
  });
});

describe('parseTexture', () => {
  it('parses a dot grid sized by --frame-texture-size', () => {
    expect(
      parseTexture(
        'radial-gradient(\n    rgba(255, 255, 255, 0.18) 1px,\n    transparent 1px\n  )',
        '18px 18px',
      ),
    ).toEqual({
      kind: 'dots',
      color: 'rgba(255, 255, 255, 0.18)',
      radius: 1,
      tileW: 18,
      tileH: 18,
    });
  });

  it('parses a minified dot grid', () => {
    expect(
      parseTexture('radial-gradient(#ffffff2e 1px,#0000 1px)', '22px'),
    ).toEqual({
      kind: 'dots',
      color: '#ffffff2e',
      radius: 1,
      tileW: 22,
      tileH: 22,
    });
  });

  it('parses an elliptical vignette and fades transparent stops in the same colour', () => {
    expect(
      parseTexture(
        'radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(180, 83, 9, 0.12))',
      ),
    ).toEqual({
      kind: 'radial',
      rx: 1.2,
      ry: 0.9,
      cx: 0.5,
      cy: 0,
      stops: [
        { at: 0.55, color: 'rgba(180, 83, 9, 0)' },
        { at: 1, color: 'rgba(180, 83, 9, 0.12)' },
      ],
    });
  });

  it('parses the textures exactly as the production CSS minifier emits them', () => {
    expect(
      parseTexture(
        'radial-gradient(#f472b629 1.2px, transparent 1.2px)',
        '14px 14px',
      ),
    ).toMatchObject({
      kind: 'dots',
      color: '#f472b629',
      radius: 1.2,
      tileW: 14,
    });
    expect(
      parseTexture(
        'radial-gradient(120% 90% at 50% 0%, transparent 55%, #b453091f)',
      ),
    ).toMatchObject({
      kind: 'radial',
      stops: [
        { at: 0.55, color: 'rgba(180, 83, 9, 0)' },
        { at: 1, color: '#b453091f' },
      ],
    });
    expect(
      parseTexture('linear-gradient(135deg, transparent 40%, #bae6fd59)'),
    ).toMatchObject({
      kind: 'linear',
      angle: 135,
      stops: [
        { at: 0.4, color: 'rgba(186, 230, 253, 0)' },
        { at: 1, color: '#bae6fd59' },
      ],
    });
  });

  it('accepts a unitless zero position (minified)', () => {
    const texture = parseTexture(
      'radial-gradient(120% 90% at 50% 0,#0000 55%,#b4530920)',
    );
    expect(texture).toMatchObject({ kind: 'radial', cx: 0.5, cy: 0 });
  });

  it('parses an angled sheen', () => {
    expect(
      parseTexture(
        'linear-gradient(\n    135deg,\n    transparent 40%,\n    rgba(186, 230, 253, 0.35)\n  )',
      ),
    ).toEqual({
      kind: 'linear',
      angle: 135,
      stops: [
        { at: 0.4, color: 'rgba(186, 230, 253, 0)' },
        { at: 1, color: 'rgba(186, 230, 253, 0.35)' },
      ],
    });
  });

  it('returns null for none, a dot grid without a tile size and unknown shapes', () => {
    expect(parseTexture('none')).toBeNull();
    expect(parseTexture('')).toBeNull();
    expect(
      parseTexture('radial-gradient(#fff 1px, transparent 1px)', 'auto'),
    ).toBeNull();
    expect(parseTexture('conic-gradient(red, blue)')).toBeNull();
    expect(parseTexture('linear-gradient(to right, red, blue)')).toBeNull();
  });
});

describe('parsePolaroidFrame', () => {
  it('falls back to the Summer defaults when no token is set', () => {
    expect(parsePolaroidFrame(() => '')).toEqual(DEFAULT_FRAME);
  });

  it('reads the sticker from the JSON string published by applyTheme', () => {
    const frame = parsePolaroidFrame((token) =>
      token === '--theme-emoji' ? JSON.stringify('🌸') : '',
    );
    expect(frame.sticker).toBe('🌸');
  });

  it('reads the radius in px', () => {
    const frame = parsePolaroidFrame((token) =>
      token === '--frame-radius' ? '10px' : '',
    );
    expect(frame.radius).toBe(10);
  });

  it.each(THEMES.map((t) => t.id))(
    '%s: builds a drawable frame from the real style.css',
    (id) => {
      const read = frameTokenReader(id);
      const frame = parsePolaroidFrame(read);
      const own = id === 'summer' ? getFrameBlock('summer') : getFrameBlock(id);

      expect(frame.paper).toBe(readToken(own, '--frame-paper'));
      expect(frame.ink).toBe(readToken(own, '--frame-ink'));
      expect(frame.inkMuted).toBe(readToken(own, '--frame-ink-muted'));
      expect(frame.tape).toBe(readToken(own, '--frame-tape'));
      expect(frame.shadows.length, `${id} shadow`).toBeGreaterThan(0);
      expect(frame.radius).toBeGreaterThan(0);

      // A theme texture the PDF cannot parse would silently vanish from the album.
      if (read('--frame-texture') !== 'none') {
        expect(frame.texture, `${id} texture is not drawable`).not.toBeNull();
      }
    },
  );
});

describe('paintFrame', () => {
  const base: PolaroidFrame = {
    ...DEFAULT_FRAME,
    paper: '#1c2638',
    edge: 'rgba(34, 197, 94, 0.45)',
    shadows: [
      { offsetX: 0, offsetY: 0, blur: 14, color: 'glow' },
      { offsetX: 0, offsetY: 4, blur: 10, color: 'dark' },
    ],
    texture: null,
  };

  it('fills the paper, with shadows laid down back to front and scaled', () => {
    const { ctx, named } = createCanvasMock();
    paintFrame(ctx, base, RECT, 2);

    const fills = named('fill');
    expect(fills.map((c) => c.state.shadowColor)).toEqual([
      'dark',
      'glow',
      undefined,
    ]);
    expect(fills.every((c) => c.state.fillStyle === '#1c2638')).toBe(true);
    expect(fills[0].state.shadowBlur).toBe(20);
    expect(fills[0].state.shadowOffsetY).toBe(8);
  });

  it('strokes a hairline edge in the frame colour', () => {
    const { ctx, named } = createCanvasMock();
    paintFrame(ctx, base, RECT, 2);

    const [stroke] = named('stroke');
    expect(stroke.state.strokeStyle).toBe('rgba(34, 197, 94, 0.45)');
    expect(stroke.state.lineWidth).toBe(2);
  });

  it('draws only the paper when the theme has no shadow', () => {
    const { ctx, named } = createCanvasMock();
    paintFrame(ctx, { ...base, shadows: [] }, RECT, 1);
    expect(named('fill')).toHaveLength(1);
  });

  it('tiles dots inside the clipped frame', () => {
    const { ctx, calls, named } = createCanvasMock();
    paintFrame(
      ctx,
      {
        ...base,
        texture: {
          kind: 'dots',
          color: 'dotcolor',
          radius: 1,
          tileW: 50,
          tileH: 50,
        },
      },
      RECT,
      1,
    );

    // 100x100 box, 50px tiles → 2 x 2 dots, drawn after the clip.
    const arcs = named('arc');
    expect(arcs).toHaveLength(4);
    expect(calls.findIndex((c) => c.name === 'clip')).toBeLessThan(
      calls.findIndex((c) => c.name === 'arc'),
    );
    expect(arcs[0].args.slice(0, 3)).toEqual([25, 25, 1]);
    expect(arcs[0].state.fillStyle).toBe('dotcolor');
  });

  it('does not loop forever on a degenerate tile size', () => {
    const { ctx, named } = createCanvasMock();
    paintFrame(
      ctx,
      {
        ...base,
        texture: {
          kind: 'dots',
          color: 'x',
          radius: 1,
          tileW: 0,
          tileH: 0,
        },
      },
      RECT,
      1,
    );
    expect(named('arc')).toHaveLength(0);
  });

  it('runs a 135deg sheen corner to corner', () => {
    const { ctx, named } = createCanvasMock();
    paintFrame(
      ctx,
      {
        ...base,
        texture: {
          kind: 'linear',
          angle: 135,
          stops: [
            { at: 0.4, color: 'a' },
            { at: 1, color: 'b' },
          ],
        },
      },
      RECT,
      1,
    );

    const [gradient] = named('createLinearGradient');
    const [x0, y0, x1, y1] = gradient.args as number[];
    expect(x0).toBeCloseTo(0);
    expect(y0).toBeCloseTo(0);
    expect(x1).toBeCloseTo(100);
    expect(y1).toBeCloseTo(100);
    expect(named('addColorStop').map((c) => c.args)).toEqual([
      [0.4, 'a'],
      [1, 'b'],
    ]);
  });

  it('scales the space to turn a radial gradient into an ellipse', () => {
    const { ctx, named } = createCanvasMock();
    paintFrame(
      ctx,
      {
        ...base,
        texture: {
          kind: 'radial',
          rx: 1.2,
          ry: 0.9,
          cx: 0.5,
          cy: 0,
          stops: [
            { at: 0.55, color: 'a' },
            { at: 1, color: 'b' },
          ],
        },
      },
      RECT,
      1,
    );

    expect(named('translate')[0].args).toEqual([50, 0]);
    expect(named('scale')[0].args).toEqual([120, 90]);
    expect(named('createRadialGradient')[0].args).toEqual([0, 0, 0, 0, 0, 1]);
  });
});

describe('paintDecoration', () => {
  const frame: PolaroidFrame = {
    ...DEFAULT_FRAME,
    tape: 'tapecolor',
    sticker: '🌸',
  };

  it('draws nothing for `none`', () => {
    const { ctx, calls } = createCanvasMock();
    paintDecoration(ctx, frame, RECT, 'none', 1);
    expect(calls).toHaveLength(0);
  });

  it('draws a washi tape strip in the theme tape colour', () => {
    const { ctx, named } = createCanvasMock();
    paintDecoration(ctx, frame, RECT, 'tape', 2);

    const [tape] = named('fillRect');
    expect(tape.state.fillStyle).toBe('tapecolor');
    expect(tape.args).toEqual([-60, -20, 120, 40]);
    expect(named('fillText')).toHaveLength(0);
  });

  it('draws the theme emoji as an outlined sticker', () => {
    const { ctx, named } = createCanvasMock();
    paintDecoration(ctx, frame, RECT, 'sticker', 1);

    const texts = named('fillText');
    expect(texts).toHaveLength(5);
    expect(texts.every((c) => c.args[0] === '🌸')).toBe(true);
    expect(
      texts.slice(0, 4).every((c) => c.state.shadowColor === '#ffffff'),
    ).toBe(true);
    expect(texts[4].state.shadowColor).toBe('rgba(0, 0, 0, 0.25)');
    expect(named('fillRect')).toHaveLength(0);
  });

  it('falls back to tape when the theme has no emoji', () => {
    const { ctx, named } = createCanvasMock();
    paintDecoration(ctx, { ...frame, sticker: null }, RECT, 'sticker', 1);
    expect(named('fillRect')).toHaveLength(1);
    expect(named('fillText')).toHaveLength(0);
  });
});
