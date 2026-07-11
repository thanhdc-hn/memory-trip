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
        className={cn(
          'bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] fixed top-[50%] left-[50%] z-50 flex w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col border p-6 shadow-lg duration-200 focus:outline-none sm:rounded-3xl',
          'flex max-h-[95vh] flex-col overflow-hidden',
          contentClassName,
        )}
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
