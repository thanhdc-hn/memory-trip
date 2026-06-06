import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '@/hooks/use-toast';
import type { PublicTeam } from '@/services/public-team.service';
import {
  type ZipProgress,
  downloadImagesZip,
  fetchAllPosts,
  generateImagesZip,
} from '@/services/zip.service';
import { EXPORT_WARN_SELECTION } from '@/utils/constants';

// Phases drive the non-closable progress modal copy.
export type ZipPhase = 'idle' | 'preparing' | 'zipping' | 'packaging';

/**
 * Drives the "download all photos as ZIP" flow: fetch every post, sequentially
 * zip the full-res images, then trigger the download. Exposes `phase` and
 * `progress` so a modal can show non-cancelable progress, plus an `active` flag
 * the modal binds its open state to.
 */
export function usePhotoZip() {
  const { t } = useTranslation('timeline');
  const { toast } = useToast();
  const [phase, setPhase] = useState<ZipPhase>('idle');
  const [progress, setProgress] = useState<ZipProgress | null>(null);
  const runningRef = useRef(false);

  const start = useCallback(
    async (team: PublicTeam | null) => {
      if (!team || runningRef.current) return;
      runningRef.current = true;
      setPhase('preparing');
      setProgress(null);
      try {
        const all = await fetchAllPosts(team.id);
        const imagePosts = all.filter((p) => p.image_path);
        if (imagePosts.length === 0) {
          toast({ title: t('zip.noPhotos') });
          return;
        }
        if (imagePosts.length > EXPORT_WARN_SELECTION) {
          toast({ title: t('zip.bigTitle'), description: t('zip.bigDesc') });
        }
        setPhase('zipping');
        setProgress({ loaded: 0, total: imagePosts.length });
        const blob = await generateImagesZip(all, {
          onProgress: setProgress,
        });
        setPhase('packaging');
        downloadImagesZip(blob, team);
      } catch (err) {
        console.error('Photo ZIP export failed:', err);
        toast({
          title: t('zip.failedTitle'),
          description: t('zip.failedDesc'),
        });
      } finally {
        runningRef.current = false;
        setPhase('idle');
        setProgress(null);
      }
    },
    [t, toast],
  );

  return {
    active: phase !== 'idle',
    phase,
    progress,
    start,
  };
}
