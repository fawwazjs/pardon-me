"use client";

import React from "react";
import { Heart, Compass, Gamepad2, Cat, Calculator, Sun, Moon } from "lucide-react";

export type NavTab = "surat" | "geocorner" | "games" | "kucing" | "kalkulator";

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Header({
  activeTab,
  onSelectTab,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "surat", label: "Surat & Kisah", icon: Heart },
    { id: "geocorner", label: "Geo Corner", icon: Compass },
    { id: "kalkulator", label: "Kalkulator Geodesi", icon: Calculator },
    { id: "games", label: "Game Center", icon: Gamepad2 },
    { id: "kucing", label: "Kucing Darurat", icon: Cat },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-rose-50/80 dark:bg-[#12080D]/85 border-b border-rose-200/70 dark:border-rose-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo / Title */}
        <button
          onClick={() => onSelectTab("surat")}
          className="flex items-center gap-2 group text-left flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-500 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
            <Heart className="w-4 h-4 fill-current text-rose-500" />
          </div>
          <div>
            <span className="font-serif font-semibold text-base tracking-tight text-stone-900 dark:text-rose-100 block leading-none">
              Untuk Bita
            </span>
            <span className="text-[10px] text-rose-400 dark:text-rose-300/70 font-mono">
              Sebuah Surat & Catatan
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-rose-500 text-white shadow-sm font-semibold"
                    : "text-stone-600 dark:text-rose-200/80 hover:text-rose-600 dark:hover:text-white hover:bg-rose-100/60 dark:hover:bg-rose-950/40"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-rose-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label={isDark ? "Ubah ke tema terang" : "Ubah ke tema gelap"}
          className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 dark:text-rose-200 hover:bg-rose-100/60 dark:hover:bg-rose-950/50 transition-colors border border-rose-200 dark:border-rose-900/60 flex-shrink-0"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-rose-600" />
          )}
        </button>
      </div>
    </header>
  );
}
