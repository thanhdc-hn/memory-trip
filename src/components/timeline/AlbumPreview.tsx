import { Download, Share2, X } from 'lucide-react';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { downloadAlbumPdf, shareAlbumPdf } from '@/services/album-pdf';
import type { PublicTeam } from '@/services/public-team.service';

interface AlbumPreviewProps {
  blob: Blob;
  team: PublicTeam;
  onClose: () => void;
}

export function AlbumPreview({ blob, team, onClose }: AlbumPreviewProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  const canShare =
    typeof navigator !== 'undefined' && !!navigator.canShare?.({ files: [] });

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

      <iframe
        src={url}
        title="Album preview"
        className="min-h-0 w-full flex-1 bg-white"
      />

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
