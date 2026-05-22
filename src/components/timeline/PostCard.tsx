import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Post } from '@/services/posts.service';
import { storageService } from '@/services/storage.service';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const timeAgo = dayjs(post.created_at).fromNow();
  const imageUrl = post.image_path
    ? storageService.getPublicUrl(post.image_path)
    : null;

  return (
    <Card
      className="border-border shadow-soft cursor-pointer overflow-hidden rounded-3xl border-2 transition-all active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="nickname"
            className="bg-primary/10 text-primary border-primary/20"
          >
            @{post.author_name}
          </Badge>
          <span className="text-text/40 font-rounded text-xs">{timeAgo}</span>
        </div>

        {imageUrl && (
          <div className="border-border bg-sand/5 relative aspect-square overflow-hidden rounded-2xl border-2">
            <img
              src={imageUrl}
              alt={post.caption || 'Memory'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {post.caption && (
          <p className="font-handwritten text-text line-clamp-3 px-2 text-lg">
            {post.caption}
          </p>
        )}
      </div>
    </Card>
  );
}
