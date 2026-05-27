import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useRef, useState } from 'react';

import { FloatingHearts } from '@/components/timeline/FloatingHearts';
import { FlyToLikeHeart } from '@/components/timeline/FlyToLikeHeart';
import { HeartButton } from '@/components/timeline/HeartButton';
import { HeartTooltip } from '@/components/timeline/HeartTooltip';
import { Badge } from '@/components/ui/badge';
import { ImageFrame } from '@/components/ui/image-frame';
import { getPostImageUrl } from '@/features/posts/utils/getPostImageUrl';
import { useDoubleTap } from '@/hooks/useDoubleTap';
import { usePostReactions } from '@/hooks/usePostReactions';
import type { Post } from '@/services/posts.service';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  onClick: () => void;
  isFirst?: boolean;
}

export function PostCard({ post, onClick, isFirst = false }: PostCardProps) {
  const timeAgo = dayjs(post.created_at).fromNow();
  const imageUrl = getPostImageUrl(post);
  const { hasHearted, heartCount, toggleHeart, showTooltip } = usePostReactions(
    post.id,
    post.team_id,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [floatTrigger, setFloatTrigger] = useState(0);
  const [isSadAnimation, setIsSadAnimation] = useState(false);
  const [isDoubleInteraction, setIsDoubleInteraction] = useState(false);
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [flyTrigger, setFlyTrigger] = useState(0);
  const [flyFrom, setFlyFrom] = useState<{ x: number; y: number } | null>(null);
  const [flyTo, setFlyTo] = useState<{ x: number; y: number } | null>(null);

  const launchFlyToLike = (coords: { x: number; y: number }) => {
    const container = containerRef.current;
    if (!container) return;

    const target = container.querySelector('[data-heart-target]');
    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    setFlyFrom(coords);
    setFlyTo({
      x: targetRect.left + targetRect.width / 2 - containerRect.left,
      y: targetRect.top + targetRect.height / 2 - containerRect.top,
    });
    setFlyTrigger((t) => t + 1);
  };

  const triggerReactionAnimation = (
    coords: { x: number; y: number } | null,
    fromDoubleTap: boolean,
  ) => {
    const willAdd = !hasHearted;

    setClickCoord(coords);
    setIsDoubleInteraction(fromDoubleTap);
    setIsSadAnimation(!willAdd);

    if (willAdd && fromDoubleTap && coords) {
      launchFlyToLike(coords);
    }
    setFloatTrigger((t) => t + 1);
    toggleHeart();
  };

  const onDoubleTap = useDoubleTap({
    onDoubleTap: (coords) => triggerReactionAnimation(coords, true),
  });

  const onHeartClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerReactionAnimation(
      {
        x: e.clientX - rect.left + rect.width / 2,
        y: e.clientY - rect.top + rect.height / 2,
      },
      false,
    );
  };

  // Generate a semi-random rotation based on post ID
  const rotation = (parseInt(post.id.substring(0, 8), 16) % 6) - 3;

  return (
    <div
      className="group animate-in fade-in slide-in-from-bottom-2 duration-500"
      onClick={onClick}
    >
      {imageUrl ? (
        <div
          ref={containerRef}
          className="relative touch-manipulation"
          onClick={onDoubleTap}
        >
          <FloatingHearts
            trigger={floatTrigger}
            isSad={isSadAnimation}
            x={clickCoord?.x}
            y={clickCoord?.y}
            isDoubleInteraction={isDoubleInteraction}
          />
          <FlyToLikeHeart trigger={flyTrigger} from={flyFrom} to={flyTo} />
          <HeartTooltip show={showTooltip && isFirst} />
          <ImageFrame
            src={imageUrl}
            caption={post.caption || undefined}
            rotation={rotation}
            className="w-full cursor-pointer touch-manipulation transition-transform select-none active:scale-[0.98]"
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

            <div className="absolute right-3 bottom-10">
              <HeartButton
                hasHearted={hasHearted}
                heartCount={heartCount}
                onClick={onHeartClick}
              />
            </div>
          </ImageFrame>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="shadow-polaroid relative flex aspect-square cursor-pointer touch-manipulation flex-col items-center justify-center rounded-sm bg-white p-6 text-center transition-transform duration-300 hover:rotate-0 active:scale-[0.98]"
          style={{ transform: `rotate(${rotation}deg)` }}
          onClick={onDoubleTap}
        >
          <FloatingHearts
            trigger={floatTrigger}
            isSad={isSadAnimation}
            x={clickCoord?.x}
            y={clickCoord?.y}
            isDoubleInteraction={isDoubleInteraction}
          />
          <FlyToLikeHeart trigger={flyTrigger} from={flyFrom} to={flyTo} />
          <HeartTooltip show={showTooltip && isFirst} />
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

          <div className="absolute right-4 bottom-4">
            <HeartButton
              hasHearted={hasHearted}
              heartCount={heartCount}
              onClick={onHeartClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
