"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Compass,
  Gamepad2,
  Cat,
  Calculator,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; desc: string; icon: React.ElementType }[] = [
    { id: "surat", label: "Surat & Kisah", desc: "Perjalanan, refleksi & surat", icon: Heart },
    { id: "geocorner", label: "Geo Corner", desc: "GIS viewer peta interaktif", icon: Compass },
    { id: "kalkulator", label: "Kalkulator Geodesi", desc: "13 rumus & kalkulator ilmiah", icon: Calculator },
    { id: "games", label: "Game Center", desc: "Sudoku, TTS, Hangman, Snake", icon: Gamepad2 },
    { id: "kucing", label: "Kucing Darurat", desc: "Terapi foto kucing menenangkan", icon: Cat },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-rose-50/85 dark:bg-[#12080D]/90 border-b border-rose-200/70 dark:border-rose-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo / Title */}
        <button
          onClick={() => handleSelect("surat")}
          className="flex items-center gap-2.5 group text-left flex-shrink-0"
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

        {/* Desktop Navigation Tabs (Hidden on Mobile < md) */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
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

        {/* Right Actions: Theme Toggle + Mobile Menu Bar Button */}
        <div className="flex items-center gap-2">
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

          {/* Mobile Menu Bar Button (Visible on Mobile < md) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka Menu Navigasi"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-rose-100/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-200/60 transition-all active:scale-95"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Modal Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-16 bg-stone-950/40 backdrop-blur-sm z-30 md:hidden"
            />

            {/* Menu Dropdown Container */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 z-40 bg-white/95 dark:bg-[#160B12]/95 backdrop-blur-xl border-b border-rose-200/80 dark:border-rose-950 px-4 py-4 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-1.5 max-w-md mx-auto">
                <div className="text-[10px] font-mono text-rose-400 dark:text-rose-400/80 uppercase tracking-widest px-3 mb-1">
                  Pilihan Menu
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left ${
                        isActive
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                          : "bg-rose-50/60 dark:bg-rose-950/30 text-stone-800 dark:text-rose-100 hover:bg-rose-100/70 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-white dark:bg-rose-900/50 text-rose-500 shadow-sm"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold block leading-tight">
                            {item.label}
                          </span>
                          <span
                            className={`text-[11px] block mt-0.5 ${
                              isActive ? "text-rose-100" : "text-stone-500 dark:text-rose-300/70"
                            }`}
                          >
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? "text-white" : "text-stone-400 dark:text-rose-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
