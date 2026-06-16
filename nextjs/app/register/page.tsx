"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAccountant } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    crc: "",
    office_name: "",
    password: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const response = await registerAccountant(formData);

    if (response.success) {
      const successMsg = response.message || "Cadastro realizado com sucesso.";
      router.push(`/login?message=${encodeURIComponent(successMsg)}`);
    } else {
      setLoading(false);
      if (response.data && typeof response.data === "object") {
        setErrors(response.data);
      } else {
        toast.error(response.message || "Erro inesperado ao realizar o cadastro.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Floating Theme Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Liquid Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none liquid-blob-1" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-500/5 dark:bg-sky-500/8 rounded-full blur-[120px] pointer-events-none liquid-blob-2" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Logo and title */}
        <div className="text-center space-y-2 select-none">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 items-center justify-center font-bold text-lg shadow-lg shadow-slate-500/20 mb-2">
            MF
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">MEI Finance</h1>
          <p className="text-sm text-slate-400">
            A plataforma definitiva para contadores de MEIs.
          </p>
        </div>

        <Card className="liquid-glass-card rounded-2xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300">
          <div className="space-y-4">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Criar Nova Conta
              </h2>
              <p className="text-slate-400 text-xs">
                Já possui uma conta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-slate-300 hover:text-slate-200 transition-colors hover:underline"
                >
                  Faça login
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
              {/* Name */}
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="name" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border-white/[0.06] rounded-xl px-4 py-6 text-white placeholder-slate-500 text-sm transition-all hover:bg-white/[0.06] hover:border-white/10"
                />
                {errors.name && (
                  <p className="text-destructive text-xs font-medium">{errors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Endereço de E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nome@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border-white/[0.06] rounded-xl px-4 py-6 text-white placeholder-slate-500 text-sm transition-all hover:bg-white/[0.06] hover:border-white/10"
                />
                {errors.email && (
                  <p className="text-destructive text-xs font-medium">{errors.email[0]}</p>
                )}
              </div>

              {/* CRC and Office Name in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CRC */}
                <div className="grid gap-1.5 text-left">
                  <Label htmlFor="crc" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Registro CRC</Label>
                  <Input
                    id="crc"
                    name="crc"
                    type="text"
                    placeholder="UF-000000/O"
                    value={formData.crc}
                    onChange={handleChange}
                    className="w-full bg-white/[0.04] border-white/[0.06] rounded-xl px-4 py-6 text-white placeholder-slate-500 text-sm transition-all hover:bg-white/[0.06] hover:border-white/10"
                  />
                  {errors.crc && (
                    <p className="text-destructive text-xs font-medium">{errors.crc[0]}</p>
                  )}
                </div>

                {/* Office Name */}
                <div className="grid gap-1.5 text-left">
                  <Label htmlFor="office_name" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Nome do Escritório</Label>
                  <Input
                    id="office_name"
                    name="office_name"
                    type="text"
                    placeholder="Escritório Contábil"
                    value={formData.office_name}
                    onChange={handleChange}
                    className="w-full bg-white/[0.04] border-white/[0.06] rounded-xl px-4 py-6 text-white placeholder-slate-500 text-sm transition-all hover:bg-white/[0.06] hover:border-white/10"
                  />
                  {errors.office_name && (
                    <p className="text-destructive text-xs font-medium">{errors.office_name[0]}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border-white/[0.06] rounded-xl px-4 py-6 text-white placeholder-slate-500 text-sm transition-all hover:bg-white/[0.06] hover:border-white/10"
                />
                {errors.password && (
                  <p className="text-destructive text-xs font-medium">{errors.password[0]}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 btn-liquid-glass font-bold rounded-xl py-6 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>Criar minha conta</span>
                )}
              </Button>
            </form>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-500 select-none">
          &copy; {new Date().getFullYear()} MEI Finance. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
