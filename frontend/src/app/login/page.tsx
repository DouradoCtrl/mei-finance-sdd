'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
        }, 1500);
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao tentar acessar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <Card className="border-[#222] bg-[#121212]/80 backdrop-blur-md shadow-2xl rounded-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent pb-1">
              MEI Finance
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm mt-1">
              Gerencie suas contas PJ e PF de forma inteligente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            {error && (
              <div className="mb-6 bg-red-950/40 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm px-4 py-3 rounded-xl">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  E-mail
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 size-4 text-gray-500 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: carlos@email.com"
                    className="pl-10 h-11 bg-[#1c1c1c] border-[#333] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-sm rounded-xl text-white placeholder-gray-600 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Senha
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 size-4 text-gray-500 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-[#1c1c1c] border-[#333] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-sm rounded-xl text-white placeholder-gray-600 transition"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#0a0a0a] font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Acessando...</span>
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-[#222]/50 pt-4 pb-6">
            <p className="text-xs text-gray-500 text-center">
              Ainda não tem cadastro?{' '}
              <Link href="/register" className="text-emerald-400 hover:underline font-semibold">
                Criar conta
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
