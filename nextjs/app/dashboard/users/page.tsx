"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavigationDock } from "@/components/navigation-dock";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserManagementPage } from "@/features/users";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const message = params.get("message");
      if (message) {
        toast.success(message);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans relative overflow-hidden">
        <div className="absolute w-80 h-80 bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <svg className="animate-spin h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm">Carregando painel administrativo...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Liquid Blobs */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-emerald-500/4 dark:bg-emerald-500/6 rounded-full blur-[90px] pointer-events-none liquid-blob-1 dark:opacity-0" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 dark:bg-emerald-500/4 rounded-full blur-[90px] pointer-events-none liquid-blob-2 dark:opacity-0" />

      {/* Top Navbar */}
      <header className="border-b border-slate-900/5 dark:border-white/5 bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/20 select-none">
              $
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              MEI Finance
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-slate-800 dark:text-emerald-400">{user.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</span>
            </div>
            <div className="w-px h-6 bg-slate-900/10 dark:bg-white/10 mx-1" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        <UserManagementPage />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/5 dark:border-white/5 py-6 pb-28 text-center text-xs text-slate-500 bg-background/40 mt-auto relative z-10">
        &copy; {new Date().getFullYear()} MEI Finance. Todos os direitos reservados.
      </footer>

      {/* macOS Navigation Dock */}
      <NavigationDock activePage="users" />
    </div>
  );
}
