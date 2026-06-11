'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { GlowCard } from '@/components/custom/GlowUI';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 select-none">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-xs text-zinc-400">Carregando painel...</p>
        </div>
      </div>
    );
  }

  const userCnpj = (session?.user as any)?.cnpj || 'Não cadastrado';
  const userRole = (session?.user as any)?.role || 'default';
  const userActive = (session?.user as any)?.active ?? true;

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 p-6 flex flex-col justify-center items-center">
        <GlowCard className="max-w-md w-full">
          <div className="text-center space-y-1 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <h2 className="text-lg font-bold text-gray-950 dark:text-white">Bem-vindo ao MEI Finance!</h2>
            <p className="text-[10px] text-zinc-400">
              Sua conta está criada e sua autenticação está funcionando sob a metodologia do SDD.
            </p>
          </div>
          
          <div className="space-y-4 pt-4">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Esta é a Dashboard segura protegida por token Laravel Sanctum com controle de sessão gerenciado pelo NextAuth.
            </p>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-[11px] font-mono overflow-x-auto space-y-1.5 border border-zinc-100 dark:border-zinc-800/50">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/30 pb-1">
                <span className="text-zinc-400">Usuário</span>
                <span className="font-semibold text-gray-900 dark:text-white">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/30 pb-1">
                <span className="text-zinc-400">CNPJ</span>
                <span className="font-semibold text-gray-900 dark:text-white">{userCnpj}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/30 pb-1">
                <span className="text-zinc-400">Perfil</span>
                <span className="font-semibold uppercase text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-zinc-400">{userRole}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-zinc-400">Status</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  {userActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        </GlowCard>

        <p className="text-[10px] font-mono text-zinc-400 mt-8 uppercase tracking-widest select-none">
          Módulo 001-autenticacao finalizado. Pronto para iniciar o módulo 002-importacao-extrato.
        </p>
      </main>
    </div>
  );
}
