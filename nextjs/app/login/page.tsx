"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Cadastro realizado!", {
        description: "Utilize suas credenciais para acessar a plataforma.",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoading(false);
        toast.error("Falha na Autenticação", {
          description: "E-mail ou senha incorretos, ou conta desativada.",
        });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      toast.error("Erro de Conexão", {
        description: "Erro de conexão ao tentar fazer login.",
      });
    }
  };


  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email">Endereço de E-mail</Label>
        <Input
          id="email"
          type="email"
          required
          placeholder="nome@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          required
          placeholder="Sua senha secreta"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Autenticando...
          </>
        ) : (
          "Entrar no sistema"
        )}
      </Button>
    </form>
  );
}


export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Left Column: Visual/Marketing Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted/40 border-r border-border justify-center items-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground">
              MF
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              MEI Finance
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            Gestão inteligente de MEIs em segundos.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Acesse sua carteira de clientes, automatize rotinas fiscais e controle o faturamento anual sem complicações.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-foreground">Importação OFX Segura</h3>
                <p className="text-muted-foreground text-sm">Leitura inteligente de extratos para conciliação automatizada.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-foreground">Acesso Unificado</h3>
                <p className="text-muted-foreground text-sm">Contadores e administradores acessam seus respectivos módulos pela mesma tela.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Acesse sua Conta
            </h2>
            <p className="text-muted-foreground text-sm">
              Não tem uma conta de contador?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Cadastre-se grátis
              </Link>
            </p>
          </div>
          <Suspense fallback={<div className="text-muted-foreground">Carregando formulário...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
