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
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-3xl relative transition-all duration-300",
        "bg-white/60 dark:bg-white/5",
        "backdrop-blur-2xl",
        "border border-slate-900/5 dark:border-white/8",
        "shadow-[0_12px_40px_rgba(12,28,20,0.06),_inset_0_1px_1px_rgba(255,255,255,0.8)]",
        "dark:shadow-[0_12px_36px_rgba(0,0,0,0.12),_inset_0_1px_1px_rgba(255,255,255,0.08)]"
      )}>
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
              className={cn(
                "relative p-3 rounded-2xl transition-all duration-300 group cursor-pointer active:scale-95",
                "text-slate-500 dark:text-slate-400",
                "hover:text-slate-900 dark:hover:text-white",
                "hover:bg-slate-900/5 dark:hover:bg-slate-800/35"
              )}
              style={{
                transform: isHovered ? "translateY(-6px) scale(1.15)" : "none",
              }}
            >
              {/* Tooltip */}
              <span
                className={cn(
                  "absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[10px] font-semibold rounded-lg opacity-0 transition-all pointer-events-none whitespace-nowrap shadow-md",
                  "bg-slate-900/95 dark:bg-slate-950/95 text-slate-200 dark:text-slate-200 border border-slate-800",
                  isHovered && "opacity-100 -top-12"
                )}
              >
                {item.label}
              </span>

              {/* Icon */}
              <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-slate-900 dark:text-white" : "")} />

              {/* Active Indicator (macOS style dot below) */}
              {isActive && (
                <span className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all",
                  "bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)] dark:shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                )} />
              )}
            </button>
          );
        })}

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-slate-900/10 dark:bg-white/10 mx-1" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHoveredIndex(items.length)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={cn(
            "relative p-3 rounded-2xl transition-all duration-300 group cursor-pointer active:scale-95",
            "text-slate-500 dark:text-slate-400",
            "hover:text-red-600 dark:hover:text-red-400",
            "hover:bg-red-900/5 dark:hover:bg-red-950/20"
          )}
          style={{
            transform: hoveredIndex === items.length ? "translateY(-6px) scale(1.15)" : "none",
          }}
        >
          {/* Tooltip */}
          <span
            className={cn(
              "absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[10px] font-semibold rounded-lg opacity-0 transition-all pointer-events-none whitespace-nowrap shadow-md",
              "bg-slate-900/95 dark:bg-slate-950/95 text-slate-200 dark:text-slate-200 border border-slate-800",
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
