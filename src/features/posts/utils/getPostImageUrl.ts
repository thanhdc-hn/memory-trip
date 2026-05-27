import type { Post } from '@/services/posts.service';
import { storageService } from '@/services/storage.service';

interface GetPostImageUrlOptions {
  width?: number;
  quality?: number;
}

/**
 * Returns the appropriate image URL for a post.
 * For fresh uploads, it uses the direct public URL to avoid Supabase transform delay (400 errors).
 * For existing posts, it uses the transformed/optimized URL to save bandwidth.
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

  const { width = 640, quality = 90 } = options;

  return storageService.getOptimizedUrl(post.image_path, width, quality);
}
