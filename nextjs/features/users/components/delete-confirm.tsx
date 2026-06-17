"use client";

import React, { useState } from "react";
import { User } from "../types";
import { deleteUser } from "../services/userService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess: () => void;
}

export function DeleteConfirmDialog({ open, onOpenChange, user, onSuccess }: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await deleteUser(user.id);
      if (response.success) {
        toast.success(response.message || "Usuário excluído com sucesso.");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(response.message || "Erro ao tentar excluir o usuário.");
      }
    } catch (error) {
      toast.error("Erro de conexão ao tentar excluir o usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass-card border border-slate-900/10 dark:border-white/10 sm:max-w-[420px] bg-slate-950/85 backdrop-blur-2xl text-slate-100 rounded-2xl p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold text-white">
            Excluir Usuário
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm leading-relaxed">
            Tem certeza que deseja excluir o usuário <span className="font-semibold text-slate-200">{user.name}</span>? 
            Esta ação é permanente e removerá todos os dados do banco.
          </DialogDescription>
        </DialogHeader>

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
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="bg-red-600/90 hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500 text-white rounded-xl px-5 py-5 text-sm font-semibold cursor-pointer border border-transparent"
          >
            {loading ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
