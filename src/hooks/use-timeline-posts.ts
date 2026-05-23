import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { type Post, postsService } from '@/services/posts.service';

export function useTimelinePosts(teamId: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [initPostsCount, setInitPostsCount] = useState<number>(0);

  const PAGE_SIZE = 10;

  const fetchPosts = async (targetPage: number, isInitial = false) => {
    if (!teamId) return;

    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const data = await postsService.getPosts(teamId, targetPage, PAGE_SIZE);

      if (isInitial) {
        setPosts(data);
        setInitPostsCount(data.length);
      } else {
        setPosts((prev) => [...prev, ...data]);
        setInitPostsCount((prev) => prev + data.length);
      }

      setHasMore(data.length === PAGE_SIZE);
      setPage(targetPage);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load memories');
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (!teamId) return;

    // Reset state when teamId changes
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setLoading(true);

    fetchPosts(0, true);

    const channel = postsService.subscribeToNewPosts(teamId, (payload) => {
      const newPost = payload.new as Post;

      setPosts((prev) => {
        const existingPostIndex = prev.findIndex(
          (p) => String(p.id) === String(newPost.id),
        );

        if (existingPostIndex !== -1) {
          const newPosts = [...prev];
          newPosts[existingPostIndex] = {
            ...newPost,
            isFreshUpload: true,
          };
          return newPosts;
        }

        return [{ ...newPost, isFreshUpload: true }, ...prev];
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  useEffect(() => {
    if (window.scrollY > 500) {
      const newPostCount = posts.length - initPostsCount;
      setNewPostsCount(newPostCount);
    }
  }, [posts]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore || loading || !teamId) return;
    await fetchPosts(page + 1);
  };

  const resetNewPostsCount = () => {
    setNewPostsCount(0);
    setInitPostsCount(posts.length);
  };

  return {
    posts,
    loading,
    isLoadingMore,
    hasMore,
    newPostsCount,
    error,
    loadMore,
    resetNewPostsCount,
    addOptimisticPost: (post: Post) => {
      setPosts((prev) => {
        if (prev.some((p) => p.id === post.id)) return prev;
        return [post, ...prev];
      });
    },
    removeOptimisticPost: (postId: string) => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    },
  };
}
