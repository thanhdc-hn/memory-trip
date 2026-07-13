import dayjs from 'dayjs';

import { type HTMLAttributes, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { ImageFrame } from '@/components/ui/image-frame';
import { cn } from '@/lib/utils';
import { getDateFormat } from '@/utils/time';

interface MemoryPostCardProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
  title: string;
  author: string;
  date: string;
  rotation?: number;
}

export const MemoryPostCard = forwardRef<HTMLDivElement, MemoryPostCardProps>(
  (
    { imageUrl, title, author, date, rotation = 0, className, ...props },
    ref,
  ) => {
    const { i18n } = useTranslation();
    const formattedDate = dayjs(date).format(getDateFormat(i18n.language));

    return (
      <div
        ref={ref}
        className={cn('group flex flex-col gap-3', className)}
        {...props}
      >
        {imageUrl ? (
          <ImageFrame
            src={imageUrl}
            caption={title}
            rotation={rotation}
            className="bg-paper w-full"
          >
            <div className="absolute top-2 left-2">
              <Badge
                variant="nickname"
                className="bg-paper-text/10 border-none text-white shadow-sm backdrop-blur-sm"
              >
                {author}
              </Badge>
            </div>
          </ImageFrame>
        ) : (
          <div
            className="shadow-polaroid bg-paper relative flex aspect-square flex-col items-center justify-center rounded-sm p-6 text-center transition-transform duration-300 hover:rotate-0"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute top-2 left-2">
              <Badge
                variant="nickname"
                className="bg-paper-text/10 border-none text-white shadow-sm backdrop-blur-sm"
              >
                {author}
              </Badge>
            </div>
            <p className="font-handwritten text-paper-text text-xl leading-relaxed">
              {title}
            </p>
            <div className="absolute right-2 bottom-2">
              <span className="text-accent text-2xl">✨</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end px-2">
          <span className="text-text/60 font-rounded text-xs">
            {formattedDate}
          </span>
        </div>
      </div>
    );
  },
);
MemoryPostCard.displayName = 'MemoryPostCard';
