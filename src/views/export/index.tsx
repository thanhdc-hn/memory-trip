import { ArrowLeft } from 'lucide-react';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { AlbumPreview } from '@/components/timeline/AlbumPreview';
import { Button } from '@/components/ui/button';
import { useAlbumExport } from '@/hooks/use-album-export';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useToast } from '@/hooks/use-toast';
import { generateAlbumPdf } from '@/services/album-pdf';
import { exportService } from '@/services/export.service';
import { type Post } from '@/services/posts.service';
import { URL_PATH } from '@/utils/constants';

import { PostThumbnail } from './PostThumbnail';

const PAGE_SIZE = 20;

export default function ExportPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('export');
  const { toast } = useToast();
  const { team, loading: teamLoading } = useCurrentTeam();
  const { selectedIds, count, coverId, toggle, setCover, clear, isSelected } =
    useAlbumExport();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<{
    loaded: number;
    total: number;
  } | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const pageRef = useRef(0);

  const { ref: sentinelRef, inView } = useInView({ rootMargin: '200px' });

  const loadPage = useCallback(
    async (page: number) => {
      if (!team) return;
      try {
        const batch = await exportService.fetchExportablePosts(
          team.id,
          page,
          PAGE_SIZE,
        );
        setPosts((prev) => (page === 0 ? batch : [...prev, ...batch]));
        setHasMore(batch.length === PAGE_SIZE);
        pageRef.current = page;
      } catch (err) {
        console.error('Failed to load memories:', err);
      }
    },
    [team],
  );

  useEffect(() => {
    if (!team) return;
    setLoading(true);
    loadPage(0).finally(() => setLoading(false));
  }, [team, loadPage]);

  useEffect(() => {
    if (!inView || loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    loadPage(pageRef.current + 1).finally(() => setLoadingMore(false));
  }, [inView, loading, loadingMore, hasMore, loadPage]);

  const isLoading = teamLoading || loading;

  const handleCreateAlbum = async () => {
    if (!team || generating) return;
    if (count === 0) {
      toast({ title: t('toasts.pickOne') });
      return;
    }

    // Preserve the on-screen (oldest-first) order.
    const selected = posts.filter((p) => selectedIds.has(p.id));
    const controller = new AbortController();

    setGenerating(true);
    setProgress({
      loaded: 0,
      total: selected.filter((p) => p.image_path).length,
    });
    try {
      const imageMap = await exportService.fetchPostThumbnails(selected, {
        signal: controller.signal,
        onProgress: setProgress,
      });
      // The cover is full-bleed, so fetch a high-res version of the chosen cover
      // photo (the 500px album thumbnail looks soft when stretched to a page).
      let coverDataUrl: string | null = null;
      const coverPost = coverId ? selected.find((p) => p.id === coverId) : null;
      if (coverPost?.image_path) {
        try {
          coverDataUrl = await exportService.fetchImageDataUrl(
            coverPost.image_path,
            1920,
            90,
            controller.signal,
          );
        } catch (err) {
          console.error('High-res cover fetch failed, using thumbnail:', err);
        }
      }
      const { blob, pages } = await generateAlbumPdf(
        team,
        selected,
        imageMap,
        coverId,
        coverDataUrl,
      );
      setPreviewBlob(blob);
      setPreviewPages(pages);
    } catch (err) {
      console.error('Album export failed:', err);
      toast({
        title: t('toasts.failedTitle'),
        description: t('toasts.failedDesc'),
      });
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  };

  const handleClosePreview = () => {
    setPreviewBlob(null);
    setPreviewPages([]);
    clear();
    navigate(URL_PATH.TIMELINE);
  };

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center">
      <header className="bg-surface/80 border-border/50 safe-top sticky top-0 z-40 flex w-full items-center gap-2 border-b-2 px-4 py-4 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(URL_PATH.TIMELINE)}
          aria-label={t('back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-text-h text-xl font-bold">{t('title')}</div>
      </header>

      <main className="w-full max-w-2xl flex-1 px-4 py-6 pb-28">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-sand/30 aspect-square animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {posts.map((post) => (
                <PostThumbnail
                  key={post.id}
                  post={post}
                  isSelected={isSelected(post.id)}
                  isCover={coverId === post.id}
                  generating={generating}
                  onToggle={toggle}
                  onSetCover={setCover}
                  t={t}
                />
              ))}
            </div>
            {hasMore && (
              <div
                ref={sentinelRef}
                className="flex justify-center py-6"
                aria-hidden
              >
                {loadingMore && (
                  <div className="border-primary h-6 w-6 animate-spin rounded-full border-3 border-t-transparent" />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-text/60 mt-16 text-center">
            <p className="font-handwritten text-2xl">{t('empty')}</p>
          </div>
        )}
      </main>

      {count > 0 && (
        <div className="border-border/50 bg-surface/90 safe-bottom fixed bottom-0 z-40 w-full border-t-2 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
            <span className="text-text font-medium">
              {generating && progress
                ? t('preparing', {
                    loaded: progress.loaded,
                    total: progress.total,
                  })
                : t('selected', { count })}
            </span>
            <Button onClick={handleCreateAlbum} disabled={generating}>
              {generating ? t('creating') : t('createAlbum')}
            </Button>
          </div>
        </div>
      )}
      {previewBlob && team && (
        <AlbumPreview
          blob={previewBlob}
          pages={previewPages}
          team={team}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
}
