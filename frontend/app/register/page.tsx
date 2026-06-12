'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { register } from '@/services/auth.service';
import { GlowCard, GlowInput, GlowLabel, GlowButton } from '@/components/custom/GlowUI';
import { ApiError } from '@/lib/api';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await register({
        name,
        email,
        password,
        cnpj: cnpj || null,
      });

      if (response && response.success) {
        toast.success(response.message || 'Cadastro realizado com sucesso!');

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
        toast.error(response?.message || 'Falha ao realizar cadastro.');
        setLoading(false);
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof ApiError) {
        const apiResponse = err.response;
        if (err.status === 422 && apiResponse.data) {
          setFieldErrors(apiResponse.data);
        } else {
          toast.error(apiResponse.message || 'Erro ao realizar cadastro.');
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar cadastro. Tente novamente.';
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
          <h1 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">Criar Nova Conta</h1>
          <p className="text-xs text-zinc-400">
            Gerencie suas finanças PJ e PF no mesmo lugar.
          </p>
        </div>

        <GlowCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <GlowLabel htmlFor="name">Nome Completo</GlowLabel>
              <GlowInput
                id="name"
                type="text"
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Carlos Silva"
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-red-500 mt-0.5 ml-1 animate-in fade-in duration-200">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <GlowLabel htmlFor="email">E-mail de Acesso</GlowLabel>
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
              <GlowLabel htmlFor="cnpj">CNPJ (Opcional)</GlowLabel>
              <GlowInput
                id="cnpj"
                type="text"
                disabled={loading}
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="12.345.678/0001-99"
              />
              {fieldErrors.cnpj && (
                <p className="text-[11px] text-red-500 mt-0.5 ml-1 animate-in fade-in duration-200">
                  {fieldErrors.cnpj[0]}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <GlowLabel htmlFor="password">Senha (mínimo 6 dígitos)</GlowLabel>
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
