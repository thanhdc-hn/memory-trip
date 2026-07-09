import type { Post } from '@/services/posts.service';
import { storageService } from '@/services/storage.service';

interface GetPostImageUrlOptions {
  width?: number;
  quality?: number;
  useTransformation?: boolean;
}

/**
 * Returns the appropriate image URL for a post.
 * Tries to use transformed URL first, falls back to direct URL if transformation fails.
 * For fresh uploads (blob URLs), it uses the direct URL.
 */
export function getPostImageUrl(
  post: Post,
  options: GetPostImageUrlOptions = {},
): string | null {
  if (!post.image_path) return null;
  // Handle optimistic posts with blob URLs
  if (post.image_path.startsWith('blob:')) {
    return post.image_path;
  }

  const { width = 640, quality = 90, useTransformation = true } = options;

  try {
    if (useTransformation) {
      // Try to get transformed URL
      return storageService.getOptimizedUrl(post.image_path, width, quality);
    } else {
      // Use direct non-transformed URL
      return storageService.getNonTransformedUrl(post.image_path);
    }
  } catch (error) {
    console.warn('Failed to get optimized image URL, using fallback:', error);
    // Fallback to direct URL
    return storageService.getNonTransformedUrl(post.image_path);
  }
}

/**
 * Backup function that always uses non-transformed URLs.
 * Use this when Supabase image transformation is disabled.
 */
export function getPostImageUrlDirect(post: Post): string | null {
  if (!post.image_path) return null;
  if (post.image_path.startsWith('blob:')) {
    return post.image_path;
  }

  return storageService.getNonTransformedUrl(post.image_path);
}
