"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid Hydration mismatch by mounting first
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-full bg-slate-900/10 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer relative z-50",
        // Adaptive Liquid Glass styling
        "bg-white/40 dark:bg-white/5",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "border border-black/5 dark:border-white/8",
        "shadow-lg shadow-black/5 dark:shadow-black/20",
        "hover:border-black/15 dark:hover:border-white/15",
        "hover:shadow-[0_8px_25px_rgba(12,28,20,0.05)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
      )}
      aria-label="Alternar Tema"
    >
      {/* Sun Icon */}
      <Sun
        className={cn(
          "h-5 w-5 text-amber-500 absolute transition-all duration-500 transform",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />

      {/* Moon Icon */}
      <Moon
        className={cn(
          "h-5 w-5 text-emerald-400 absolute transition-all duration-500 transform",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
