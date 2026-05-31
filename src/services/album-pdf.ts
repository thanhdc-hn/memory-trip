import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';

import i18n from '@/i18n';
import type { Post } from '@/services/posts.service';
import type { PublicTeam } from '@/services/public-team.service';

// A4 portrait in mm and the canvas raster scale (px per mm).
const A4_W = 210;
const A4_H = 297;
const PX = 5; // 1050 x 1485 px per page — crisp enough, mobile-safe
const PAGE_W = A4_W * PX;
const PAGE_H = A4_H * PX;
const MARGIN = 12 * PX;
const GAP = 8 * PX;
const PAPER = '#FFFDF9';

const CELL_W = (PAGE_W - 2 * MARGIN - GAP) / 2;
const CELL_H = (PAGE_H - 2 * MARGIN - GAP) / 2;

// Indie Flower has no Vietnamese glyphs; Patrick Hand does. Load both and pick
// the family by language so captions/labels render correct diacritics.
const FONTS = [
  { family: 'Indie Flower', url: '/fonts/IndieFlower-Regular.ttf' },
  { family: 'Patrick Hand', url: '/fonts/PatrickHand-Regular.ttf' },
];
let fontReady = false;
async function ensureFont() {
  if (fontReady || typeof FontFace === 'undefined') return;
  try {
    await Promise.all(
      FONTS.map(async ({ family, url }) => {
        const face = new FontFace(family, `url(${url})`);
        await face.load();
        document.fonts.add(face);
      }),
    );
    fontReady = true;
  } catch (err) {
    console.error('Album font failed to load, using fallback:', err);
  }
}

function handFamily(): string {
  return i18n.language === 'vi' ? 'Patrick Hand' : 'Indie Flower';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const hand = (size: number) => `${size}px "${handFamily()}", cursive`;

function rotationFor(id: string): number {
  return ((parseInt(id.slice(0, 8), 16) % 5) - 2) * (Math.PI / 180);
}

function roundRect(
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

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const ir = img.width / img.height;
  const tr = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (ir > tr) {
    sw = img.height * tr;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / tr;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last && ctx.measureText(`${last}…`).width > maxWidth) {
    last = last.slice(0, -1);
  }
  kept[maxLines - 1] = `${last}…`;
  return kept;
}

function meta(post: Post): string {
  return `@${post.author_name} · ${dayjs(post.created_at).format('MMM D, YYYY')}`;
}

// Draws one memory polaroid centred at (cx, cy), gently rotated.
function drawCell(
  ctx: CanvasRenderingContext2D,
  post: Post,
  img: HTMLImageElement | null,
  cx: number,
  cy: number,
) {
  const pw = CELL_W * 0.92;
  const pad = pw * 0.06;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotationFor(post.id));

  if (img) {
    const photo = pw - 2 * pad;
    const captionH = pw * 0.34;
    const ph = pad + photo + captionH;
    const left = -pw / 2;
    const top = -ph / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, left, top, pw, ph, 6);
    ctx.fill();
    ctx.restore();

    drawCover(ctx, img, left + pad, top + pad, photo, photo);

    const textTop = top + pad + photo + captionH * 0.36;
    ctx.fillStyle = '#4a4a4a';
    ctx.font = hand(pw * 0.075);
    ctx.textAlign = 'center';
    if (post.caption) {
      const lines = wrapLines(ctx, post.caption, pw - 2 * pad, 2);
      lines.forEach((ln, i) => ctx.fillText(ln, 0, textTop + i * pw * 0.085));
    }
    ctx.fillStyle = '#9a9a9a';
    ctx.font = hand(pw * 0.05);
    ctx.fillText(meta(post), 0, top + ph - pad * 0.8);
  } else {
    // Text-only memory: a handwritten note card.
    const ph = CELL_H * 0.86;
    const left = -pw / 2;
    const top = -ph / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#fffdf5';
    roundRect(ctx, left, top, pw, ph, 6);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#4a4a4a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = post.caption || '';
    const maxW = pw - 2 * pad;
    const availH = ph - 2 * pad - pw * 0.12; // leave room for the meta line
    // Shrink the font until the whole caption fits — never truncate.
    let size = pw * 0.1;
    let lines: string[] = [];
    while (size > pw * 0.035) {
      ctx.font = hand(size);
      lines = wrapLines(ctx, text, maxW, 999);
      if (lines.length * size * 1.15 <= availH) break;
      size -= pw * 0.004;
    }
    ctx.font = hand(size);
    const lh = size * 1.15;
    const startY = -((lines.length - 1) * lh) / 2;
    lines.forEach((ln, i) => ctx.fillText(ln, 0, startY + i * lh));
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = '#9a9a9a';
    ctx.font = hand(pw * 0.05);
    ctx.fillText(meta(post), 0, top + ph - pad * 0.8);
  }

  ctx.restore();
}

