import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full space-y-12 relative z-10 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 items-center justify-center font-bold text-xl shadow-lg shadow-slate-500/20 mb-2">
            MF
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            MEI Finance
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Plataforma inteligente para contadores e microempreendedores individuais. Explore os módulos e fluxos da aplicação pelos atalhos abaixo.
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Login */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] flex flex-col justify-between h-64 group">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acesso</span>
              <h2 className="text-xl font-bold text-white group-hover:text-slate-200 transition-colors">Acessar Conta</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Entre no sistema utilizando suas credenciais de Contador ou Administrador.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full bg-gradient-to-r from-slate-200 to-zinc-300 hover:from-white hover:to-slate-200 text-slate-950 font-bold rounded-xl py-3 text-center transition-all shadow-lg shadow-slate-500/10 hover:shadow-slate-500/20 cursor-pointer active:scale-[0.98] text-sm"
            >
              Entrar no Sistema
            </Link>
          </div>

          {/* Card 2: Register */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] flex flex-col justify-between h-64 group">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registro</span>
              <h2 className="text-xl font-bold text-white group-hover:text-slate-200 transition-colors">Criar Nova Conta</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Cadastre sua credencial profissional de Contador parceiro para gerenciar seus MEIs.
              </p>
            </div>
            <Link
              href="/register"
              className="w-full bg-slate-900/50 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-500/30 font-semibold rounded-xl py-3 text-center transition-all cursor-pointer active:scale-[0.98] text-sm"
            >
              Registrar Contador
            </Link>
          </div>

          {/* Card 3: Dashboard */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] flex flex-col justify-between h-64 group">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Painel</span>
              <h2 className="text-xl font-bold text-white group-hover:text-slate-200 transition-colors">Área Logada</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Acesse o painel principal protegido para ver relatórios de MEIs e dados do perfil.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="w-full bg-slate-900/50 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-500/30 font-semibold rounded-xl py-3 text-center transition-all cursor-pointer active:scale-[0.98] text-sm"
            >
              Ver Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
