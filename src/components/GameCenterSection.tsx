"use client";

import React, { useState, useEffect } from "react";
import { Gamepad2, Shuffle } from "lucide-react";

import TicTacToe from "./games/TicTacToe";
import MemoryCard from "./games/MemoryCard";
import Minesweeper from "./games/Minesweeper";
import Game2048 from "./games/Game2048";
import Snake from "./games/Snake";
import Hangman from "./games/Hangman";
import Sudoku from "./games/Sudoku";
import Crossword from "./games/Crossword";

interface GameOption {
  id: string;
  name: string;
  badge: string;
  component: React.ComponentType;
}

const ALL_GAMES: GameOption[] = [
  { id: "sudoku", name: "Sudoku", badge: "Logika", component: Sudoku },
  { id: "minesweeper", name: "Minesweeper", badge: "Deteksi", component: Minesweeper },
  { id: "ttt", name: "Tic Tac Toe", badge: "Klasik", component: TicTacToe },
  { id: "crossword", name: "Crossword Puzzle", badge: "Kata", component: Crossword },
  { id: "memory", name: "Memory Card", badge: "Ingatan", component: MemoryCard },
  { id: "2048", name: "2048", badge: "Angka", component: Game2048 },
  { id: "snake", name: "Snake", badge: "Arcade", component: Snake },
  { id: "hangman", name: "Hangman", badge: "Tebak", component: Hangman },
];

export default function GameCenterSection() {
  const [selectedGames, setSelectedGames] = useState<GameOption[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    shuffleAndPickGames();
  }, []);

  const shuffleAndPickGames = () => {
    const shuffled = [...ALL_GAMES].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 4);
    setSelectedGames(picked);
    setActiveTab(0);
  };

  const ActiveComponent = selectedGames[activeTab]?.component || null;

  return (
    <section id="game-center" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-600 dark:text-rose-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Zona Istirahat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Game Center
          </h2>
          <p className="text-stone-600 dark:text-slate-300 text-base sm:text-lg font-serif italic mt-3">
            &ldquo;Kalau lagi capek, main sebentar dulu.&rdquo;
          </p>
        </div>

        {/* Game Cabinet Box */}
        <div className="rounded-3xl p-6 sm:p-10 theme-card shadow-xl">
          {/* Top Bar with Randomizer & Game Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200/80 dark:border-slate-800">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto p-1 bg-stone-100 dark:bg-slate-950/60 rounded-2xl border border-stone-200 dark:border-slate-800">
              {selectedGames.map((game, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={game.id}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-sm font-semibold"
                        : "text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <span>{game.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : "bg-stone-200/60 dark:bg-slate-800 text-stone-500 dark:text-slate-500"
                      }`}
                    >
                      {game.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Random shuffle button */}
            <button
              onClick={shuffleAndPickGames}
              title="Acak 4 game baru dari daftar"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-slate-800/80 text-xs font-mono text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-200/80 dark:hover:bg-slate-700 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-rose-500" />
              <span>Ganti Game Lain</span>
            </button>
          </div>

          {/* Active Game Arena */}
          <div className="min-h-[360px] flex items-center justify-center py-2">
            {ActiveComponent && <ActiveComponent />}
          </div>

          {/* Bottom notice */}
          <div className="mt-8 pt-4 border-t border-stone-200/80 dark:border-slate-800/60 text-center text-xs text-stone-400 dark:text-slate-500 font-mono">
            Skor tersimpan otomatis di browsermu • Tidak perlu buru-buru, nikmati waktumu.
          </div>
        </div>
      </div>
    </section>
  );
}
