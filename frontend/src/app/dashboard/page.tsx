'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Loader2, LogOut, CheckCircle2, User, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-emerald-500" />
          <p className="text-gray-400 text-sm animate-pulse">Carregando painel...</p>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || 'Microempreendedor';
  const userCnpj = (session?.user as any)?.cnpj || 'Não cadastrado';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-[#222] bg-[#121212]/50 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            MEI Finance
          </span>
          <span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded font-mono border border-[#333]">PJ/PF</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl px-3 py-1.5 text-xs text-gray-300">
            <User className="size-3.5 text-emerald-400" />
            <span>Olá, <strong className="text-white">{userName}</strong></span>
          </div>
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="destructive"
            size="sm"
            className="bg-red-950/40 border border-red-500/30 text-red-200 hover:bg-red-900/60 hover:text-white rounded-xl text-xs gap-1.5 transition cursor-pointer"
          >
            {loggingOut ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <LogOut className="size-3.5" />
            )}
            <span>Sair</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full flex flex-col justify-center items-center text-center z-10">
        <Card className="bg-[#121212]/70 border-[#222] p-8 rounded-2xl max-w-lg shadow-2xl backdrop-blur-md mb-6">
          <CardHeader className="p-0 mb-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl border border-emerald-500/20 mb-4">
              <CheckCircle2 className="size-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Bem-vindo ao MEI Finance!</CardTitle>
            <CardDescription className="text-gray-400 text-sm mt-2 max-w-sm">
              Sua conta está criada e sua autenticação está funcionando sob a metodologia do SDD.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 p-0">
            <p className="text-gray-300 text-sm leading-relaxed">
              Esta é a Dashboard segura protegida por token Laravel Sanctum com controle de sessão gerenciado pelo NextAuth.
            </p>
            <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl p-4 text-xs text-left font-mono text-emerald-400 overflow-x-auto space-y-1">
              <div>Session status: Authenticated ✓</div>
              <div>User: {session?.user?.email}</div>
              <div>CNPJ: {userCnpj}</div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-gray-600 flex items-center gap-1.5">
          <Landmark className="size-3.5 text-gray-500" />
          <span>Módulo 001-autenticacao finalizado. Pronto para iniciar o módulo 002-importacao-extrato.</span>
        </p>
      </main>
    </div>
  );
}
