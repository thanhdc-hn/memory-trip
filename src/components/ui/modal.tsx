'use client';

import { type ReactNode, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
}

export function Modal({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  contentClassName,
}: ModalProps) {
  // Fix for iOS scroll lock issue when modal is closed
  useEffect(() => {
    if (!open) {
      // Small delay to ensure Radix has finished its own cleanup
      const timer = setTimeout(() => {
        const hasOtherModals = document.querySelector('[role="dialog"]');
        if (!hasOtherModals) {
          document.body.style.pointerEvents = '';
          document.body.style.overflow = '';
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn('flex max-h-[90vh] flex-col', contentClassName)}
      >
        {(title || description) && (
          <DialogHeader className="shrink-0">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="flex-1 overflow-y-auto px-1 pb-1">{children}</div>
        {footer && <DialogFooter className="shrink-0">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
