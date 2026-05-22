import { Sparkles } from 'lucide-react';

import { CenteredContent } from '@/components/layout/layout-primitives';

export function EmptyTimelineState() {
  return (
    <CenteredContent className="px-4 py-20">
      <div className="animate-float text-6xl">✨</div>
      <div className="space-y-2">
        <h3 className="text-text-h text-2xl font-bold">No memories yet!</h3>
        <p className="font-handwritten text-text/60 text-xl">
          Drop the first memory and start our shared scrapbook! 📔
        </p>
      </div>
      <div className="text-primary font-rounded flex items-center gap-2 text-sm">
        <Sparkles className="h-4 w-4" />
        <span>Click the plus button to add a photo</span>
      </div>
    </CenteredContent>
  );
}
