'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';

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
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  const userCnpj = (session?.user as any)?.cnpj || 'Não cadastrado';
  const userRole = (session?.user as any)?.role || 'default';
  const userActive = (session?.user as any)?.active ?? true;

  return (
    <div className="flex flex-col flex-1">
      <Header />
      
      <main className="flex-1 p-6 flex flex-col justify-center items-center">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <CardTitle>Bem-vindo ao MEI Finance!</CardTitle>
            <CardDescription>
              Sua conta está criada e sua autenticação está funcionando sob a metodologia do SDD.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta é a Dashboard segura protegida por token Laravel Sanctum com controle de sessão gerenciado pelo NextAuth.
            </p>
            <div className="bg-muted rounded-xl p-4 text-xs font-mono overflow-x-auto space-y-1">
              <div>Session status: Authenticated</div>
              <div>User: {session?.user?.email}</div>
              <div>CNPJ: {userCnpj}</div>
              <div>Role: {userRole}</div>
              <div>Status: {userActive ? 'Active (Ativo)' : 'Inactive (Inativo)'}</div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-6">
          Módulo 001-autenticacao finalizado. Pronto para iniciar o módulo 002-importacao-extrato.
        </p>
      </main>
    </div>
  );
}
