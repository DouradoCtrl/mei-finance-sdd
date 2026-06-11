'use client';

import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  receitas: 'Receitas',
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
    <header className="relative z-50 bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage className="text-sm font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href} className="text-sm">
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {children && (
        <div className="flex items-center">
          {children}
        </div>
      )}
    </header>
  );
}
