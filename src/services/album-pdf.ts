import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';

import i18n from '@/i18n';
import type { Post } from '@/services/posts.service';
import type { PublicTeam } from '@/services/public-team.service';
import { slugify } from '@/utils/slugify';
import { getDateFormat } from '@/utils/time';

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

// Like drawCover but fits the whole image inside the box (no cropping),
// centred — used by wide cards so the full photo is visible.
function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const ir = img.width / img.height;
  let w = dw;
  let h = dh;
  if (ir > dw / dh) h = dw / ir;
  else w = dh * ir;
  ctx.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
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
  return `@${post.author_name} · ${dayjs(post.created_at).format(getDateFormat(i18n.language))}`;
}

// True when an image caption won't fit the normal 2-line cell, so it would be
// truncated — these posts get a full-width row instead.
function isLongCaption(
  ctx: CanvasRenderingContext2D,
  caption: string,
): boolean {
  const pw = CELL_W * 0.92;
  const pad = pw * 0.06;
  ctx.font = hand(pw * 0.075);
  return wrapLines(ctx, caption, pw - 2 * pad, 999).length > 2;
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

// Draws a full-width memory: photo on the left, the complete caption on the
// right. Used for image posts whose caption is too long for a normal cell, so
// the story is never truncated. Centred at (cx, cy).
function drawWideCell(
  ctx: CanvasRenderingContext2D,
  post: Post,
  img: HTMLImageElement,
  cx: number,
  cy: number,
) {
  const pw = (PAGE_W - 2 * MARGIN) * 0.97;
  const ph = CELL_H * 0.94;
  const pad = ph * 0.06;
  const left = -pw / 2;
  const top = -ph / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotationFor(post.id));

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, left, top, pw, ph, 6);
  ctx.fill();
  ctx.restore();

  // Photo fills the left ~48%, whole image visible (no crop).
  const photoW = pw * 0.48 - pad;
  const photoH = ph - 2 * pad;
  drawContain(ctx, img, left + pad, top + pad, photoW, photoH);

  // Caption fills the right column; shrink to fit so nothing is truncated.
  const tx = left + pad + photoW + pad;
  const maxW = pw - photoW - 3 * pad;
  const availH = ph - 2 * pad - ph * 0.1; // leave room for the meta line
  ctx.fillStyle = '#4a4a4a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  let size = ph * 0.08;
  let lines: string[] = [];
  while (size > ph * 0.03) {
    ctx.font = hand(size);
    lines = wrapLines(ctx, post.caption || '', maxW, 999);
    if (lines.length * size * 1.2 <= availH) break;
    size -= ph * 0.003;
  }
  ctx.font = hand(size);
  const lh = size * 1.2;
  lines.forEach((ln, i) => ctx.fillText(ln, tx, top + pad + i * lh));
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#9a9a9a';
  ctx.font = hand(ph * 0.05);
  ctx.fillText(meta(post), tx, top + ph - pad * 0.8);

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

