"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground font-sans">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-muted-foreground text-sm">Carregando painel...</span>
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

  const handleLogout = async () => {
    try {
      // Invalidate Sanctum token on backend through BFF proxy
      await fetch("/api/proxy/logout", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        }
      });
    } catch (error) {
      console.error("Failed to invalidate token in backend:", error);
    } finally {
      // Clear session in frontend and redirect to login
      signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">
              MF
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              MEI Finance
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <Card className="p-8">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Painel Principal</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Olá, {user.name}!
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-relaxed">
              Bem-vindo ao MEI Finance. Sua sessão está autenticada de forma segura e protegida por cookies criptografados.
            </p>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details Card */}
          <Card>
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-lg font-bold text-foreground">
                Informações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nome:</span>
                <span className="text-foreground font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">E-mail:</span>
                <span className="text-foreground font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Perfil:</span>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Details / Specific Módulos */}
          <Card>
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-lg font-bold text-foreground">
                {isAdmin ? "Status Administrativo" : "Dados Profissionais"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {isAdmin ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">Administrador Global</h4>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    Você possui permissão de suporte global para todos os escritórios e MEIs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">CRC Ativo:</span>
                    <span className="text-foreground font-medium">{user.crc}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Escritório:</span>
                    <span className="text-foreground font-medium">{user.office_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status Profissional:</span>
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
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
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground bg-background mt-auto">
        &copy; {new Date().getFullYear()} MEI Finance. Todos os direitos reservados.
      </footer>
    </div>
  );
}

