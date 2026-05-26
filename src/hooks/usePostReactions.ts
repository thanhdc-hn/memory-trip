import { useCallback, useEffect, useMemo, useState } from 'react';

import { useFingerprint } from '@/hooks/useFingerprint';
import {
  type PostReaction,
  reactionsService,
} from '@/services/reactions.service';

const TOOLTIP_STORAGE_KEY = 'heart-tooltip-dismissed';

export function usePostReactions(postId: string, teamId: string) {
  const userId = useFingerprint();
  const [reactions, setReactions] = useState<PostReaction[]>([]);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(
    localStorage.getItem(TOOLTIP_STORAGE_KEY) === 'true',
  );

  useEffect(() => {
    if (!teamId) return;

    // Load initial reactions
    reactionsService.getReactionsForTeam(teamId).then(setReactions);

    // Subscribe to changes
    const channel = reactionsService.subscribeToReactions(teamId, (payload) => {
      if (payload.eventType === 'INSERT') {
        const newReaction = payload.new as PostReaction;
        setReactions((prev) => {
          // Prevent duplicates (especially from optimistic updates)
          if (prev.some((r) => r.id === newReaction.id)) return prev;

          // If it's a reaction from the current user, we might have an optimistic one with a temp ID
          // We can check by post_id and user_id
          const alreadyHasThisOne = prev.some(
            (r) =>
              r.post_id === newReaction.post_id &&
              r.user_id === newReaction.user_id,
          );

          if (alreadyHasThisOne) {
            // Replace the optimistic one (temp ID) with the real one (UUID)
            return prev.map((r) =>
              r.post_id === newReaction.post_id &&
              r.user_id === newReaction.user_id
                ? newReaction
                : r,
            );
          }

          return [...prev, newReaction];
        });
      } else if (payload.eventType === 'DELETE') {
        const deletedId = payload.old.id || payload.new?.id;
        const deletedReaction = payload.old as PostReaction;

        setReactions((prev) => {
          // If we have an ID, use it
          if (deletedId) {
            return prev.filter((r) => r.id !== deletedId);
          }
          // Fallback to post_id/user_id if ID is missing (can happen with some RLS/Realtime configs)
          if (deletedReaction?.post_id && deletedReaction?.user_id) {
            return prev.filter(
              (r) =>
                !(
                  r.post_id === deletedReaction.post_id &&
                  r.user_id === deletedReaction.user_id
                ),
            );
          }
          return prev;
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [teamId]);

  const postReactions = useMemo(
    () => reactions.filter((r) => r.post_id === postId),
    [reactions, postId],
  );

  const hasHearted = useMemo(
    () => postReactions.some((r) => r.user_id === userId),
    [postReactions, userId],
  );

  const heartCount = postReactions.length;

  const toggleHeart = useCallback(async () => {
    if (!userId || !teamId) return;

    if (hasHearted) {
      // Optimistic update
      setReactions((prev) =>
        prev.filter((r) => !(r.post_id === postId && r.user_id === userId)),
      );
      try {
        await reactionsService.removeReaction(postId, userId);
      } catch (error) {
        console.error('Failed to remove reaction:', error);
        // Rollback optimistic update
        const rolledBackReaction: PostReaction = {
          id: `rollback-${Math.random()}`,
          post_id: postId,
          team_id: teamId,
          user_id: userId,
          created_at: new Date().toISOString(),
        };
        setReactions((prev) => [...prev, rolledBackReaction]);
      }
    } else {
      // Optimistic update
      const tempId = Math.random().toString();
      const newReaction: PostReaction = {
        id: tempId,
        post_id: postId,
        team_id: teamId,
        user_id: userId,
        created_at: new Date().toISOString(),
      };
      setReactions((prev) => [...prev, newReaction]);
      try {
        await reactionsService.addReaction(postId, teamId, userId);
      } catch (error) {
        console.error('Failed to add reaction:', error);
        // Rollback optimistic update
        setReactions((prev) =>
          prev.filter(
            (r) =>
              !(
                r.post_id === postId &&
                r.user_id === userId &&
                r.id === tempId
              ),
          ),
        );
      }

      if (!isTooltipDismissed) {
        localStorage.setItem(TOOLTIP_STORAGE_KEY, 'true');
        setIsTooltipDismissed(true);
      }
    }
  }, [hasHearted, postId, teamId, userId, isTooltipDismissed]);

  const totalHeartsInTrip = useMemo(() => reactions.length, [reactions]);

  return {
    hasHearted,
    heartCount,
    totalHeartsInTrip,
    toggleHeart,
    showTooltip: !isTooltipDismissed,
  };
}
