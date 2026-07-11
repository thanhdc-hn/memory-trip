import { useEffect, useState } from 'react';

import { getPostImageUrl } from '@/features/posts/utils/getPostImageUrl';
import type { Post } from '@/services/posts.service';

interface PostImageUrlOptions {
  width?: number;
  quality?: number;
  useTransformation?: boolean;
}

export function usePostImageUrl(
  post: Post | null | undefined,
  options: PostImageUrlOptions = {},
) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!post || !post.image_path) {
      setImageUrl(null);
      return;
    }

    let isMounted = true;
    const fetchUrl = async () => {
      setLoading(true);
      try {
        const url = await getPostImageUrl(post, options);
        if (isMounted) {
          setImageUrl(url);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [
    post?.image_path,
    options.width,
    options.quality,
    options.useTransformation,
  ]);

  return { imageUrl, loading, error };
}
