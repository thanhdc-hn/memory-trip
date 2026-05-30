import { ArrowLeft, Check } from 'lucide-react';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { AlbumPreview } from '@/components/timeline/AlbumPreview';
import { Button } from '@/components/ui/button';
import { getPostImageUrl } from '@/features/posts/utils/getPostImageUrl';
import { useAlbumExport } from '@/hooks/use-album-export';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { useToast } from '@/hooks/use-toast';
import { generateAlbumPdf } from '@/services/album-pdf';
import { exportService } from '@/services/export.service';
import { type Post } from '@/services/posts.service';
import { cn } from '@/utils/cn';
import { URL_PATH } from '@/utils/constants';

const PAGE_SIZE = 20;

export default function ExportPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { team, loading: teamLoading } = useCurrentTeam();
  const { selectedIds, count, toggle, clear, isSelected } = useAlbumExport();

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
      toast({ title: 'Pick at least one memory to export' });
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
      const { blob, pages } = await generateAlbumPdf(team, selected, imageMap);
      setPreviewBlob(blob);
      setPreviewPages(pages);
    } catch (err) {
      console.error('Album export failed:', err);
      toast({
        title: 'Could not create the album',
        description: 'Please try again.',
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
          aria-label="Back to timeline"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-text-h text-xl font-bold">Pick your memories</div>
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
              {posts.map((post) => {
                const selected = isSelected(post.id);
                const url = getPostImageUrl(post, { width: 300, quality: 60 });
                return (
                  <button
                    key={post.id}
                    type="button"
                    disabled={generating}
                    onClick={() => toggle(post.id)}
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-xl transition-transform active:scale-[0.98]',
                      selected && 'ring-primary ring-4',
                      generating && 'pointer-events-none',
                    )}
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={post.caption || 'Memory'}
                        loading="lazy"
                        className={cn(
                          'h-full w-full object-cover transition-opacity',
                          selected ? 'opacity-100' : 'opacity-90',
                        )}
                      />
                    ) : (
                      <div className="bg-sand/20 flex h-full w-full items-center justify-center p-4">
                        <p className="font-handwritten text-text line-clamp-5 text-center text-lg leading-snug">
                          {post.caption}
                        </p>
                      </div>
                    )}
                    <span
                      className={cn(
                        'absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white transition-colors',
                        selected ? 'bg-primary' : 'bg-black/30',
                      )}
                    >
                      {selected && <Check className="h-4 w-4 text-white" />}
                    </span>
                  </button>
                );
              })}
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
            <p className="font-handwritten text-2xl">
              No memories to export yet
            </p>
          </div>
        )}
      </main>

      {count > 0 && (
        <div className="border-border/50 bg-surface/90 safe-bottom fixed bottom-0 z-40 w-full border-t-2 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
            <span className="text-text font-medium">
              {generating && progress
                ? `Preparing ${progress.loaded}/${progress.total}…`
                : `${count} ${count === 1 ? 'memory' : 'memories'} selected`}
            </span>
            <Button onClick={handleCreateAlbum} disabled={generating}>
              {generating ? 'Creating…' : 'Create Album'}
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
