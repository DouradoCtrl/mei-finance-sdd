import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-6">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          MEI Finance
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
          A ferramenta inteligente para o MEI separar gastos Pessoais (PF) de Profissionais (PJ) sem complicação.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#0a0a0a] font-bold rounded-xl hover:opacity-95 transition text-sm text-center shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Acessar Conta
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#333] hover:border-emerald-500 text-white font-bold rounded-xl transition text-sm text-center cursor-pointer"
          >
            Criar Cadastro
          </Link>
        </div>
      </div>
    </main>
  );
}
