'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  LogOut, 
  User, 
  LayoutDashboard, 
  TrendingUp, 
  Building2,
  ChevronsLeftRight
} from 'lucide-react';

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  receitas: 'Fluxo de Caixa',
};
import { cn } from '@/lib/utils';
import { GlowButton } from '@/components/custom/GlowUI';
import { toast } from 'sonner';
import { logout } from '@/services/auth.service';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navItems = [
    { title: 'Painel Geral', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Fluxo de Caixa', url: '/dashboard/receitas', icon: TrendingUp },
  ];

  const currentPathName = pathname === '/dashboard' ? 'Painel Geral' : 'Fluxo de Caixa';

  const userName = session?.user?.name || 'Microempreendedor';
  const userFirstName = userName.split(' ')[0];
  const userEmail = session?.user?.email || '';

  const segments = pathname
    .split('/')
    .filter((segment) => segment && segment !== '(dashboard)');

  const breadcrumbs = useMemo(() => {
    return [
      { 
        label: 'Início', 
        href: '/dashboard', 
        isLast: segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard') 
      },
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
  }, [segments]);

  const handleLogout = async () => {
    let message = 'Sessão encerrada com sucesso!';
    try {
      const token = (session as any)?.accessToken;
      if (token) {
        const response = await logout(token);
        if (response && response.success && response.message) {
          message = response.message;
        }
      }
    } catch (e) {
      // Silenciosamente ignora erros de rede para assegurar que o logout no cliente ocorra de qualquer forma
    }
    await signOut({ redirect: false });
    toast.success(message);
    router.push('/login');
  };

  return (
    <div className="h-screen flex bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/80 transition-all duration-300 shrink-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-sm">
              MF
            </div>
            {!isCollapsed && (
              <div className="flex flex-col select-none animate-in fade-in duration-200">
                <span className="font-semibold text-xs tracking-tight text-gray-900 dark:text-white leading-tight">MEI Finance</span>
                <span className="text-[9px] text-zinc-400 font-mono leading-none">PJ & PF Organizado</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;
            return (
              <Link 
                key={item.url}
                href={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all group",
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-950 dark:hover:text-white"
                )}
              >
                <Icon className="size-5 shrink-0 transition-transform group-hover:scale-105" />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Menu */}
        <div className="p-3 border-t border-zinc-150 dark:border-zinc-800/80 shrink-0 relative">
          <button 
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold uppercase">
              {userName.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                  {userFirstName}
                </p>
                <p className="text-[10px] text-zinc-400 truncate font-mono">
                  {userEmail}
                </p>
              </div>
            )}
            {!isCollapsed && (
              isUserDropdownOpen ? <ChevronUp className="size-4 text-zinc-400 shrink-0" /> : <ChevronDown className="size-4 text-zinc-400 shrink-0" />
            )}
          </button>

          {/* Custom user dropdown menu */}
          {isUserDropdownOpen && !isCollapsed && (
            <div className="absolute bottom-16 left-3 right-3 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80 select-none">
                <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Conta ativa</p>
                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate mt-0.5">{userName}</p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">{userEmail}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors cursor-pointer mt-1"
              >
                <LogOut className="size-4" />
                <span>Sair da Conta</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200/50 dark:border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <ChevronsLeftRight className="size-4" />
            </button>
            
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-semibold select-none">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="size-3.5 text-zinc-300 dark:text-zinc-700" />}
                    <li>
                      {crumb.isLast ? (
                        <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link href={crumb.href} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </nav>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-850 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
              MF
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-950 dark:text-white">MEI Finance</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <Menu className="size-5" />
          </button>
        </header>

        {/* Mobile Drawer */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            
            {/* Drawer Content */}
            <div className="relative w-64 max-w-sm bg-white dark:bg-zinc-950 p-4 flex flex-col h-full z-10 animate-in slide-in-from-left duration-250">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
                <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    MF
                  </div>
                  <span className="font-bold text-sm text-gray-950 dark:text-white">MEI Finance</span>
                </Link>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.url;
                  return (
                    <Link 
                      key={item.url}
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors",
                        isActive 
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" 
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon className="size-5 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold uppercase">
                    {userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {userName}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate font-mono">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <GlowButton
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full py-2"
                >
                  Sair
                </GlowButton>
              </div>
            </div>
          </div>
        )}

        {/* Main Slot Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
