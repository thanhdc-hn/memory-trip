import { supabase } from '@/lib/supabase';
import type { Post } from '@/services/posts.service';
import { storageService } from '@/services/storage.service';

export interface ThumbnailProgress {
  loaded: number;
  total: number;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const exportService = {
  /**
   * Paginated fetch of posts, oldest first (scrapbook order). Includes both
   * image posts and text-only posts (every post has a caption or an image).
   * Used by the export page grid so we never load every post at once.
   */
  async fetchExportablePosts(
    teamId: string,
    page = 0,
    pageSize = 20,
  ): Promise<Post[]> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true })
      .range(from, to);

    if (error) throw error;
    return data || [];
  },

  /**
   * Sequentially fetch optimized thumbnails (500px / q90) and convert each to a
   * base64 data URL. One image is held in memory at a time. Reports progress and
   * supports cancellation. Failed images are skipped (handled downstream).
   */
  async fetchPostThumbnails(
    posts: Post[],
    opts: {
      onProgress?: (p: ThumbnailProgress) => void;
      signal?: AbortSignal;
    } = {},
  ): Promise<Map<string, string>> {
    const { onProgress, signal } = opts;
    const imageMap = new Map<string, string>();
    const targets = posts.filter((p) => !!p.image_path);
    let loaded = 0;

    for (const post of targets) {
      if (signal?.aborted) break;
      try {
        const url = storageService.getOptimizedUrl(post.image_path!, 500, 90);
        const res = await fetch(url, { signal });
        const blob = await res.blob();
        imageMap.set(post.id, await blobToBase64(blob));
      } catch (err) {
        if (signal?.aborted) break;
        console.error('Thumbnail fetch failed for post', post.id, err);
      }
      loaded += 1;
      onProgress?.({ loaded, total: targets.length });
    }

    return imageMap;
  },

  /**
   * Fetches a single optimized image as a base64 data URL at the given width and
   * quality. Used to pull a high-resolution cover photo (the cover is rendered
   * full-bleed, so the 500px album thumbnail looks soft). Stored originals go up
   * to 1920px, so 1920/q90 keeps the cover crisp.
   */
  async fetchImageDataUrl(
    imagePath: string,
    width: number,
    quality: number,
    signal?: AbortSignal,
  ): Promise<string> {
    const url = storageService.getOptimizedUrl(imagePath, width, quality);
    const res = await fetch(url, { signal });
    const blob = await res.blob();
    return blobToBase64(blob);
  },
};
