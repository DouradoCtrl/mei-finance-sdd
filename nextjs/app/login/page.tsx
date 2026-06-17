"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { InstitutionalSide } from "@/components/institutional-side";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden transition-colors duration-300">
      {/* Institutional Side Panel (Visible on large screens) */}
      <InstitutionalSide />

      {/* Form Panel (Occupies remaining space) */}
      <div className="col-span-1 lg:col-span-6 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Floating Theme Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Background Liquid Blobs */}
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-500/4 dark:bg-emerald-500/6 rounded-full blur-[80px] pointer-events-none liquid-blob-1 dark:opacity-0" />
        <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-emerald-500/3 dark:bg-emerald-500/4 rounded-full blur-[80px] pointer-events-none liquid-blob-2 dark:opacity-0" />

        <div className="w-full max-w-lg space-y-6 relative z-10">
          {/* Logo and title (Only visible on mobile/tablet) */}
          <div className="text-center space-y-2 select-none lg:hidden">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20 mb-2">
              $
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">MEI Finance</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gerencie suas finanças PJ e PF no mesmo lugar.
            </p>
          </div>

          <Card className="liquid-glass-card rounded-2xl p-6 sm:p-8 hover:border-slate-900/10 dark:hover:border-white/10 transition-all duration-300">
            <div className="space-y-4">
              <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Acesse sua Conta
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Não tem uma conta de contador?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-emerald-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-slate-200 transition-colors hover:underline"
                  >
                    Cadastre-se grátis
                  </Link>
                </p>
              </div>

              <Suspense fallback={<div className="text-slate-400 text-center text-sm py-4">Carregando formulário...</div>}>
                <LoginForm />
              </Suspense>
            </div>
          </Card>

          <p className="text-center text-xs text-slate-500 select-none">
            &copy; {new Date().getFullYear()} MEI Finance. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
