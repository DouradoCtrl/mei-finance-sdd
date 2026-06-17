"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { loginUser } from "../services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const message = params.get("message");
      if (message) {
        toast.success(message);
        // Limpa a query string da URL imediatamente para evitar duplicação do Toast
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  }, []);

  const handleFieldChange = (
    field: "email" | "password",
    value: string
  ) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // 1. Pre-flight login check to get validation errors/messages from Laravel
      const response = await loginUser(email, password);

      if (!response.success) {
        setLoading(false);
        if (response.data && typeof response.data === "object") {
          setErrors(response.data as { [key: string]: string[] });
        } else {
          toast.error(response.message || "E-mail ou senha incorretos.");
        }
        return;
      }

      // 2. Credentials are correct, establish session via NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoading(false);
        toast.error("Falha no login", {
          description: "Erro ao iniciar sessão local. Tente novamente.",
        });
      } else {
        const successMsg = response.message || "Autenticação realizada com sucesso.";
        router.push(`/dashboard?message=${encodeURIComponent(successMsg)}`);
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      toast.error("Erro de Conexão", {
        description: "Erro de conexão ao tentar fazer login.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
      {/* Email */}
      <div className="grid gap-1.5 text-left">
        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">Endereço de E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="nome@empresa.com"
          value={email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          className="w-full px-4 py-6 text-sm"
        />
        {errors.email && (
          <p className="text-red-500 text-xs font-medium">{errors.email[0]}</p>
        )}
      </div>

      {/* Password */}
      <div className="grid gap-1.5 text-left">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">Senha</Label>
          <Link
            href="#"
            className="text-xs font-semibold text-emerald-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-slate-200 transition-colors hover:underline"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Recuperação de senha", {
                description: "O fluxo de recuperação de senha está em desenvolvimento."
              });
            }}
          >
            Esqueceu a senha?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => handleFieldChange("password", e.target.value)}
          className="w-full px-4 py-6 text-sm"
        />
        {errors.password && (
          <p className="text-red-500 text-xs font-medium">{errors.password[0]}</p>
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
            <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Autenticando...</span>
          </>
        ) : (
          <span>Entrar no sistema</span>
        )}
      </Button>
    </form>
  );
}