function newPageCanvas(): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  return { canvas, ctx };
}

function renderCover(team: PublicTeam, total: number): string {
  const { canvas, ctx } = newPageCanvas();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#3a3a3a';
  ctx.font = hand(PAGE_W * 0.11);
  ctx.fillText(team.name, PAGE_W / 2, PAGE_H * 0.42, PAGE_W - 2 * MARGIN);
  ctx.fillStyle = '#ff7f50';
  ctx.font = hand(PAGE_W * 0.05);
  ctx.fillText(
    i18n.t('export:pdf.memories', { count: total }),
    PAGE_W / 2,
    PAGE_H * 0.5,
  );
  ctx.fillStyle = '#9a9a9a';
  ctx.font = hand(PAGE_W * 0.038);
  ctx.fillText(
    i18n.t('export:pdf.exportedOn', {
      date: dayjs().format('D MMMM, YYYY'),
    }),
    PAGE_W / 2,
    PAGE_H * 0.55,
  );
  return canvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Builds a multi-page scrapbook PDF: a cover page plus 4 memories per page in a
 * 2x2 grid. Each page is composited on its own small canvas (mobile-safe) and
 * placed into the PDF as a single image. `imageMap` holds base64 photos by post
 * id; posts absent from the map render as handwritten note cards. Returns the
 * PDF blob plus the per-page JPEG data URLs so the UI can preview pages as
 * images (Android/iOS WebViews cannot reliably render a PDF blob in an iframe).
 */
export async function generateAlbumPdf(
  team: PublicTeam,
  posts: Post[],
  imageMap: Map<string, string>,
): Promise<{ blob: Blob; pages: string[] }> {
  await ensureFont();

  const pages: string[] = [];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const cover = renderCover(team, posts.length);
  pages.push(cover);
  doc.addImage(cover, 'JPEG', 0, 0, A4_W, A4_H);

  const centers = [
    [MARGIN + CELL_W / 2, MARGIN + CELL_H / 2],
    [MARGIN + CELL_W + GAP + CELL_W / 2, MARGIN + CELL_H / 2],
    [MARGIN + CELL_W / 2, MARGIN + CELL_H + GAP + CELL_H / 2],
    [MARGIN + CELL_W + GAP + CELL_W / 2, MARGIN + CELL_H + GAP + CELL_H / 2],
  ];

  for (let i = 0; i < posts.length; i += 4) {
    const { canvas, ctx } = newPageCanvas();
    const group = posts.slice(i, i + 4);
    for (let j = 0; j < group.length; j++) {
      const post = group[j];
      const data = imageMap.get(post.id);
      let img: HTMLImageElement | null = null;
      if (data) {
        try {
          img = await loadImage(data);
        } catch {
          img = null;
        }
      }
      drawCell(ctx, post, img, centers[j][0], centers[j][1]);
    }
    doc.addPage();
    const pageData = canvas.toDataURL('image/jpeg', 0.85);
    pages.push(pageData);
    doc.addImage(pageData, 'JPEG', 0, 0, A4_W, A4_H);
    // Yield to the event loop so the UI stays responsive on mobile.
    await new Promise((r) => setTimeout(r, 0));
  }

  return { blob: doc.output('blob'), pages };
}

function albumFilename(team: PublicTeam): string {
  const slug = team.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'memory';
  return `${slug}_album.pdf`;
}

/**
 * Downloads the PDF as a file.
 */
export function downloadAlbumPdf(blob: Blob, team: PublicTeam): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = albumFilename(team);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Shares the PDF via the OS share sheet when possible, otherwise downloads it.
 */
export async function shareAlbumPdf(
  blob: Blob,
  team: PublicTeam,
): Promise<void> {
  const file = new File([blob], albumFilename(team), {
    type: 'application/pdf',
  });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: i18n.t('export:pdf.shareTitle', { name: team.name }),
      });
      return;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      console.error('Share failed, falling back to download:', err);
    }
  }

  downloadAlbumPdf(blob, team);
}