function renderCover(
  team: PublicTeam,
  total: number,
  img?: HTMLImageElement | null,
): string {
  const { canvas, ctx } = newPageCanvas();

  if (img) {
    // Full-bleed photo cover with a dark gradient so the title stays legible.
    drawCover(ctx, img, 0, 0, PAGE_W, PAGE_H);
    const grad = ctx.createLinearGradient(0, PAGE_H * 0.45, 0, PAGE_H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);

    // Solid panel behind the text so it stays readable over any photo.
    const panelX = MARGIN;
    const panelY = PAGE_H * 0.74;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    roundRect(ctx, panelX, panelY, PAGE_W - 2 * MARGIN, PAGE_H * 0.22, 12);
    ctx.fill();
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = hand(PAGE_W * 0.11);
    ctx.fillText(team.name, PAGE_W / 2, PAGE_H * 0.82, PAGE_W - 2 * MARGIN);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = hand(PAGE_W * 0.05);
    ctx.fillText(
      i18n.t('export:pdf.memories', { count: total }),
      PAGE_W / 2,
      PAGE_H * 0.88,
    );
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = hand(PAGE_W * 0.038);
    ctx.fillText(
      i18n.t('export:pdf.exportedOn', { date: dayjs().format('D MMMM, YYYY') }),
      PAGE_W / 2,
      PAGE_H * 0.92,
    );
    return canvas.toDataURL('image/jpeg', 0.85);
  }

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
 * Builds a multi-page scrapbook PDF: a cover page plus memories laid out two
 * rows per page. Normal memories pair up two per row; an image post with a long
 * caption takes a full-width row (photo + complete caption) so its story is
 * never truncated. Each page is composited on its own small canvas
 * (mobile-safe) and placed into the PDF as a single image. `imageMap` holds
 * base64 photos by post id; posts absent from the map render as handwritten
 * note cards. When `coverId` matches a selected image post, that photo fills
 * the cover page (with the title overlaid); otherwise the text-only cover is
 * used. Returns the PDF blob plus the per-page JPEG data URLs so the UI can
 * preview pages as
 * images (Android/iOS WebViews cannot reliably render a PDF blob in an iframe).
 */
export async function generateAlbumPdf(
  team: PublicTeam,
  posts: Post[],
  imageMap: Map<string, string>,
  coverId?: string | null,
): Promise<{ blob: Blob; pages: string[] }> {
  await ensureFont();

  const pages: string[] = [];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const loadFor = async (post: Post): Promise<HTMLImageElement | null> => {
    const data = imageMap.get(post.id);
    if (!data) return null;
    try {
      return await loadImage(data);
    } catch {
      return null;
    }
  };

  const coverPost = coverId ? posts.find((p) => p.id === coverId) : null;
  const coverImg = coverPost ? await loadFor(coverPost) : null;
  const cover = renderCover(team, posts.length, coverImg);
  pages.push(cover);
  doc.addImage(cover, 'JPEG', 0, 0, A4_W, A4_H);

  // Pack posts into rows: a long-caption image post takes a full-width row of
  // its own (so its story isn't truncated); others pair up two per row.
  const measure = newPageCanvas().ctx;
  type Row = { posts: Post[]; wide: boolean };
  const rows: Row[] = [];
  let buf: Post[] = [];
  const flush = () => {
    if (buf.length) {
      rows.push({ posts: buf, wide: false });
      buf = [];
    }
  };
  for (const post of posts) {
    const wide =
      imageMap.has(post.id) &&
      !!post.caption &&
      isLongCaption(measure, post.caption);
    if (wide) {
      flush();
      rows.push({ posts: [post], wide: true });
    } else {
      buf.push(post);
      if (buf.length === 2) flush();
    }
  }
  flush();

  const rowCY = [MARGIN + CELL_H / 2, MARGIN + CELL_H + GAP + CELL_H / 2];
  const cellCX = [MARGIN + CELL_W / 2, MARGIN + CELL_W + GAP + CELL_W / 2];

  // Two rows per page.
  for (let r = 0; r < rows.length; r += 2) {
    const { canvas, ctx } = newPageCanvas();
    const slots = rows.slice(r, r + 2);
    for (let s = 0; s < slots.length; s++) {
      const row = slots[s];
      if (row.wide) {
        const img = await loadFor(row.posts[0]);
        if (img) drawWideCell(ctx, row.posts[0], img, PAGE_W / 2, rowCY[s]);
        else drawCell(ctx, row.posts[0], null, cellCX[0], rowCY[s]);
      } else {
        for (let k = 0; k < row.posts.length; k++) {
          const img = await loadFor(row.posts[k]);
          drawCell(ctx, row.posts[k], img, cellCX[k], rowCY[s]);
        }
      }
    }
    doc.addPage();
    const pageData = canvas.toDataURL('image/jpeg', 0.85);
    pages.push(pageData);
    doc.addImage(pageData, 'JPEG', 0, 0, A4_W, A4_H);
    // Yield to the event loop so the UI stays responsive on mobile.
    await new Promise((res) => setTimeout(res, 0));
  }

  return { blob: doc.output('blob'), pages };
}

function albumFilename(team: PublicTeam): string {
  const slug = slugify(team.name, '_') || 'memory';
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
