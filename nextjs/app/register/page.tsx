"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAccountant } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
      toast.success("Cadastro Realizado!", {
        description: "Conta de contador criada com sucesso. Redirecionando...",
      });
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1500);
    } else {
      setLoading(false);
      if (response.data && typeof response.data === "object") {
        setErrors(response.data);
      } else {
        toast.error("Erro no cadastro", {
          description: response.message || "Erro inesperado ao realizar o cadastro.",
        });
      }
    }
  };


  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Left Column: Visual/Marketing Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted/40 border-r border-border justify-center items-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground">
              MF
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              MEI Finance
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            A plataforma definitiva para contadores de MEIs.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Gerencie múltiplos clientes, importe extratos OFX automaticamente e mantenha as finanças dos microempreendedores organizadas em um só lugar.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-foreground">Painel Unificado</h3>
                <p className="text-muted-foreground text-sm">Acompanhe todos os seus clientes em um único dashboard intuitivo.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-medium text-foreground">Segurança de Nível Bancário</h3>
                <p className="text-muted-foreground text-sm">Seus tokens e dados estão sempre protegidos por criptografia de ponta.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Criar Nova Conta
            </h2>
            <p className="text-muted-foreground text-sm">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-destructive text-xs">{errors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Endereço de E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nome@empresa.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email[0]}</p>
              )}
            </div>

            {/* CRC and Office Name in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CRC */}
              <div className="grid gap-2">
                <Label htmlFor="crc">Registro CRC</Label>
                <Input
                  id="crc"
                  name="crc"
                  type="text"
                  required
                  placeholder="UF-000000/O"
                  value={formData.crc}
                  onChange={handleChange}
                />
                {errors.crc && (
                  <p className="text-destructive text-xs">{errors.crc[0]}</p>
                )}
              </div>

              {/* Office Name */}
              <div className="grid gap-2">
                <Label htmlFor="office_name">Nome do Escritório</Label>
                <Input
                  id="office_name"
                  name="office_name"
                  type="text"
                  required
                  placeholder="Escritório Contábil"
                  value={formData.office_name}
                  onChange={handleChange}
                />
                {errors.office_name && (
                  <p className="text-destructive text-xs">{errors.office_name[0]}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processando...
                </>
              ) : (
                "Criar minha conta"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}


