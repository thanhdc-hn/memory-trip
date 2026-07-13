import dayjs from 'dayjs';
import { Download, X } from 'lucide-react';

import { HeartButton } from '@/components/timeline/HeartButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDoubleTap } from '@/hooks/useDoubleTap';
import { usePostReactions } from '@/hooks/usePostReactions';
import type { Post } from '@/services/posts.service';

interface PostDetailModalProps {
  post: Post;
  imageUrl: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostDetailModal({
  post,
  imageUrl,
  isOpen,
  onOpenChange,
}: PostDetailModalProps) {
  const formattedDate = dayjs(post.created_at).format('MMMM D, YYYY · HH:mm');
  const { hasHearted, heartCount, toggleHeart } = usePostReactions(
    post.id,
    post.team_id,
  );

  const onDoubleTap = useDoubleTap({
    onDoubleTap: () => toggleHeart(),
  });

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `memory-trip-${post.author_name}-${post.id.substring(0, 8)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:rounded-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Post Detail</DialogTitle>
        </DialogHeader>

        <div className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleDownload}
              className="border-none bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="border-none bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
              title="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Metadata Top */}
          <div className="pointer-events-none absolute top-4 left-4 z-50 flex flex-col gap-1">
            <Badge
              variant="nickname"
              className="w-fit border-none bg-black/40 text-white shadow-sm backdrop-blur-md"
            >
              @{post.author_name}
            </Badge>
            <div className="w-fit rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-md">
              <span className="font-rounded text-xs text-white">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="flex h-full w-full items-center justify-center overflow-hidden p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) onOpenChange(false);
            }}
          >
            <div className="relative flex max-w-full flex-col items-center">
              <div
                className="relative cursor-pointer touch-manipulation"
                onClick={onDoubleTap}
              >
                <img
                  src={imageUrl}
                  alt={post.caption || 'Post image'}
                  className="max-h-[70vh] w-auto rounded-lg shadow-2xl"
                  draggable={false}
                />

                <div className="absolute right-4 bottom-4">
                  <HeartButton
                    hasHearted={hasHearted}
                    heartCount={heartCount}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHeart();
                    }}
                    className="border-none bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
                  />
                </div>
              </div>

              {post.caption && (
                <div className="font-handwritten pointer-events-auto mt-6 max-h-[30vh] max-w-lg scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent overflow-y-auto rounded-lg bg-black/40 p-6 text-center text-2xl text-white backdrop-blur-sm select-text">
                  {post.caption}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
