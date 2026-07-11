import { useMemo } from 'react';

import { usePostImageUrl } from '@/hooks/posts/use-post-image-url';
import type { Post } from '@/services/posts.service';

interface PostThumbnailProps {
  post: Post;
  isSelected: boolean;
  isCover: boolean;
  generating: boolean;
  onToggle: (id: string) => void;
  onSetCover: (id: string) => void;
  t: (key: string, options?: any) => string;
}

export function PostThumbnail({
  post,
  isSelected,
  isCover,
  generating,
  onToggle,
  onSetCover,
  t,
}: PostThumbnailProps) {
  const isSupabasePro = import.meta.env.VITE_SUPABASE_PRO === 'true';
  const options = useMemo(
    () => ({
      width: 300,
      quality: 60,
      useTransformation: isSupabasePro,
    }),
    [isSupabasePro],
  );

  const { imageUrl: url } = usePostImageUrl(post, options);

  return (
    <button
      type="button"
      disabled={generating}
      onClick={() => onToggle(post.id)}
      className={`relative aspect-square overflow-hidden rounded-xl transition-transform active:scale-[0.98] ${
        isSelected ? 'ring-primary ring-4' : ''
      } ${generating ? 'pointer-events-none' : ''}`}
    >
      {url ? (
        <img
          src={url}
          alt={post.caption || t('memoryAlt')}
          loading="lazy"
          className={`h-full w-full object-cover transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-90'
          }`}
        />
      ) : (
        <div className="bg-sand/20 flex h-full w-full items-center justify-center p-4">
          <p className="font-handwritten text-text line-clamp-5 text-center text-lg leading-snug">
            {post.caption}
          </p>
        </div>
      )}
      <span
        className={`absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white transition-colors ${
          isSelected ? 'bg-primary' : 'bg-black/30'
        }`}
      >
        {isSelected && (
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      {isSelected && url && (
        <span
          role="button"
          tabIndex={0}
          aria-label={isCover ? t('cover.unset') : t('cover.set')}
          onClick={(e) => {
            e.stopPropagation();
            onSetCover(post.id);
          }}
          className={`absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white transition-colors ${
            isCover ? 'bg-accent' : 'bg-black/40'
          }`}
        >
          <svg
            className={`h-4 w-4 text-white ${isCover ? 'fill-white' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </span>
      )}
      {isCover && (
        <span className="bg-accent absolute bottom-2 left-10 rounded-full px-2 py-0.5 text-xs font-medium text-white">
          {t('cover.badge')}
        </span>
      )}
    </button>
  );
}
