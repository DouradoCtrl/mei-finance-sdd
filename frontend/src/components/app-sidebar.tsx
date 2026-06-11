'use client';

import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { SidebarHeaderLogo } from '@/components/SidebarHeaderLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { LayoutDashboard, UploadCloud } from 'lucide-react';

const data = {
  navMain: [
    {
      title: 'Geral',
      url: '/dashboard',
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      title: 'Importar Extrato',
      url: '/dashboard/importar',
      icon: <UploadCloud className="size-4" />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarHeaderLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Financeiro" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
