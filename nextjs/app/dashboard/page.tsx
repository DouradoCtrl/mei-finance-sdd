"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { NavigationDock } from "@/components/navigation-dock";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const message = params.get("message");
      if (message) {
        toast.success(message);
        // Limpa a query string da URL imediatamente para evitar duplicação do Toast
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans relative overflow-hidden">
        {/* Loader background glow */}
        <div className="absolute w-80 h-80 bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <svg className="animate-spin h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm">Carregando painel...</span>
        </div>
      </div>
    );
  }

  // Fallback if not authenticated
  if (!session) {
    return null;
  }

  const user = session.user;
  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Liquid Blobs */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-emerald-500/4 dark:bg-emerald-500/6 rounded-full blur-[90px] pointer-events-none liquid-blob-1" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-sky-500/3 dark:bg-sky-500/4 rounded-full blur-[90px] pointer-events-none liquid-blob-2" />

      {/* Top Navbar */}
      <header className="border-b border-slate-900/5 dark:border-white/5 bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-slate-400 to-slate-200 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-slate-500/20">
              MF
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              MEI Finance
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-250">{user.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</span>
            </div>
            <div className="w-px h-6 bg-slate-900/10 dark:bg-white/10 mx-1" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Welcome Section */}
        <Card className="p-8 liquid-glass-card rounded-2xl hover:border-slate-900/10 dark:hover:border-white/10 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Painel Principal</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Olá, {user.name}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm sm:text-base leading-relaxed">
              Bem-vindo ao MEI Finance. Sua sessão está autenticada de forma segura e protegida por cookies criptografados.
            </p>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details Card */}
          <Card className="liquid-glass-card rounded-2xl hover:border-slate-900/10 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader className="border-b border-slate-900/5 dark:border-white/5 pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Informações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Nome:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">E-mail:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Perfil:</span>
                <Badge variant="secondary" className="capitalize bg-slate-900/5 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-900/10 dark:border-slate-700/50 hover:bg-slate-900/10 dark:hover:bg-slate-700">
                  {user.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Details / Specific Módulos */}
          <Card className="liquid-glass-card rounded-2xl hover:border-slate-900/10 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader className="border-b border-slate-900/5 dark:border-white/5 pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {isAdmin ? "Status Administrativo" : "Dados Profissionais"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {isAdmin ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-slate-900/5 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Administrador Global</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    Você possui permissão de suporte global para todos os escritórios e MEIs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">CRC Ativo:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{user.crc}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Escritório:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{user.office_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Status Profissional:</span>
                    <Badge variant="outline" className="text-slate-700 dark:text-slate-200 border border-slate-900/10 dark:border-slate-700/50 bg-slate-900/5 dark:bg-slate-800/40">
                      Ativo
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/5 dark:border-white/5 py-6 pb-28 text-center text-xs text-slate-500 bg-background/40 mt-auto relative z-10">
        &copy; {new Date().getFullYear()} MEI Finance. Todos os direitos reservados.
      </footer>

      {/* macOS Navigation Dock */}
      <NavigationDock activePage="dashboard" />
    </div>
  );
}
