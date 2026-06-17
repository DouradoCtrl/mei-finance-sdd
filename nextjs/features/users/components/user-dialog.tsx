"use client";

import React, { useState, useEffect } from "react";
import { User, UserFormPayload } from "../types";
import { createUser, updateUser } from "../services/userService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null; // Null for Create, User object for Edit
  onSuccess: () => void;
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const isEdit = !!user;

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "accountant">("accountant");
  const [password, setPassword] = useState("");
  const [crc, setCrc] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [active, setActive] = useState(true);

  // UI status
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setPassword("");
        setCrc(user.crc || "");
        setOfficeName(user.office_name || "");
        setActive(user.active);
      } else {
        setName("");
        setEmail("");
        setRole("accountant");
        setPassword("");
        setCrc("");
        setOfficeName("");
        setActive(true);
      }
      setErrors({});
    }
  }, [open, user]);

  const handleFieldChange = (field: string, value: any) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "role") setRole(value);
    if (field === "password") setPassword(value);
    if (field === "crc") setCrc(value);
    if (field === "officeName") setOfficeName(value);
    if (field === "active") setActive(value);

    // Clear field specific error
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

    const payload: UserFormPayload = {
      name,
      email,
      role,
      active,
    };

    // Password is required on creation (validated by Laravel). If filled on edit, it will be updated.
    if (password) {
      payload.password = password;
    }

    if (role === "accountant") {
      payload.crc = crc;
      payload.office_name = officeName;
    }

    try {
      const response = isEdit 
        ? await updateUser(user!.id, payload)
        : await createUser(payload);

      if (response.success) {
        toast.success(response.message || (isEdit ? "Usuário atualizado com sucesso." : "Usuário criado com sucesso."));
        onOpenChange(false);
        onSuccess();
      } else {
        if (response.data && typeof response.data === "object") {
          // Map backend validation fields to camelCase if needed, but Laravel usually returns snake_case.
          // Map office_name back to officeName error if present.
          const validationErrors = response.data as { [key: string]: string[] };
          if (validationErrors.office_name) {
            validationErrors.officeName = validationErrors.office_name;
          }
          setErrors(validationErrors);
        } else {
          toast.error(response.message || "Ocorreu um erro ao salvar o usuário.");
        }
      }
    } catch (error) {
      toast.error("Erro de conexão ao tentar salvar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass-card border border-slate-900/10 dark:border-white/10 sm:max-w-[480px] bg-slate-950/80 backdrop-blur-2xl text-slate-100 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {isEdit ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Nome */}
          <div className="grid gap-1.5 text-left">
            <Label htmlFor="dialog-name" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Nome Completo</Label>
            <Input
              id="dialog-name"
              type="text"
              placeholder="Ex: João Silva"
              value={name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="bg-slate-900/40 border-slate-800 focus:border-emerald-500 text-sm py-5"
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-medium">{errors.name[0]}</p>
            )}
          </div>

          {/* E-mail */}
          <div className="grid gap-1.5 text-left">
            <Label htmlFor="dialog-email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Endereço de E-mail</Label>
            <Input
              id="dialog-email"
              type="email"
              placeholder="Ex: joao@empresa.com"
              value={email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className="bg-slate-900/40 border-slate-800 focus:border-emerald-500 text-sm py-5"
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-medium">{errors.email[0]}</p>
            )}
          </div>

          {/* Perfil (Role) */}
          <div className="grid gap-1.5 text-left">
            <Label htmlFor="dialog-role" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Perfil</Label>
            <Select
              value={role}
              onValueChange={(val) => handleFieldChange("role", val as "admin" | "accountant")}
            >
              <SelectTrigger
                id="dialog-role"
                className="w-full text-sm text-slate-200 px-3.5 h-[42px] flex items-center justify-between transition-all"
              >
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent className="bg-[#2b2d31] border border-slate-800 text-slate-100 rounded-xl p-1.5 shadow-2xl">
                <SelectItem value="accountant">Contador (accountant)</SelectItem>
                <SelectItem value="admin">Administrador (admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Senha */}
          <div className="grid gap-1.5 text-left">
            <Label htmlFor="dialog-password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
              {isEdit ? "Senha (Deixe em branco para manter)" : "Senha"}
            </Label>
            <Input
              id="dialog-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              className="bg-slate-900/40 border-slate-800 focus:border-emerald-500 text-sm py-5"
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-medium">{errors.password[0]}</p>
            )}
          </div>

          {/* Condicionais para Contador (CRC e Nome do Escritório) */}
          {role === "accountant" && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="dialog-crc" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Registro CRC</Label>
                <Input
                  id="dialog-crc"
                  type="text"
                  placeholder="UF-000000/O"
                  value={crc}
                  onChange={(e) => handleFieldChange("crc", e.target.value)}
                  className="bg-slate-900/40 border-slate-800 focus:border-emerald-500 text-sm py-5"
                />
                {errors.crc && (
                  <p className="text-red-500 text-xs font-medium">{errors.crc[0]}</p>
                )}
              </div>
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="dialog-office" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Escritório</Label>
                <Input
                  id="dialog-office"
                  type="text"
                  placeholder="Nome do escritório"
                  value={officeName}
                  onChange={(e) => handleFieldChange("officeName", e.target.value)}
                  className="bg-slate-900/40 border-slate-800 focus:border-emerald-500 text-sm py-5"
                />
                {errors.officeName && (
                  <p className="text-red-500 text-xs font-medium">{errors.officeName[0]}</p>
                )}
              </div>
            </div>
          )}

          {/* Status (Ativo/Inativo - Só visível na Edição) */}
          {isEdit && (
            <div className="flex items-center gap-3 pt-2">
              <input
                id="dialog-active"
                type="checkbox"
                checked={active}
                onChange={(e) => handleFieldChange("active", e.target.checked)}
                className="h-4.5 w-4.5 accent-emerald-500 bg-slate-900 border-slate-800 rounded cursor-pointer"
              />
              <Label htmlFor="dialog-active" className="text-slate-300 text-sm font-semibold select-none cursor-pointer">
                Usuário ativo e com permissão de login
              </Label>
            </div>
          )}

          {/* Footer / Botões */}
          <DialogFooter className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-slate-800 hover:bg-slate-900/40 text-slate-300 rounded-xl px-5 py-5 text-sm cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="btn-liquid-glass rounded-xl px-6 py-5 text-sm font-bold text-white cursor-pointer"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
