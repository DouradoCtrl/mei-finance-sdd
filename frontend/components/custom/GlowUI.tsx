import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const GlowCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 transition-all duration-300",
          glow && "shadow-[0_0_20px_rgba(16,185,129,0.02)] hover:shadow-[0_0_25px_rgba(16,185,129,0.08)] hover:border-emerald-500/20",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlowCard.displayName = 'GlowCard';

// Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const GlowInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 dark:text-white",
          className
        )}
        {...props}
      />
    );
  }
);
GlowInput.displayName = 'GlowInput';

// Label
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const GlowLabel = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none mb-1.5 block",
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);
GlowLabel.displayName = 'GlowLabel';

// Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const GlowButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, variant = 'primary', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]",
          variant === 'primary' && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30",
          variant === 'secondary' && "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white border border-zinc-200/50 dark:border-zinc-700/50",
          variant === 'danger' && "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30",
          variant === 'ghost' && "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span>Aguarde...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
GlowButton.displayName = 'GlowButton';

// Badge
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'emerald' | 'sky' | 'rose' | 'amber' | 'gray';
  fill?: boolean;
}

export const GlowBadge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color = 'gray', fill = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 select-none",
          color === 'emerald' && (fill ? "bg-emerald-500 text-white border-transparent" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"),
          color === 'sky' && (fill ? "bg-sky-500 text-white border-transparent" : "bg-sky-500/10 text-sky-500 border-sky-500/20"),
          color === 'rose' && (fill ? "bg-red-500 text-white border-transparent" : "bg-red-500/10 text-red-500 border-red-500/20"),
          color === 'amber' && (fill ? "bg-amber-500 text-white border-transparent" : "bg-amber-500/10 text-amber-500 border-amber-500/20"),
          color === 'gray' && (fill ? "bg-zinc-500 text-white border-transparent" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"),
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
GlowBadge.displayName = 'GlowBadge';
