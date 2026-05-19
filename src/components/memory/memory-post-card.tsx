import { Heart } from 'lucide-react';

import { type HTMLAttributes, forwardRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageFrame } from '@/components/ui/image-frame';
import { cn } from '@/lib/utils';

interface MemoryPostCardProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  author: string;
  authorAvatar?: string;
  date: string;
  likes?: number;
  comments?: number;
  tags?: string[];
  rotation?: number;
}

export const MemoryPostCard = forwardRef<HTMLDivElement, MemoryPostCardProps>(
  (
    {
      imageUrl,
      title,
      author,
      authorAvatar,
      date,
      likes = 0,
      comments = 0,
      tags = [],
      rotation = 0,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn('group flex flex-col gap-3', className)}
        {...props}
      >
        <ImageFrame
          src={imageUrl}
          caption={title}
          rotation={rotation}
          className="w-full"
        >
          <div className="absolute top-2 left-2">
            <Badge
              variant="nickname"
              className="border-none bg-white/80 shadow-sm backdrop-blur-sm"
            >
              {author}
            </Badge>
          </div>
          <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </ImageFrame>

        <div className="flex items-center justify-between px-2">
          <div className="flex gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="tag">
                #{tag}
              </Badge>
            ))}
          </div>
          <span className="text-text/50 font-rounded text-xs">{date}</span>
        </div>
      </div>
    );
  },
);
MemoryPostCard.displayName = 'MemoryPostCard';
