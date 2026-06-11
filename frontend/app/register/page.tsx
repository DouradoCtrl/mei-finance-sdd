'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { register } from '@/services/auth.service';
import { GlowCard, GlowInput, GlowLabel, GlowButton } from '@/components/custom/GlowUI';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        name,
        email,
        password,
        cnpj: cnpj || null,
      });

      if (response && response.success) {
        setSuccess('Cadastro realizado com sucesso! Conectando...');

        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 1200);
        } else {
          router.push('/login');
        }
      } else {
        setError(response?.message || 'Falha ao realizar cadastro.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro. Tente novamente.');
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
          <h1 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">Criar Nova Conta</h1>
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
              <GlowLabel htmlFor="name">Nome Completo</GlowLabel>
              <GlowInput
                id="name"
                type="text"
                required
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Carlos Silva"
              />
            </div>

            <div className="space-y-1">
              <GlowLabel htmlFor="email">E-mail de Acesso</GlowLabel>
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
              <GlowLabel htmlFor="cnpj">CNPJ (Opcional)</GlowLabel>
              <GlowInput
                id="cnpj"
                type="text"
                disabled={loading}
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="12.345.678/0001-99"
              />
            </div>

            <div className="space-y-1">
              <GlowLabel htmlFor="password">Senha (mínimo 6 dígitos)</GlowLabel>
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
              Cadastrar Conta
            </GlowButton>
          </form>
        </GlowCard>

        <p className="text-center text-xs text-zinc-400 select-none">
          Já possui cadastro?{' '}
          <Link href="/login" className="text-emerald-500 hover:text-emerald-600 font-semibold underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
