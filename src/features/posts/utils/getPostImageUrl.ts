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
export async function getPostImageUrl(
  post: Post,
  options: GetPostImageUrlOptions = {},
): Promise<string | null> {
  if (!post.image_path) return null;
  // Handle optimistic posts with blob URLs
  if (post.image_path.startsWith('blob:')) {
    return post.image_path;
  }

  const { width = 640, quality = 90, useTransformation = true } = options;

  try {
    if (useTransformation) {
      // Try to get transformed URL
      return await storageService.getOptimizedUrl(
        post.image_path,
        width,
        quality,
      );
    } else {
      // Use direct non-transformed URL
      return await storageService.getNonTransformedUrl(post.image_path);
    }
  } catch (error) {
    console.warn('Failed to get optimized image URL, using fallback:', error);
    // Fallback to direct URL
    try {
      return await storageService.getNonTransformedUrl(post.image_path);
    } catch (fallbackError) {
      console.error('Failed to get fallback image URL:', fallbackError);
      return null;
    }
  }
}

/**
 * Backup function that always uses non-transformed URLs.
 * Use this when Supabase image transformation is disabled.
 */
export async function getPostImageUrlDirect(
  post: Post,
): Promise<string | null> {
  if (!post.image_path) return null;
  if (post.image_path.startsWith('blob:')) {
    return post.image_path;
  }

  try {
    return await storageService.getNonTransformedUrl(post.image_path);
  } catch (error) {
    console.error('Failed to get direct image URL:', error);
    return null;
  }
}
