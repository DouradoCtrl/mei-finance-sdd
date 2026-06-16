"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Users, ShieldCheck, FileSpreadsheet } from "lucide-react";

const BENEFITS = [
  { text: "Controle e monitoramento do limite anual Simei", icon: TrendingUp },
  { text: "Organização unificada de múltiplos clientes MEI", icon: Users },
  { text: "Integração contábil segura e protegida por cookies", icon: ShieldCheck },
  { text: "Relatórios consolidados de faturamento mensal", icon: FileSpreadsheet },
];

export function InstitutionalSide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % BENEFITS.length);
        setFade(true);
      }, 500); // fade out duration
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = BENEFITS[currentIndex].icon;

  return (
    <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-12 relative overflow-hidden bg-slate-900/10 dark:bg-white/2 border-r border-slate-900/5 dark:border-white/5 backdrop-blur-3xl min-h-screen">
      {/* Background radial glows inside side panel */}
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-emerald-500/5 dark:bg-emerald-500/8 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-emerald-500/3 dark:bg-emerald-500/5 rounded-full blur-[70px] pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="flex items-center gap-3 relative z-10 select-none">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
          $
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          MEI Finance
        </span>
      </div>

      {/* Center Slogan */}
      <div className="my-auto space-y-4 relative z-10 max-w-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 select-none">
          Solução Integrada
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          A plataforma contábil definitiva.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Gerencie múltiplos MEIs com total segurança, controle de limites e emissão de relatórios consolidados em segundos.
        </p>
      </div>

      {/* Bottom Carousel of Benefits */}
      <div className="relative z-10 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-2xl p-8 shadow-md shadow-black/5 dark:shadow-black/20 backdrop-blur-xl backdrop-saturate-[180%] min-h-[160px] flex flex-col justify-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-4 select-none">
          Destaques e Benefícios
        </span>
        
        <div className={`flex items-start gap-4 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
          <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ActiveIcon className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="space-y-1">
            <p className="text-slate-900 dark:text-white text-base font-bold leading-snug">
              {BENEFITS[currentIndex].text}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Conformidade garantida e controle simplificado em tempo real.
            </p>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex gap-1.5 mt-5">
          {BENEFITS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-emerald-500 dark:bg-emerald-400"
                  : "w-1.5 bg-slate-900/10 dark:bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
