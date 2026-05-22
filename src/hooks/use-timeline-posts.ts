import { useEffect, useState } from 'react';

import { type Post, postsService } from '@/services/posts.service';

export function useTimelinePosts(teamId: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postsService.getPosts(teamId);
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load memories');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    const subscription = postsService.subscribeToNewPosts(teamId, (newPost) => {
      setPosts((prev) => {
        // Avoid duplicate inserts
        if (prev.some((p) => p.id === newPost.id)) return prev;
        return [newPost, ...prev];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [teamId]);

  return { posts, loading, error };
}
