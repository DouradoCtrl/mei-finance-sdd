"use client";

import React from "react";
import { User } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface UserTableProps {
  users: User[];
  currentUserId: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, currentUserId, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="rounded-2xl border border-slate-900/5 dark:border-white/5 overflow-hidden bg-white/85 dark:bg-slate-950/80 backdrop-blur-md">
      <Table>
        <TableHeader className="bg-slate-900/10 dark:bg-white/3">
          <TableRow className="hover:bg-transparent border-b border-slate-900/5 dark:border-white/5">
            <TableHead className="font-semibold text-slate-800 dark:text-slate-200">Nome</TableHead>
            <TableHead className="font-semibold text-slate-800 dark:text-slate-200">E-mail</TableHead>
            <TableHead className="font-semibold text-slate-800 dark:text-slate-200">Perfil</TableHead>
            <TableHead className="font-semibold text-slate-800 dark:text-slate-200">CRC</TableHead>
            <TableHead className="font-semibold text-slate-800 dark:text-slate-200">Escritório</TableHead>
            <TableHead className="font-semibold text-slate-800 dark:text-slate-200">Status</TableHead>
            <TableHead className="font-semibold text-slate-800 dark:text-slate-200 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-slate-500 dark:text-slate-400">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow 
                key={user.id} 
                className="border-b border-slate-900/5 dark:border-white/5 hover:bg-slate-900/5 dark:hover:bg-white/2 transition-colors duration-200"
              >
                {/* Nome */}
                <TableCell className="font-medium text-slate-900 dark:text-white">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                      Você
                    </span>
                  )}
                </TableCell>

                {/* E-mail */}
                <TableCell className="text-slate-600 dark:text-slate-400">{user.email}</TableCell>

                {/* Perfil */}
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={
                      user.role === "admin" 
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium capitalize"
                        : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-medium capitalize"
                    }
                  >
                    {user.role === "admin" ? "Administrador" : "Contador"}
                  </Badge>
                </TableCell>

                {/* CRC */}
                <TableCell className="text-slate-600 dark:text-slate-400">
                  {user.crc || <span className="text-slate-400/50">—</span>}
                </TableCell>

                {/* Escritório */}
                <TableCell className="text-slate-600 dark:text-slate-400">
                  {user.office_name || <span className="text-slate-400/50">—</span>}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={
                      user.active 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium"
                    }
                  >
                    {user.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>

                {/* Ações */}
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={user.id === currentUserId}
                    onClick={() => onDelete(user)}
                    className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
