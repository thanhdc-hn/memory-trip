import { useCallback, useEffect, useState } from 'react';

import { useFingerprint } from '@/hooks/useFingerprint';
import { reactionsService } from '@/services/reactions.service';

const TOOLTIP_STORAGE_KEY = 'heart-tooltip-dismissed';

export function usePostReactions(postId: string, teamId: string) {
  const userId = useFingerprint();
  const [heartCount, setHeartCount] = useState(0);
  const [hasHearted, setHasHearted] = useState(false);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(
    localStorage.getItem(TOOLTIP_STORAGE_KEY) === 'true',
  );

  const fetchStats = useCallback(async () => {
    if (!postId || !userId) return;
    try {
      const stats = await reactionsService.getReactionStats(postId, userId);
      setHeartCount(stats.count);
      setHasHearted(stats.hasHearted);
    } catch (error) {
      console.error('Failed to fetch reaction stats:', error);
    }
  }, [postId, userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const toggleHeart = useCallback(async () => {
    if (!userId || !teamId) return;

    const originalHasHearted = hasHearted;
    const originalCount = heartCount;

    if (hasHearted) {
      // Optimistic update
      setHasHearted(false);
      setHeartCount((prev) => Math.max(0, prev - 1));
      try {
        await reactionsService.removeReaction(postId, userId);
        // Refetch to sync with server state
        await fetchStats();
      } catch (error) {
        console.error('Failed to remove reaction:', error);
        // Rollback optimistic update
        setHasHearted(originalHasHearted);
        setHeartCount(originalCount);
      }
    } else {
      // Optimistic update
      setHasHearted(true);
      setHeartCount((prev) => prev + 1);
      try {
        await reactionsService.addReaction(postId, teamId, userId);
        // Refetch to sync with server state
        await fetchStats();
      } catch (error) {
        console.error('Failed to add reaction:', error);
        // Rollback optimistic update
        setHasHearted(originalHasHearted);
        setHeartCount(originalCount);
      }

      if (!isTooltipDismissed) {
        localStorage.setItem(TOOLTIP_STORAGE_KEY, 'true');
        setIsTooltipDismissed(true);
      }
    }
  }, [
    hasHearted,
    heartCount,
    postId,
    teamId,
    userId,
    isTooltipDismissed,
    fetchStats,
  ]);

  return {
    hasHearted,
    heartCount,
    toggleHeart,
    showTooltip: !isTooltipDismissed,
  };
}
