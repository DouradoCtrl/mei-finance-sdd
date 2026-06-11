import React from 'react';
import { cn } from '@/lib/utils';

export const GlowTableContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm",
        className
      )}
      {...props}
    >
      <div className="overflow-x-auto w-full">
        {children}
      </div>
    </div>
  );
};

export const GlowTable: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <table 
      className={cn("w-full text-sm text-left border-collapse", className)}
      {...props}
    >
      {children}
    </table>
  );
};

export const GlowTableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <thead 
      className={cn(
        "bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200/30 dark:border-zinc-800/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

export const GlowTableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tbody 
      className={cn("divide-y divide-zinc-100 dark:divide-zinc-800/85", className)}
      {...props}
    >
      {children}
    </tbody>
  );
};

export const GlowTableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tr 
      className={cn(
        "hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

export const GlowTableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <th 
      className={cn("px-5 py-3.5 font-bold text-left", className)}
      {...props}
    >
      {children}
    </th>
  );
};

export const GlowTableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td 
      className={cn("px-5 py-4 text-xs text-zinc-650 dark:text-zinc-350", className)}
      {...props}
    >
      {children}
    </td>
  );
};
