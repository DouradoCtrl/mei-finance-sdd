"use client";

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

const MESSAGES = [
  "Simplifique a gestão fiscal e contábil do seu MEI em poucos segundos.",
  "Relatórios automáticos de faturamento para controle imediato do Simei.",
  "A ferramenta perfeita para contadores gerenciarem carteiras de MEIs.",
  "Segurança e criptografia para dados PJ e PF no mesmo ecossistema.",
];

export function InstitutionalSide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true);
      }, 500); // tempo do fade out
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const benefits = [
    "Controle e monitoramento do limite anual Simei",
    "Organização unificada de múltiplos clientes MEI",
    "Integração contábil segura e protegida por cookies",
    "Relatórios consolidados de faturamento mensal",
  ];

  return (
    <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 relative overflow-hidden bg-slate-900/10 dark:bg-white/2 border-r border-slate-900/5 dark:border-white/5 backdrop-blur-3xl min-h-screen">
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

      {/* Center content: Benefits */}
      <div className="my-auto space-y-8 relative z-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            A plataforma inteligente de contabilidade MEI.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
            Otimize sua rotina, evite burocracias e garanta conformidade com a Receita Federal de forma automática.
          </p>
        </div>

        <ul className="space-y-3.5">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-350">
              <div className="mt-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 p-1 text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </div>
              <span className="leading-tight">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Content: Testimonial/Message Carousel */}
      <div className="relative z-10 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-2xl p-6 shadow-md shadow-black/5 dark:shadow-black/20 backdrop-blur-xl backdrop-saturate-[180%]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2 select-none">
          Destaques e Recursos
        </span>
        <div className={`transition-opacity duration-500 min-h-[50px] ${fade ? "opacity-100" : "opacity-0"}`}>
          <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-relaxed">
            "{MESSAGES[currentIndex]}"
          </p>
        </div>
      </div>
    </div>
  );
}
