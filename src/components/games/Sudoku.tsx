"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Check, Sparkles, Lightbulb } from "lucide-react";

interface Sudoku9x9 {
  initial: (number | null)[][];
  solution: number[][];
}

// 2 carefully balanced valid 9x9 Sudoku puzzles
const puzzles9x9: Sudoku9x9[] = [
  {
    initial: [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
  {
    initial: [
      [null, null, 4, 8, null, null, null, 1, 7],
      [6, 7, null, 9, null, null, null, null, null],
      [5, null, 8, null, 3, null, null, null, 4],
      [3, null, null, 7, 4, null, 1, null, null],
      [null, 6, 9, null, null, null, 7, 8, null],
      [null, null, 1, null, 6, 9, null, null, 5],
      [1, null, null, null, 8, null, 3, null, 6],
      [null, null, null, null, null, 6, null, 9, 1],
      [2, 4, null, null, null, 1, 5, null, null],
    ],
    solution: [
      [9, 3, 4, 8, 2, 5, 6, 1, 7],
      [6, 7, 2, 9, 1, 4, 8, 5, 3],
      [5, 1, 8, 6, 3, 7, 9, 2, 4],
      [3, 2, 5, 7, 4, 8, 1, 6, 9],
      [4, 6, 9, 1, 5, 3, 7, 8, 2],
      [7, 8, 1, 2, 6, 9, 4, 3, 5],
      [1, 9, 7, 5, 8, 2, 3, 4, 6],
      [8, 5, 3, 4, 7, 6, 2, 9, 1],
      [2, 4, 6, 3, 9, 1, 5, 7, 8],
    ],
  },
];

export default function Sudoku() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [board, setBoard] = useState<(number | null)[][]>(puzzles9x9[0].initial);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_sudoku_solved");
      if (saved) setSolvedCount(parseInt(saved, 10));
    } catch {
      // ignore
    }
  }, []);

  const currentPuzzle = puzzles9x9[puzzleIndex];

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ r, c });
  };

  const handleInputNumber = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    // Don't modify initial given clues
    if (currentPuzzle.initial[r][c] !== null) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Check if fully and correctly solved
    let complete = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] !== currentPuzzle.solution[i][j]) {
          complete = false;
        }
      }
    }

    if (complete) {
      setIsCompleted(true);
      const nextCount = solvedCount + 1;
      setSolvedCount(nextCount);
      try {
        localStorage.setItem("game_sudoku_solved", nextCount.toString());
      } catch {
        // ignore
      }
    }
  };

  const clearCell = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (currentPuzzle.initial[r][c] !== null) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = null;
    setBoard(newBoard);
  };

  const giveHint = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (currentPuzzle.initial[r][c] !== null) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = currentPuzzle.solution[r][c];
    setBoard(newBoard);
  };

  const resetPuzzle = () => {
    const nextIdx = (puzzleIndex + 1) % puzzles9x9.length;
    setPuzzleIndex(nextIdx);
    setBoard(puzzles9x9[nextIdx].initial);
    setSelectedCell(null);
    setIsCompleted(false);
  };

  const selectedValue =
    selectedCell && board[selectedCell.r] ? board[selectedCell.r][selectedCell.c] : null;

  return (
    <div className="flex flex-col items-center max-w-md mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full mb-3 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <span className="text-stone-700 dark:text-slate-300 font-semibold">Sudoku 9x9</span>
        <span className="text-rose-600 dark:text-rose-400">Terselesaikan: {solvedCount}</span>
      </div>

      {isCompleted && (
        <div className="mb-3 p-2 w-full text-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
          Selamat! Kamu berhasil menyelesaikan Sudoku 9x9! ✨
        </div>
      )}

      {/* 9x9 Grid */}
      <div className="p-1.5 sm:p-2 bg-stone-200 dark:bg-slate-950/80 rounded-2xl border-2 border-stone-400 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-9 gap-0">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isInitial = currentPuzzle.initial[r][c] !== null;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isInSameRow = selectedCell?.r === r;
              const isInSameCol = selectedCell?.c === c;
              const isSameNumber =
                selectedValue !== null && cell === selectedValue && cell !== null;

              // 3x3 block borders
              const borderRight = (c + 1) % 3 === 0 && c < 8 ? "border-r-2 border-r-stone-500 dark:border-r-slate-500" : "border-r border-r-stone-300/80 dark:border-r-slate-800";
              const borderBottom = (r + 1) % 3 === 0 && r < 8 ? "border-b-2 border-b-stone-500 dark:border-b-slate-500" : "border-b border-b-stone-300/80 dark:border-b-slate-800";

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-7 h-7 sm:w-9 sm:h-9 font-mono text-xs sm:text-sm font-semibold flex items-center justify-center transition-all ${borderRight} ${borderBottom} ${
                    isSelected
                      ? "bg-rose-500 text-white font-bold"
                      : isSameNumber
                      ? "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300"
                      : isInSameRow || isInSameCol
                      ? "bg-stone-100/70 dark:bg-slate-900/50 text-stone-900 dark:text-slate-100"
                      : isInitial
                      ? "bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-white font-bold"
                      : cell !== null
                      ? "bg-white dark:bg-slate-850 text-rose-600 dark:text-rose-400 font-medium"
                      : "bg-white dark:bg-slate-900/70 hover:bg-stone-100 dark:hover:bg-slate-800/40 text-transparent"
                  }`}
                >
                  {cell !== null ? cell : ""}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 1-9 Keypad & Actions */}
      <div className="w-full mt-4 flex flex-col items-center gap-2">
        <div className="grid grid-cols-9 gap-1 sm:gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleInputNumber(num)}
              className="h-9 sm:h-10 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-900 dark:text-white font-mono font-bold text-sm border border-stone-200 dark:border-slate-700 hover:border-rose-500 transition-colors flex items-center justify-center shadow-sm active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={clearCell}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 font-mono text-xs border border-stone-200 dark:border-slate-700 transition-colors"
          >
            Hapus
          </button>
          <button
            onClick={giveHint}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-mono text-xs border border-stone-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Petunjuk</span>
          </button>
          <button
            onClick={resetPuzzle}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 font-mono text-xs border border-stone-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Ganti Soal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
