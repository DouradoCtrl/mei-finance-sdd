"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { User } from "../types";
import { listUsers } from "../services/userService";
import { UserTable } from "./user-table";
import { UserDialog } from "./user-dialog";
import { DeleteConfirmDialog } from "./delete-confirm";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, UserPlus } from "lucide-react";

export function UserManagementPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ? Number(session.user.id) : 0;

  // List states
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  // UI status
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async (searchQuery: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await listUsers(searchQuery, pageNum);
      if (response.success && response.data) {
        setUsers(response.data.data);
        setMeta(response.data.meta);
      } else {
        setUsers([]);
        setMeta(null);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search hook / trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page on search
      fetchUsers(search, 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers(search, newPage);
  };

  // Open creation dialog
  const handleCreateClick = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  // Open deletion confirmation
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Configurações Gerais</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Controle de Usuários
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
            Gerencie o acesso de contadores e administradores PJ no sistema.
          </p>
        </div>

        <Button
          onClick={handleCreateClick}
          className="btn-liquid-glass rounded-xl px-5 py-6 text-sm font-bold flex items-center gap-2 cursor-pointer text-white self-start sm:self-center"
        >
          <UserPlus className="h-4 w-4" />
          <span>Novo Usuário</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="liquid-glass-card rounded-2xl border border-slate-900/5 dark:border-white/5 bg-slate-950/10 backdrop-blur-md">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Buscar usuário por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-5 bg-slate-900/30 border-slate-800 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      {loading && users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <svg className="animate-spin h-8 w-8 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">Buscando registros...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <UserTable
            users={users}
            currentUserId={currentUserId}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          {/* Pagination Controls */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between px-2 text-sm text-slate-500 select-none">
              <span>
                Mostrando {meta.from} até {meta.to} de {meta.total} usuários
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => handlePageChange(page - 1)}
                  className="bg-transparent border-slate-800 hover:bg-slate-900/40 text-slate-300 rounded-xl px-4 py-4 text-xs cursor-pointer"
                >
                  Anterior
                </Button>
                <span className="font-semibold text-slate-700 dark:text-slate-300 px-1">
                  Página {page} de {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === meta.last_page || loading}
                  onClick={() => handlePageChange(page + 1)}
                  className="bg-transparent border-slate-800 hover:bg-slate-900/40 text-slate-300 rounded-xl px-4 py-4 text-xs cursor-pointer"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog Form Modal */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSuccess={() => fetchUsers(search, page)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        onSuccess={() => {
          // If page became empty after delete, adjust page
          if (users.length === 1 && page > 1) {
            setPage(page - 1);
            fetchUsers(search, page - 1);
          } else {
            fetchUsers(search, page);
          }
        }}
      />
    </div>
  );
}
