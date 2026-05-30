import { Download, Share2, X } from 'lucide-react';
import { useScrollLock } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { downloadAlbumPdf, shareAlbumPdf } from '@/services/album-pdf';
import type { PublicTeam } from '@/services/public-team.service';

interface AlbumPreviewProps {
  blob: Blob;
  pages: string[];
  team: PublicTeam;
  onClose: () => void;
}

export function AlbumPreview({
  blob,
  pages,
  team,
  onClose,
}: AlbumPreviewProps) {
  useScrollLock();
  const file = new File([blob], 'album.pdf', { type: 'application/pdf' });
  const canShare =
    typeof navigator !== 'undefined' &&
    !!navigator.canShare?.({ files: [file] });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="safe-top flex items-center justify-between px-4 py-3">
        <span className="font-handwritten text-lg text-white">
          Your album preview
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {pages.map((page, i) => (
            <img
              key={i}
              src={page}
              alt={`Album page ${i + 1}`}
              className="w-full rounded-sm bg-white shadow-lg"
            />
          ))}
        </div>
      </div>

      <div className="safe-bottom flex gap-3 px-4 py-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => downloadAlbumPdf(blob, team)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        {canShare && (
          <Button className="flex-1" onClick={() => shareAlbumPdf(blob, team)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
