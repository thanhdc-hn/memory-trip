import * as DialogPrimitives from '@radix-ui/react-dialog';

import { useTranslation } from 'react-i18next';

import {
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ZipPhase } from '@/hooks/use-photo-zip';

interface ZipProgressModalProps {
  open: boolean;
  phase: ZipPhase;
  progress: { loaded: number; total: number } | null;
}

/**
 * A progress dialog the user cannot dismiss while a photo ZIP is being built.
 * Escape, outside-click and pointer-down-outside are all prevented, and there
 * is no close button. It closes only when the parent flips `open` to false
 * (i.e. the flow finished or failed).
 */
export function ZipProgressModal({
  open,
  phase,
  progress,
}: ZipProgressModalProps) {
  const { t } = useTranslation('timeline');

  const status =
    phase === 'zipping' && progress
      ? t('zip.zipping', { loaded: progress.loaded, total: progress.total })
      : phase === 'packaging'
        ? t('zip.packaging')
        : t('zip.preparing');

  const pct =
    phase === 'zipping' && progress && progress.total > 0
      ? Math.round((progress.loaded / progress.total) * 100)
      : phase === 'packaging'
        ? 100
        : null;

  return (
    <DialogPrimitives.Root open={open}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitives.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 bg-surface fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl border-2 border-gray-200 p-6 shadow-lg duration-200"
        >
          <DialogTitle className="text-text-h text-center text-lg font-bold">
            {t('zip.title')}
          </DialogTitle>

          <div className="flex flex-col items-center gap-4 py-2">
            <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-text font-medium">{status}</p>

            {pct !== null && (
              <div className="bg-sand/40 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}

            <p className="text-text/50 text-center text-xs">
              {t('zip.doNotClose')}
            </p>
          </div>
        </DialogPrimitives.Content>
      </DialogPortal>
    </DialogPrimitives.Root>
  );
}
