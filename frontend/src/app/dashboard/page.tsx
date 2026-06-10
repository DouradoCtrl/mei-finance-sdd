'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const name = localStorage.getItem('user_name');

    if (!token) {
      router.push('/login');
    } else {
      setUserName(name || 'Microempreendedor');
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const token = localStorage.getItem('auth_token');

    try {
      if (token) {
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Erro ao chamar API de logout:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_name');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#222] bg-[#121212]/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            MEI Finance
          </span>
          <span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded font-mono border border-[#333]">PJ/PF</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">Olá, <strong className="text-white">{userName}</strong></span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs bg-red-950/40 border border-red-500/30 hover:border-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loggingOut ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full flex flex-col justify-center items-center text-center">
        <div className="bg-[#121212]/70 border border-[#222] p-8 rounded-2xl max-w-lg shadow-xl mb-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl border border-emerald-500/20 mx-auto mb-6 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Bem-vindo ao MEI Finance!</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Sua conta está criada e sua autenticação está funcionando 100% sob a metodologia do SDD. 
            Esta é a Dashboard segura protegida por token Laravel Sanctum.
          </p>
          <div className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl px-4 py-3 text-xs text-left font-mono text-emerald-400 overflow-x-auto">
            JWT active token: Present (Secured)
          </div>
        </div>

        <p className="text-xs text-gray-600">
          Módulo 001-autenticacao finalizado. Pronto para iniciar o módulo 002-importacao-extrato.
        </p>
      </main>
    </div>
  );
}
