'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth.service';

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
      const data = await authService.register(name, email, password, cnpj);

      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_name', data.data.usuario.name);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121212]/80 backdrop-blur-md border border-[#222] p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            MEI Finance
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Crie sua conta e organize suas finanças PJ e PF</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-500/50 text-red-200 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-sm px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Nome Completo ou Razão Social
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#333] focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition"
              placeholder="Ex: Carlos Silva MEI"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              E-mail de Acesso
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#333] focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition"
              placeholder="Ex: carlos@email.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              CNPJ (Opcional)
            </label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#333] focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition"
              placeholder="Ex: 12.345.678/0001-99"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Senha (Mínimo 6 caracteres)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#333] focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#0a0a0a] font-bold rounded-xl hover:opacity-95 transition disabled:opacity-50 text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
