'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GlowCard, GlowInput, GlowLabel, GlowButton } from '@/components/custom/GlowUI';
import { login } from '@/services/auth.service';
import { ApiError } from '@/lib/api';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      // 1. Chamar o endpoint da API diretamente para validar e autenticar
      const response = await login(email, password);

      if (response && response.success) {
        toast.success(response.message || 'Login realizado com sucesso!');

        // 2. Com a validação de sucesso, iniciar a sessão no NextAuth
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
          setLoading(false);
        } else if (result?.ok) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 1200);
        }
      } else {
        toast.error(response?.message || 'Erro ao realizar login.');
        setLoading(false);
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof ApiError) {
        const apiResponse = err.response;
        if (err.status === 422 && apiResponse.data) {
          setFieldErrors(apiResponse.data);
        } else {
          toast.error(apiResponse.message || 'Erro ao realizar login.');
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao tentar acessar. Tente novamente.';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and Intro */}
        <div className="text-center space-y-2 select-none">
          <div className="inline-flex w-10 h-10 rounded-xl bg-emerald-500 text-white items-center justify-center font-bold text-base shadow-sm">
            MF
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">Acessar MEI Finance</h1>
          <p className="text-xs text-zinc-400">
            Gerencie suas finanças PJ e PF no mesmo lugar.
          </p>
        </div>

        <GlowCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <GlowLabel htmlFor="email">E-mail</GlowLabel>
              <GlowInput
                id="email"
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@email.com"
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-red-500 mt-0.5 ml-1 animate-in fade-in duration-200">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <GlowLabel htmlFor="password">Senha</GlowLabel>
              <GlowInput
                id="password"
                type="password"
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p className="text-[11px] text-red-500 mt-0.5 ml-1 animate-in fade-in duration-200">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>

            <GlowButton type="submit" className="w-full" loading={loading}>
              Entrar na Conta
            </GlowButton>
          </form>
        </GlowCard>

        <p className="text-center text-xs text-zinc-400 select-none">
          Ainda não tem cadastro?{' '}
          <Link href="/register" className="text-emerald-500 hover:text-emerald-600 font-semibold underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
