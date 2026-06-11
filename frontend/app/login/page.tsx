'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GlowCard, GlowInput, GlowLabel, GlowButton } from '@/components/custom/GlowUI';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.ok) {
        setSuccess('Acesso concedido! Carregando painel...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao tentar acessar. Tente novamente.');
      setLoading(false);
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
          {error && (
            <div className="mb-4 text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-xs text-green-500 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900/50">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <GlowLabel htmlFor="email">E-mail</GlowLabel>
              <GlowInput
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@email.com"
              />
            </div>

            <div className="space-y-1">
              <GlowLabel htmlFor="password">Senha</GlowLabel>
              <GlowInput
                id="password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
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
