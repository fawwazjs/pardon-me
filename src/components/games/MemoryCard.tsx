"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Compass, Globe, Satellite, MapPin, Sparkles, Navigation, Check } from "lucide-react";

interface Card {
  id: number;
  iconId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const icons = [
  { id: 1, icon: Compass, label: "Kompas" },
  { id: 2, icon: Globe, label: "Geoid" },
  { id: 3, icon: Satellite, label: "GNSS" },
  { id: 4, icon: MapPin, label: "Benchmark" },
  { id: 5, icon: Sparkles, label: "Zenith" },
  { id: 6, icon: Navigation, label: "Azimuth" },
];

export default function MemoryCard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_memory_best");
      if (saved) setBestMoves(parseInt(saved, 10));
    } catch {
      // ignore
    }
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck: Card[] = [];
    let id = 0;
    // 6 pairs = 12 cards
    for (let i = 0; i < 6; i++) {
      deck.push({ id: id++, iconId: icons[i].id, isFlipped: false, isMatched: false });
      deck.push({ id: id++, iconId: icons[i].id, isFlipped: false, isMatched: false });
    }
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [idx1, idx2] = newFlipped;
      if (cards[idx1].iconId === cards[idx2].iconId) {
        // Match!
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[idx1].isMatched = true;
            updated[idx2].isMatched = true;
            if (updated.every((c) => c.isMatched)) {
              setIsCompleted(true);
              const currentMoves = moves + 1;
              if (bestMoves === null || currentMoves < bestMoves) {
                setBestMoves(currentMoves);
                try {
                  localStorage.setItem("game_memory_best", currentMoves.toString());
                } catch {
                  // ignore
                }
              }
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[idx1].isFlipped = false;
            updated[idx2].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full mb-4 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <span className="text-stone-700 dark:text-slate-300">Langkah: {moves}</span>
        <span className="text-rose-600 dark:text-rose-400 font-semibold">
          Terbaik: {bestMoves !== null ? `${bestMoves} langkah` : "-"}
        </span>
      </div>

      {isCompleted && (
        <div className="mb-3 p-2 w-full text-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
          Semua kartu cocok! Kerja bagus! ✨
        </div>
      )}

      {/* Grid 4x3 */}
      <div className="grid grid-cols-4 gap-2.5 w-72 p-3 bg-stone-100/90 dark:bg-slate-950/60 rounded-2xl border border-stone-300 dark:border-slate-800">
        {cards.map((card, idx) => {
          const item = icons.find((ic) => ic.id === card.iconId);
          const IconComponent = item?.icon || Sparkles;
          const isShow = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                card.isMatched
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 scale-95"
                  : isShow
                  ? "bg-white dark:bg-slate-800 border border-rose-400 text-rose-500 shadow-sm"
                  : "bg-stone-200/70 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 hover:border-rose-400 hover:bg-stone-200 dark:hover:bg-slate-800/50 text-stone-400 dark:text-slate-600"
              }`}
            >
              {isShow ? (
                <div className="flex flex-col items-center gap-1">
                  <IconComponent className="w-5 h-5" />
                  <span className="text-[8px] font-mono leading-none opacity-80">{item?.label}</span>
                </div>
              ) : (
                <span className="text-xs font-mono text-stone-400 dark:text-slate-600">?</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={initializeGame}
        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-rose-500 transition-colors font-mono shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
        <span>Kocok Ulang</span>
      </button>
    </div>
  );
}
