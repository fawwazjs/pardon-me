"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Shuffle, Check } from "lucide-react";

interface CellDef {
  letter: string;
  number?: number;
}

interface CrosswordBoard {
  id: string;
  title: string;
  solution: (CellDef | null)[][];
  cluesAcross: { num: number; clue: string }[];
  cluesDown: { num: number; clue: string }[];
}

const crosswordBoards: CrosswordBoard[] = [
  {
    id: "board-1",
    title: "Geomatika & Cerita",
    solution: [
      [{ letter: "P", number: 1 }, { letter: "E" }, { letter: "T" }, { letter: "A" }, null],
      [{ letter: "O" }, null, null, null, null],
      [{ letter: "L", number: 2 }, { letter: "A" }, { letter: "U" }, { letter: "T" }, null],
      [{ letter: "A" }, null, null, null, null],
      [{ letter: "R", number: 3 }, { letter: "U" }, { letter: "M" }, { letter: "A" }, { letter: "H" }],
    ],
    cluesAcross: [
      { num: 1, clue: "Gambaran permukaan bumi pada bidang datar dengan skala (4)" },
      { num: 2, clue: "Hamparan perairan luas pemisah daratan (4)" },
      { num: 3, clue: "Tempat kembali yang paling nyaman dan menenangkan (5)" },
    ],
    cluesDown: [
      { num: 1, clue: "Sistem koordinat berbasis sudut dan jarak radial (5)" },
    ],
  },
  {
    id: "board-2",
    title: "Langit & Perjalanan",
    solution: [
      [{ letter: "B", number: 1 }, { letter: "U" }, { letter: "L" }, { letter: "A" }, { letter: "N" }],
      [{ letter: "U" }, null, null, null, null],
      [{ letter: "M", number: 2 }, { letter: "A" }, { letter: "K" }, { letter: "N" }, { letter: "A" }],
      [{ letter: "I" }, null, null, null, null],
      [{ letter: "A", number: 3 }, { letter: "W" }, { letter: "A" }, { letter: "N" }, null],
    ],
    cluesAcross: [
      { num: 1, clue: "Satelit alami penerang malam hari (5)" },
      { num: 2, clue: "Arti mendalam di balik setiap pengalaman (5)" },
      { num: 3, clue: "Gumpalan uap air putih di langit biru (4)" },
    ],
    cluesDown: [
      { num: 1, clue: "Planet indah tempat kita semua berpijak (4)" },
    ],
  },
  {
    id: "board-3",
    title: "Sains & Kedamaian",
    solution: [
      [{ letter: "S", number: 1 }, { letter: "K" }, { letter: "A" }, { letter: "L" }, { letter: "A" }],
      [{ letter: "U" }, null, null, null, null],
      [{ letter: "D", number: 2 }, { letter: "A" }, { letter: "M" }, { letter: "A" }, { letter: "I" }],
      [{ letter: "U" }, null, null, null, null],
      [{ letter: "T", number: 3 }, { letter: "A" }, { letter: "N" }, { letter: "A" }, { letter: "H" }],
    ],
    cluesAcross: [
      { num: 1, clue: "Perbandingan jarak di peta dengan di lapangan (5)" },
      { num: 2, clue: "Kondisi hati yang tenang, tenteram, dan rukun (5)" },
      { num: 3, clue: "Lapisan permukaan daratan bumi (5)" },
    ],
    cluesDown: [
      { num: 1, clue: "Besaran rotasi di antara dua garis berpotongan (5)" },
    ],
  },
  {
    id: "board-4",
    title: "Arah & Kehangatan",
    solution: [
      [{ letter: "A", number: 1 }, { letter: "R" }, { letter: "A" }, { letter: "H" }, null],
      [{ letter: "Z" }, null, null, null, null],
      [{ letter: "I", number: 2 }, { letter: "N" }, { letter: "D" }, { letter: "A" }, { letter: "H" }],
      [{ letter: "M" }, null, null, null, null],
      [{ letter: "U", number: 3 }, { letter: "N" }, { letter: "I" }, { letter: "K" }, null],
    ],
    cluesAcross: [
      { num: 1, clue: "Petunjuk tujuan dan haluan perjalanan (4)" },
      { num: 2, clue: "Sedap dipandang mata dan menghangatkan jiwa (5)" },
      { num: 3, clue: "Istimewa dan berbeda dari yang lain (4)" },
    ],
    cluesDown: [
      { num: 1, clue: "Azimut kompas penentu orientasi utara (4)" },
    ],
  },
];

