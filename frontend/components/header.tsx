'use client';

import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  receitas: 'Fluxo de Caixa',
};

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  const pathname = usePathname();

  const segments = pathname
    .split('/')
    .filter((segment) => segment && segment !== '(dashboard)');

  const breadcrumbs = [
    { label: 'Início', href: '/dashboard', isLast: segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard') },
    ...segments
      .filter((segment) => segment !== 'dashboard')
      .map((segment, idx, filtered) => {
        const isLast = idx === filtered.length - 1;
        const href = '/dashboard/' + filtered.slice(0, idx + 1).join('/');

        return {
          label: BREADCRUMB_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
          href,
          isLast,
        };
      }),
  ];

  return (
    <header className="relative bg-white dark:bg-zinc-950 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-200/50 dark:border-zinc-800/80 px-6 select-none z-10">
      <div className="flex items-center gap-2">
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="size-3.5 text-zinc-300 dark:text-zinc-700" />}
                <li>
                  {crumb.isLast ? (
                    <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>

      {children && (
        <div className="flex items-center">
          {children}
        </div>
      )}
    </header>
  );
}
