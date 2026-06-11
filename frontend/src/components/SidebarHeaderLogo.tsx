'use client';

import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Landmark } from 'lucide-react';

export function SidebarHeaderLogo() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          render={
            <Link href="/dashboard">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-lg bg-primary text-primary-foreground p-2">
                  <Landmark className="size-5" />
                </div>
                {state === 'expanded' && (
                  <div className="transition-all duration-200">
                    <div className="font-bold text-sm leading-tight">MEI Finance</div>
                    <div className="text-xs text-muted-foreground leading-none">
                      PJ/PF Organizado
                    </div>
                  </div>
                )}
              </div>
            </Link>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
