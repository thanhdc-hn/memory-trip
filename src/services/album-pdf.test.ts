import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Post } from '@/services/posts.service';
import type { PublicTeam } from '@/services/public-team.service';
import { createCanvasMock } from '@/test/canvas-mock';

import { DEFAULT_FRAME, type PolaroidFrame } from './album-frame';
import { generateAlbumPdf } from './album-pdf';

vi.mock('jspdf', () => ({
  jsPDF: class {
    addImage = vi.fn();
    addPage = vi.fn();
    output = vi.fn(() => new Blob(['pdf']));
  },
}));

const team: PublicTeam = {
  id: 'team-1',
  name: 'Da Nang 2026',
  invite_code: 'abc',
  is_locked: false,
  has_password: false,
};

// Even last hex digit → washi tape, odd → emoji sticker (see getFrameDecoration).
const TAPE_ID = 'aaaaaaaa-0000-0000-0000-00000000000a';
const STICKER_ID = 'aaaaaaaa-0000-0000-0000-00000000000b';

function note(id: string, caption: string): Post {
  return {
    id,
    team_id: team.id,
    author_name: 'An',
    caption,
    image_path: null,
    created_at: '2026-07-01T10:00:00.000Z',
  };
}

const frame: PolaroidFrame = {
  ...DEFAULT_FRAME,
  paper: '#1c2638',
  ink: '#e5e7eb',
  inkMuted: '#9ca3af',
  edge: 'rgba(34, 197, 94, 0.45)',
  tape: 'tapecolor',
  shadows: [{ offsetX: 0, offsetY: 4, blur: 10, color: 'shadowcolor' }],
  sticker: '🌙',
};

describe('generateAlbumPdf polaroid frames', () => {
  let mock: ReturnType<typeof createCanvasMock>;

  beforeEach(() => {
    mock = createCanvasMock();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      (() => mock.ctx) as never,
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/jpeg;base64,AA',
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('style');
  });

  it('draws every card on the theme paper with the theme ink', async () => {
    const posts = [note(TAPE_ID, 'Bien xanh'), note(STICKER_ID, 'Nang vang')];
    await generateAlbumPdf(team, posts, new Map(), null, null, frame);

    const paperFills = mock
      .named('fill')
      .filter((c) => c.state.fillStyle === frame.paper);
    // shadow pass + paper pass per card
    expect(paperFills).toHaveLength(posts.length * 2);
    expect(
      mock.named('fill').some((c) => c.state.shadowColor === 'shadowcolor'),
    ).toBe(true);

    const texts = mock.named('fillText');
    for (const caption of ['Bien xanh', 'Nang vang']) {
      const drawn = texts.find((c) => c.args[0] === caption);
      expect(drawn?.state.fillStyle, caption).toBe(frame.ink);
    }
    const metas = texts.filter((c) => String(c.args[0]).startsWith('@An'));
    expect(metas).toHaveLength(posts.length);
    expect(metas.every((c) => c.state.fillStyle === frame.inkMuted)).toBe(true);
  });

  it('no longer uses the fixed white card, grey ink or black shadow', async () => {
    await generateAlbumPdf(
      team,
      [note(TAPE_ID, 'Bien xanh')],
      new Map(),
      null,
      null,
      frame,
    );

    const fillStyles = mock.named('fill').map((c) => c.state.fillStyle);
    expect(fillStyles).not.toContain('#ffffff');
    expect(fillStyles).not.toContain('#fffdf5');

    // Only the memory cards: the cover is not a polaroid and keeps its own text colours.
    const cardText = mock
      .named('fillText')
      .filter(
        (c) => c.args[0] === 'Bien xanh' || String(c.args[0]).startsWith('@An'),
      )
      .map((c) => c.state.fillStyle);
    expect(cardText).toHaveLength(2);
    expect(cardText).not.toContain('#4a4a4a');
    expect(cardText).not.toContain('#9a9a9a');
  });

  it('alternates washi tape and the theme sticker by post id, like the timeline', async () => {
    await generateAlbumPdf(
      team,
      [note(TAPE_ID, 'Bien xanh'), note(STICKER_ID, 'Nang vang')],
      new Map(),
      null,
      null,
      frame,
    );

    const tapes = mock
      .named('fillRect')
      .filter((c) => c.state.fillStyle === frame.tape);
    const stickers = mock.named('fillText').filter((c) => c.args[0] === '🌙');
    expect(tapes).toHaveLength(1);
    // 4 outline passes + 1 final pass
    expect(stickers).toHaveLength(5);
  });

  it('reads the frame of the active theme when none is passed', async () => {
    const root = document.documentElement;
    root.style.setProperty('--frame-paper', '#abcdef');
    root.style.setProperty('--frame-ink', '#123456');
    root.style.setProperty('--theme-emoji', JSON.stringify('🌸'));

    await generateAlbumPdf(team, [note(STICKER_ID, 'Hoa anh dao')], new Map());

    expect(
      mock.named('fill').some((c) => c.state.fillStyle === '#abcdef'),
    ).toBe(true);
    const caption = mock
      .named('fillText')
      .find((c) => c.args[0] === 'Hoa anh dao');
    expect(caption?.state.fillStyle).toBe('#123456');
    expect(mock.named('fillText').some((c) => c.args[0] === '🌸')).toBe(true);
  });

  it('still produces a cover plus one page per two memories', async () => {
    const posts = [
      note(TAPE_ID, 'a'),
      note(STICKER_ID, 'b'),
      note('bbbbbbbb-0000-0000-0000-00000000000c', 'c'),
    ];
    const { pages, blob } = await generateAlbumPdf(
      team,
      posts,
      new Map(),
      null,
      null,
      frame,
    );
    // cover + page 1 (row of 2 + row of 1)
    expect(pages).toHaveLength(2);
    expect(blob).toBeInstanceOf(Blob);
  });
});
