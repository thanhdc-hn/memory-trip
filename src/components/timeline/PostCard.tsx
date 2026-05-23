import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Badge } from '@/components/ui/badge';
import { ImageFrame } from '@/components/ui/image-frame';
import { getPostImageUrl } from '@/features/posts/utils/getPostImageUrl';
import type { Post } from '@/services/posts.service';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const timeAgo = dayjs(post.created_at).fromNow();

  const imageUrl = getPostImageUrl(post);

  // Generate a semi-random rotation based on post ID
  const rotation = (parseInt(post.id.substring(0, 8), 16) % 6) - 3;

  return (
    <div
      className="group animate-in fade-in slide-in-from-bottom-2 duration-500"
      onClick={onClick}
    >
      {imageUrl ? (
        <ImageFrame
          src={imageUrl}
          caption={post.caption || undefined}
          rotation={rotation}
          className="w-full cursor-pointer transition-transform active:scale-[0.98]"
        >
          <div className="absolute top-2 left-2">
            <Badge
              variant="nickname"
              className="border-none bg-white/80 shadow-sm backdrop-blur-sm"
            >
              @{post.author_name}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <span className="text-text/40 font-rounded rounded-full bg-white/60 px-2 py-0.5 text-[10px] backdrop-blur-sm">
              {timeAgo}
            </span>
          </div>
        </ImageFrame>
      ) : (
        <div
          className="shadow-polaroid relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-sm bg-white p-6 text-center transition-transform duration-300 hover:rotate-0 active:scale-[0.98]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute top-2 left-2">
            <Badge
              variant="nickname"
              className="bg-sand/20 border-none shadow-sm backdrop-blur-sm"
            >
              @{post.author_name}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <span className="text-text/40 font-rounded px-2 py-0.5 text-[10px]">
              {timeAgo}
            </span>
          </div>
          <p className="font-handwritten text-text px-4 text-xl leading-relaxed">
            {post.caption}
          </p>
          <div className="absolute right-4 bottom-12">
            <span className="text-accent text-2xl">✨</span>
          </div>
        </div>
      )}
    </div>
  );
}
