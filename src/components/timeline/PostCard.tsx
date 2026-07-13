import dayjs from 'dayjs';

import { useMemo, useState } from 'react';

import { FloatingHeart } from '@/components/timeline/FloatingHeart';
import { HeartButton } from '@/components/timeline/HeartButton';
import { HeartTooltip } from '@/components/timeline/HeartTooltip';
import { PostDetailModal } from '@/components/timeline/PostDetailModal';
import { Badge } from '@/components/ui/badge';
import { ImageFrame } from '@/components/ui/image-frame';
import { usePostImageUrl } from '@/hooks/posts/use-post-image-url';
import { useDoubleTap } from '@/hooks/useDoubleTap';
import { usePostReactions } from '@/hooks/usePostReactions';
import type { Post } from '@/services/posts.service';

interface PostCardProps {
  post: Post;
  isFirst?: boolean;
}

export function PostCard({ post, isFirst = false }: PostCardProps) {
  const formattedDate = dayjs(post.created_at).format('HH:mm');
  const isSupabasePro = import.meta.env.VITE_SUPABASE_PRO === 'true';
  const options = useMemo(
    () => ({ useTransformation: isSupabasePro }),
    [isSupabasePro],
  );
  const { imageUrl } = usePostImageUrl(post, options);
  const { hasHearted, heartCount, toggleHeart, showTooltip } = usePostReactions(
    post.id,
    post.team_id,
  );

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  const HEART_COLORS = [
    '#FF4B4B', // Red
    '#FF69B4', // HotPink
    '#FF1493', // DeepPink
    '#FF8C00', // DarkOrange
    '#FFD700', // Gold
    '#9370DB', // MediumPurple
    '#00CED1', // DarkTurquoise
    '#FF7F50', // Coral
  ];

  const onDoubleTap = useDoubleTap({
    onDoubleTap: (coords) => {
      if (!hasHearted) {
        toggleHeart();
      }
      const randomColor =
        HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      const newHeart = {
        id: Date.now(),
        x: coords.x,
        y: coords.y,
        color: randomColor,
      };
      setFlyingHearts((prev) => [...prev, newHeart]);
    },
    onSingleTap: () => {
      if (imageUrl) {
        setIsDetailOpen(true);
      }
    },
  });

  // Generate a semi-random rotation based on post ID
  const rotation = (parseInt(post.id.substring(0, 8), 16) % 6) - 3;

  return (
    <div className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
      {imageUrl && (
        <PostDetailModal
          post={post}
          imageUrl={imageUrl}
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
      {imageUrl ? (
        <div className="relative touch-manipulation" onClick={onDoubleTap}>
          {flyingHearts.map((heart) => (
            <FloatingHeart
              key={heart.id}
              x={heart.x}
              y={heart.y}
              color={heart.color}
              onComplete={() => {
                setFlyingHearts((prev) =>
                  prev.filter((h) => h.id !== heart.id),
                );
              }}
            />
          ))}
          <HeartTooltip show={showTooltip && isFirst} />
          <ImageFrame
            src={imageUrl}
            caption={post.caption || undefined}
            rotation={rotation}
            className="bg-paper w-full cursor-pointer touch-manipulation transition-transform select-none active:scale-[0.98]"
          >
            <div className="absolute top-2 left-2">
              <Badge
                variant="nickname"
                className="bg-paper-text/10 border-none text-white shadow-sm backdrop-blur-sm"
              >
                @{post.author_name}
              </Badge>
            </div>

            <div className="absolute right-3 bottom-10">
              <HeartButton
                hasHearted={hasHearted}
                heartCount={heartCount}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHeart();
                }}
              />
            </div>
          </ImageFrame>
          <div className="flex items-center justify-end px-2 pt-3">
            <span className="text-text/70 font-rounded text-lg">
              {formattedDate}
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="shadow-polaroid bg-paper relative flex aspect-square cursor-pointer touch-manipulation flex-col items-center justify-center rounded-sm p-6 text-center transition-transform duration-300 hover:rotate-0 active:scale-[0.98]"
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={onDoubleTap}
          >
            {flyingHearts.map((heart) => (
              <FloatingHeart
                key={heart.id}
                x={heart.x}
                y={heart.y}
                color={heart.color}
                onComplete={() => {
                  setFlyingHearts((prev) =>
                    prev.filter((h) => h.id !== heart.id),
                  );
                }}
              />
            ))}
            <HeartTooltip show={showTooltip && isFirst} />
            <div className="absolute top-2 left-2">
              <Badge
                variant="nickname"
                className="bg-sand/20 border-none text-white shadow-sm backdrop-blur-sm"
              >
                @{post.author_name}
              </Badge>
            </div>
            <p className="font-handwritten text-paper-text px-4 text-xl leading-relaxed">
              {post.caption}
            </p>
            <div className="absolute right-4 bottom-12">
              <span className="text-accent text-2xl">✨</span>
            </div>

            <div className="absolute right-4 bottom-4">
              <HeartButton
                hasHearted={hasHearted}
                heartCount={heartCount}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHeart();
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end px-2 pt-3">
            <span className="text-text/50 font-rounded text-lg">
              {formattedDate}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
