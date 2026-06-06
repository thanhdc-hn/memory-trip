import dayjs from 'dayjs';
import JSZip from 'jszip';

import { exportService } from '@/services/export.service';
import type { Post } from '@/services/posts.service';
import type { PublicTeam } from '@/services/public-team.service';
import { storageService } from '@/services/storage.service';
import { slugify } from '@/utils/slugify';

const PAGE_SIZE = 20;

export interface ZipProgress {
  loaded: number;
  total: number;
}

/**
 * Fetches every post for a team by paging through `fetchExportablePosts` until a
 * short page is returned. Preserves the oldest-first order used by the export
 * page. Unlike the album flow (which loads one page at a time on scroll), the
 * ZIP needs the full set, so we accumulate all pages here.
 */
export async function fetchAllPosts(teamId: string): Promise<Post[]> {
  const all: Post[] = [];
  let page = 0;

  for (;;) {
    const batch = await exportService.fetchExportablePosts(
      teamId,
      page,
      PAGE_SIZE,
    );
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    page += 1;
  }

  return all;
}

// Turns an author name into a filename-safe token.
function sanitize(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '_');
}

/**
 * Sequentially downloads the full-resolution original (`.webp`) for every image
 * post and packs them into a single ZIP. One blob is held in memory at a time
 * during fetch (mobile-safe). Text-only posts are skipped. Reports progress and
 * supports cancellation; a failed image is logged and skipped rather than
 * aborting the whole archive. `.webp` files are already compressed, so the zip
 * uses STORE (no recompression) to save CPU. Returns the ZIP blob.
 */
export async function generateImagesZip(
  posts: Post[],
  opts: {
    onProgress?: (p: ZipProgress) => void;
    signal?: AbortSignal;
  } = {},
): Promise<Blob> {
  const { onProgress, signal } = opts;
  const zip = new JSZip();
  const targets = posts.filter((p) => !!p.image_path);
  let loaded = 0;

  for (let i = 0; i < targets.length; i++) {
    if (signal?.aborted) break;
    const post = targets[i];
    try {
      const url = storageService.getPublicUrl(post.image_path!);
      const res = await fetch(url, { signal });
      const blob = await res.blob();
      const prefix = String(i + 1).padStart(3, '0');
      const date = dayjs(post.created_at).format('YYYY-MM-DD');
      const filename = `${prefix}_${date}_${sanitize(post.author_name)}.webp`;
      zip.file(filename, blob);
    } catch (err) {
      if (signal?.aborted) break;
      console.error('ZIP image fetch failed for post', post.id, err);
    }
    loaded += 1;
    onProgress?.({ loaded, total: targets.length });
  }

  return zip.generateAsync({ type: 'blob', compression: 'STORE' });
}

function zipFilename(team: PublicTeam): string {
  const slug = slugify(team.name, '_') || 'memory';
  return `${slug}_photos.zip`;
}

/**
 * Downloads the ZIP as a file (object URL → anchor click → revoke).
 */
export function downloadImagesZip(blob: Blob, team: PublicTeam): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipFilename(team);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
