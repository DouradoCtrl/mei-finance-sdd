import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Floating Theme Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Liquid Blobs (Minimalist and subtle) */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-500/4 dark:bg-emerald-500/6 rounded-full blur-[80px] pointer-events-none liquid-blob-1 dark:opacity-0" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-emerald-500/3 dark:bg-emerald-500/4 rounded-full blur-[80px] pointer-events-none liquid-blob-2 dark:opacity-0" />

      <div className="max-w-4xl w-full space-y-12 relative z-10 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-500/20 mb-2 select-none">
            $
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            MEI Finance
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Plataforma inteligente para contadores e microempreendedores individuais. Explore os módulos e fluxos da aplicação pelos atalhos abaixo.
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Login */}
          <div className="liquid-glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900/10 dark:hover:border-white/10 flex flex-col justify-between h-64 group">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acesso</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Acessar Conta</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Entre no sistema utilizando suas credenciais de Contador ou Administrador.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full btn-liquid-glass font-bold rounded-xl py-3 text-center text-sm flex items-center justify-center"
            >
              Entrar no Sistema
            </Link>
          </div>

          {/* Card 2: Register */}
          <div className="liquid-glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900/10 dark:hover:border-white/10 flex flex-col justify-between h-64 group">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registro</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Criar Nova Conta</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Cadastre sua credencial profissional de Contador parceiro para gerenciar seus MEIs.
              </p>
            </div>
            <Link
              href="/register"
              className="w-full btn-liquid-glass-secondary font-semibold rounded-xl py-3 text-center transition-all cursor-pointer active:scale-[0.98] text-sm flex items-center justify-center"
            >
              Registrar Contador
            </Link>
          </div>

          {/* Card 3: Dashboard */}
          <div className="liquid-glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900/10 dark:hover:border-white/10 flex flex-col justify-between h-64 group">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Painel</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Área Logada</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Acesse o painel principal protegido para ver relatórios de MEIs e dados do perfil.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="w-full btn-liquid-glass-secondary font-semibold rounded-xl py-3 text-center transition-all cursor-pointer active:scale-[0.98] text-sm flex items-center justify-center"
            >
              Ver Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
