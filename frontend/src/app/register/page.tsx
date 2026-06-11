'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { register } from '@/services/auth.service';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
          }, 1500);
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
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">MEI Finance</CardTitle>
            <CardDescription>
              Crie sua conta e organize suas finanças PJ e PF
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 text-sm text-red-500">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 text-sm text-green-500">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  disabled={loading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Acesso</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: carlos@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                <Input
                  id="cnpj"
                  type="text"
                  disabled={loading}
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="Ex: 12.345.678/0001-99"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha (mínimo 6 dígitos)</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
