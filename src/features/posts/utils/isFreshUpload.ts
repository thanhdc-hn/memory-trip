import type { Post } from '@/services/posts.service';

/**
 * Checks if a post is a fresh upload.
 * A post is considered fresh if it has the isFreshUpload flag set to true,
 * or if it was created within the last 1 minutes (as a fallback).
 */
export function isFreshUpload(post: Post): boolean {
  if (post.isFreshUpload) return true;

  if (!post.created_at) return true; // Assume fresh if no date (e.g. during creation)

  try {
    const createdAt = new Date(post.created_at).getTime();
    const now = new Date().getTime();

    // Increased to 1 minutes to be extra safe against Supabase propagation delays and clock drift
    const freshThresholdMs = 1 * 60 * 1000;

    return now - createdAt < freshThresholdMs;
  } catch {
    return true; // Fallback to fresh on parse error
  }
}
