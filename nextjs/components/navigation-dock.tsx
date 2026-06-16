"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home, LayoutDashboard, Users, TrendingUp, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationDockProps {
  activePage: string;
}

export function NavigationDock({ activePage }: NavigationDockProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = [
    { id: "home", label: "Início", icon: Home, action: () => router.push("/") },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, action: () => router.push("/dashboard") },
    { id: "clients", label: "Clientes MEI", icon: Users, action: () => {} }, // placeholder para desenvolvimento futuro
    { id: "reports", label: "Relatórios", icon: TrendingUp, action: () => {} }, // placeholder para desenvolvimento futuro
    { id: "settings", label: "Configurações", icon: Settings, action: () => {} }, // placeholder para desenvolvimento futuro
  ];

  const handleLogout = async () => {
    let apiMessage = "Sessão encerrada com sucesso.";
    try {
      const response = await fetch("/api/proxy/logout", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        }
      });
      const data = await response.json();
      if (data && data.message) {
        apiMessage = data.message;
      }
    } catch (error) {
      console.error("Failed to invalidate token in backend:", error);
    } finally {
      signOut({ callbackUrl: `/login?message=${encodeURIComponent(apiMessage)}` });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/35 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-black/80 relative">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const isHovered = hoveredIndex === idx;

          return (
            <button
              key={item.id}
              onClick={item.action}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative p-3 rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/35 transition-all duration-300 group cursor-pointer active:scale-95"
              style={{
                transform: isHovered ? "translateY(-6px) scale(1.15)" : "none",
              }}
            >
              {/* Tooltip */}
              <span
                className={cn(
                  "absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950/90 text-[10px] font-semibold text-slate-200 border border-slate-800 rounded-lg opacity-0 transition-all pointer-events-none whitespace-nowrap shadow-md",
                  isHovered && "opacity-100 -top-12"
                )}
              >
                {item.label}
              </span>

              {/* Icon */}
              <Icon className={cn("h-5 w-5 transition-colors", isActive && "text-emerald-400")} />

              {/* Active Indicator (macOS style dot below) */}
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-slate-800 mx-1" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHoveredIndex(items.length)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative p-3 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300 group cursor-pointer active:scale-95"
          style={{
            transform: hoveredIndex === items.length ? "translateY(-6px) scale(1.15)" : "none",
          }}
        >
          {/* Tooltip */}
          <span
            className={cn(
              "absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950/90 text-[10px] font-semibold text-slate-200 border border-slate-800 rounded-lg opacity-0 transition-all pointer-events-none whitespace-nowrap shadow-md",
              hoveredIndex === items.length && "opacity-100 -top-12"
            )}
          >
            Sair
          </span>

          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
