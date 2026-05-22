import { useState } from 'react';

import { UploadFabButton } from '@/components/memory/upload-fab-button';
import { EmptyTimelineState } from '@/components/timeline/EmptyTimelineState';
import { IncomingFeatureModal } from '@/components/timeline/IncomingFeatureModal';
import { PostCard } from '@/components/timeline/PostCard';
import { PostSkeleton } from '@/components/timeline/PostSkeleton';
import { TimelineHeader } from '@/components/timeline/TimelineHeader';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useTimelinePosts } from '@/hooks/use-timeline-posts';

export default function TimelinePage() {
  const { team, loading: teamLoading } = useCurrentTeam();
  const { posts, loading: postsLoading } = useTimelinePosts(team?.id || null);
  const [showIncomingModal, setShowIncomingModal] = useState(false);

  const handlePostClick = () => {
    setShowIncomingModal(true);
  };

  const handleCreatePost = () => {
    setShowIncomingModal(true); // Create feature is also incoming as per instructions or we just show the modal for now
  };

  const loading = teamLoading || postsLoading;

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center">
      <TimelineHeader team={team} />

      <main className="w-full max-w-2xl flex-1 px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-8 duration-700">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onClick={handlePostClick} />
            ))}
          </div>
        ) : (
          <EmptyTimelineState />
        )}
      </main>

      <UploadFabButton
        label="Share"
        onClick={handleCreatePost}
        className="shadow-sticker"
      />

      <IncomingFeatureModal
        open={showIncomingModal}
        onOpenChange={setShowIncomingModal}
      />

      {/* Spacing for FAB */}
      <div className="h-24" />
    </div>
  );
}
