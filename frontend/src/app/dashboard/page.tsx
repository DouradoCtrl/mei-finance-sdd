'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || 'Microempreendedor';
  const userCnpj = (session?.user as any)?.cnpj || 'Não cadastrado';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">MEI Finance</span>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono border">PJ/PF</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm">Olá, <strong>{userName}</strong></span>
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="destructive"
            size="sm"
          >
            {loggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full flex flex-col justify-center items-center">
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
