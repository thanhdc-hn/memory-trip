import { ArrowUp } from 'lucide-react';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  newPostsCount?: number;
}

export function ScrollToTopButton({
  newPostsCount = 0,
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={cn(
        'fixed right-8 bottom-8 z-50 transition-all duration-300',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-10 opacity-0',
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        onClick={scrollToTop}
        className="h-12 w-12 rounded-full shadow-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />

        {newPostsCount > 0 && (
          <span className="bg-primary animate-in zoom-in fade-in absolute -top-2 -right-2 flex h-6 w-6 animate-bounce items-center justify-center rounded-full text-[10px] font-black text-white shadow-md ring-2 ring-white duration-1000">
            {newPostsCount > 9 ? '9+' : newPostsCount}
          </span>
        )}
      </Button>
    </div>
  );
}
