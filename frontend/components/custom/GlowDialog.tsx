'use client';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface GlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const GlowDialog: React.FC<GlowDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden z-10 transition-transform duration-300 animate-in fade-in zoom-in-95 duration-200",
        className
      )}>
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div>
            {title && (
              typeof title === 'string' ? (
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{title}</h3>
              ) : (
                title
              )
            )}
            {description && <p className="text-[10px] text-zinc-400 mt-0.5">{description}</p>}
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