export default function Crossword() {
  const [boardIndex, setBoardIndex] = useState(0);
  const [userGrid, setUserGrid] = useState<string[][]>([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_crossword_solved");
      if (saved) setCompletedCount(parseInt(saved, 10));
    } catch {
      // ignore
    }
    // Randomize initial board
    setBoardIndex(Math.floor(Math.random() * crosswordBoards.length));
  }, []);

  const currentBoard = crosswordBoards[boardIndex];

  const handleChange = (r: number, c: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const newGrid = userGrid.map((row) => [...row]);
    newGrid[r][c] = char;
    setUserGrid(newGrid);

    // Check if fully solved
    let solved = true;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const expected = currentBoard.solution[i][j];
        if (expected && newGrid[i][j] !== expected.letter) {
          solved = false;
        }
      }
    }

    if (solved) {
      setIsCompleted(true);
      const nextCount = completedCount + 1;
      setCompletedCount(nextCount);
      try {
        localStorage.setItem("game_crossword_solved", nextCount.toString());
      } catch {
        // ignore
      }
    }
  };

  const handleClear = () => {
    setUserGrid([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    setIsCompleted(false);
  };

  const handleNextRandomBoard = () => {
    const nextIdx = (boardIndex + 1 + Math.floor(Math.random() * (crosswordBoards.length - 1))) % crosswordBoards.length;
    setBoardIndex(nextIdx);
    handleClear();
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <span className="text-stone-700 dark:text-slate-300 font-semibold">{currentBoard.title}</span>
        <span className="text-rose-600 dark:text-rose-400">Selesai: {completedCount}</span>
      </div>

      {isCompleted && (
        <div className="mb-3 p-2 w-full text-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
          Semua teka-teki terjawab sempurna! ✨
        </div>
      )}

      {/* 5x5 Grid */}
      <div className="grid grid-cols-5 gap-1.5 p-3 bg-stone-100/90 dark:bg-slate-950/80 rounded-2xl border border-stone-300 dark:border-slate-800 w-64 shadow-sm">
        {currentBoard.solution.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) {
              return <div key={`${r}-${c}`} className="w-10 h-10 bg-stone-200/50 dark:bg-slate-900/40 rounded-lg" />;
            }

            return (
              <div key={`${r}-${c}`} className="relative w-10 h-10">
                {cell.number && (
                  <span className="absolute top-0.5 left-1 text-[8px] font-mono text-rose-600 dark:text-rose-400 pointer-events-none font-bold">
                    {cell.number}
                  </span>
                )}
                <input
                  type="text"
                  maxLength={1}
                  value={userGrid[r][c]}
                  onChange={(e) => handleChange(r, c, e.target.value)}
                  className="w-full h-full text-center font-mono font-bold text-sm bg-white dark:bg-slate-800 text-stone-900 dark:text-white rounded-lg border border-stone-300 dark:border-slate-700 focus:border-rose-500 focus:outline-none uppercase shadow-sm"
                />
              </div>
            );
          })
        )}
      </div>

      {/* Clues */}
      <div className="w-full mt-4 p-3 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 text-[11px] text-stone-700 dark:text-slate-300 space-y-2 text-left shadow-sm">
        <div>
          <span className="font-semibold text-rose-600 dark:text-rose-400">Mendatar:</span>
          {currentBoard.cluesAcross.map((item) => (
            <p key={item.num}>{item.num}. {item.clue}</p>
          ))}
        </div>
        <div>
          <span className="font-semibold text-pink-600 dark:text-pink-400">Menurun:</span>
          {currentBoard.cluesDown.map((item) => (
            <p key={item.num}>{item.num}. {item.clue}</p>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 font-mono transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kosongkan</span>
        </button>

        <button
          onClick={handleNextRandomBoard}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-rose-600 dark:text-rose-400 border border-stone-200 dark:border-slate-700 hover:border-rose-500 font-mono transition-colors shadow-sm"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Ganti TTS Acak</span>
        </button>
      </div>
    </div>
  );
}
