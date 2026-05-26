import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { UploadFabButton } from '@/components/memory/upload-fab-button';
import { CreatePostSheet } from '@/components/posts/CreatePostSheet';
import { EmptyTimelineState } from '@/components/timeline/EmptyTimelineState';
import { IncomingFeatureModal } from '@/components/timeline/IncomingFeatureModal';
import { PostCard } from '@/components/timeline/PostCard';
import { PostSkeleton } from '@/components/timeline/PostSkeleton';
import { ScrollToTopButton } from '@/components/timeline/ScrollToTopButton';
import { TimelineHeader } from '@/components/timeline/TimelineHeader';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useTimelinePosts } from '@/hooks/use-timeline-posts';
import { POST_WAIT_TIME } from '@/utils/constants';
import { formatCooldown } from '@/utils/time';

export default function TimelinePage() {
  const { team, loading: teamLoading } = useCurrentTeam();
  const {
    posts,
    loading: postsLoading,
    isLoadingMore,
    hasMore,
    loadMore,
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

  const [showIncomingModal, setShowIncomingModal] = useState(false);
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

  const handlePostClick = () => {
    // setShowIncomingModal(true);
  };

  const handleCreatePost = () => {
    if (team?.is_locked) return;
    setShowCreateSheet(true);
  };

  const loading = teamLoading || postsLoading;

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center">
      <TimelineHeader team={team} />

      <main className="w-full max-w-2xl flex-1 px-4 py-8">
        {team?.is_locked && (
          <div className="animate-in fade-in slide-in-from-top-4 mb-6 duration-500">
            <div className="bg-primary/10 rounded-2xl p-4 text-center">
              <p className="text-primary font-medium">
                This trip memory book is closed 🌙
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
            <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-8 duration-700">
              {posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={handlePostClick}
                  isFirst={index === 0}
                />
              ))}
            </div>

            {(hasMore || isLoadingMore) && (
              <div ref={ref} className="mt-8 flex justify-center py-4">
                {isLoadingMore ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                    <p className="text-muted-foreground text-sm font-medium">
                      Loading more memories...
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

      {!team?.is_locked && (
        <UploadFabButton
          label={
            cooldown > 0
              ? `Next memory in ${formatCooldown(cooldown)}`
              : 'Share'
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

      <IncomingFeatureModal
        open={showIncomingModal}
        onOpenChange={setShowIncomingModal}
      />

      <ScrollToTopButton newPostsCount={newPostsCount} />

      {/* Spacing for FAB */}
      <div className="h-24" />
    </div>
  );
}
