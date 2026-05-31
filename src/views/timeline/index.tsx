import dayjs from 'dayjs';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

import { UploadFabButton } from '@/components/memory/upload-fab-button';
import { CreatePostSheet } from '@/components/posts/CreatePostSheet';
import { ClosureWarningModal } from '@/components/timeline/ClosureWarningModal';
import { EmptyTimelineState } from '@/components/timeline/EmptyTimelineState';
import { NewMemoriesPill } from '@/components/timeline/NewMemoriesPill';
import { PostCard } from '@/components/timeline/PostCard';
import { PostSkeleton } from '@/components/timeline/PostSkeleton';
import { PullToRefresh } from '@/components/timeline/PullToRefresh';
import { ScrollToTopButton } from '@/components/timeline/ScrollToTopButton';
import { TimelineHeader } from '@/components/timeline/TimelineHeader';
import { Divider } from '@/components/ui/divider';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useTeamStats } from '@/hooks/use-team-stats';
import { useTimelinePosts } from '@/hooks/use-timeline-posts';
import type { Post } from '@/services/posts.service';
import { POST_WAIT_TIME } from '@/utils/constants';
import { formatCooldown } from '@/utils/time';

export default function TimelinePage() {
  const { team, loading: teamLoading } = useCurrentTeam();
  const { t } = useTranslation('timeline');
  const stats = useTeamStats(team?.id || null);
  const limitReached =
    !!team?.post_limit && !!stats && stats.memory_count >= team.post_limit;
  const {
    posts,
    loading: postsLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    addOptimisticPost,
    removeOptimisticPost,
    newPostsCount,
    resetNewPostsCount,
  } = useTimelinePosts(team?.id || null);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && !postsLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, postsLoading, loadMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        resetNewPostsCount();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [resetNewPostsCount]);

  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handlePostSuccess = useCallback(() => {
    setCooldown(Math.floor(POST_WAIT_TIME / 1000));
  }, []);

  const handleCreatePost = () => {
    if (team?.is_locked || limitReached) return;
    setShowCreateSheet(true);
  };

  const handleShowNewMemories = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    resetNewPostsCount();
  }, [resetNewPostsCount]);

  const loading = teamLoading || postsLoading;

  const dayGroups = useMemo(() => {
    const groups: { day: string; posts: Post[] }[] = [];
    for (const post of posts) {
      const day = dayjs(post.created_at).format('D MMM, YYYY');
      const last = groups[groups.length - 1];
      if (last && last.day === day) last.posts.push(post);
      else groups.push({ day, posts: [post] });
    }
    return groups;
  }, [posts]);

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center">
      <TimelineHeader team={team} />

      {!team?.is_locked && (
        <ClosureWarningModal teamId={team?.id} closeAt={team?.close_at} />
      )}

      <NewMemoriesPill count={newPostsCount} onClick={handleShowNewMemories} />

      <PullToRefresh
        onRefresh={refresh}
        className="flex w-full max-w-2xl flex-1 flex-col"
      >
        <main className="w-full flex-1 px-4 py-8">
          {team?.is_locked && (
            <div className="animate-in fade-in slide-in-from-top-4 mb-6 duration-500">
              <div className="bg-primary/10 rounded-2xl p-4 text-center">
                <p className="text-primary font-medium">{t('closed')}</p>
              </div>
            </div>
          )}

          {!team?.is_locked && limitReached && (
            <div className="animate-in fade-in slide-in-from-top-4 mb-6 duration-500">
              <div className="bg-primary/10 rounded-2xl p-4 text-center">
                <p className="text-primary font-medium">
                  {t('limitReached', { count: team!.post_limit! })}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
                {dayGroups.map((group) => (
                  <section key={group.day} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="font-handwritten text-text-h text-2xl">
                        {group.day}
                      </span>
                      <Divider variant="dashed" className="flex-1" />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      {group.posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          isFirst={post.id === posts[0]?.id}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {(hasMore || isLoadingMore) && (
                <div ref={ref} className="mt-8 flex justify-center py-4">
                  {isLoadingMore ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                      <p className="text-muted-foreground text-sm font-medium">
                        {t('loadingMore')}
                      </p>
                    </div>
                  ) : (
                    <div className="h-8" /> // Invisible trigger
                  )}
                </div>
              )}
            </>
          ) : (
            <EmptyTimelineState />
          )}
        </main>
      </PullToRefresh>

      {!team?.is_locked && !limitReached && (
        <UploadFabButton
          label={
            cooldown > 0
              ? t('fab.cooldown', { time: formatCooldown(cooldown) })
              : t('fab.share')
          }
          onClick={handleCreatePost}
          disabled={cooldown > 0}
          loading={cooldown > 0}
          className="shadow-sticker"
        />
      )}

      <CreatePostSheet
        open={showCreateSheet}
        onOpenChange={setShowCreateSheet}
        teamId={team?.id || ''}
        onOptimisticPost={addOptimisticPost}
        onRollback={removeOptimisticPost}
        onSuccess={handlePostSuccess}
      />

      <ScrollToTopButton newPostsCount={newPostsCount} />

      {/* Spacing for FAB */}
      <div className="h-24" />
    </div>
  );
}
