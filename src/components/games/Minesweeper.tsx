"use client";

import React, { useState, useEffect } from "react";
import { Flag, Bomb, RotateCcw, Smile, Frown, Award } from "lucide-react";

interface Cell {
  row: number;
  col: number;
  hasMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  count: number;
}

const ROWS = 7;
const COLS = 7;
const MINES = 6;

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_ms_best");
      if (saved) setBestScore(parseInt(saved, 10));
    } catch {
      // ignore
    }
    initGame();
  }, []);

  const initGame = () => {
    // Generate grid
    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          hasMine: false,
          isOpen: false,
          isFlagged: false,
          count: 0,
        });
      }
      newBoard.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].hasMine) {
        newBoard[r][c].hasMine = true;
        placed++;
      }
    }

    // Calculate neighboring mine count
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].hasMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].hasMine) {
                count++;
              }
            }
          }
          newBoard[r][c].count = count;
        }
      }
    }

    setBoard(newBoard);
    setIsGameOver(false);
    setIsWon(false);
    setScore(0);
  };

  const revealCell = (r: number, c: number, currentBoard: Cell[][]) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const cell = currentBoard[r][c];
    if (cell.isOpen || cell.isFlagged) return;

    cell.isOpen = true;

    if (cell.count === 0 && !cell.hasMine) {
      // Auto open neighbors
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(r + dr, c + dc, currentBoard);
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isGameOver || isWon) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newBoard[r][c];

    if (flagMode) {
      if (!cell.isOpen) {
        cell.isFlagged = !cell.isFlagged;
        setBoard(newBoard);
      }
      return;
    }

    if (cell.isFlagged || cell.isOpen) return;

    if (cell.hasMine) {
      // Hit mine - Game Over
      newBoard.forEach((row) =>
        row.forEach((sq) => {
          if (sq.hasMine) sq.isOpen = true;
        })
      );
      setBoard(newBoard);
      setIsGameOver(true);
      return;
    }

    revealCell(r, c, newBoard);

    // Count open non-mine cells
    let openCount = 0;
    newBoard.forEach((row) =>
      row.forEach((sq) => {
        if (sq.isOpen && !sq.hasMine) openCount++;
      })
    );

    const safeCellsTotal = ROWS * COLS - MINES;
    setScore(openCount);
    setBoard(newBoard);

    if (openCount === safeCellsTotal) {
      setIsWon(true);
      if (bestScore === null || openCount > bestScore) {
        setBestScore(openCount);
        try {
          localStorage.setItem("game_ms_best", openCount.toString());
        } catch {
          // ignore
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full mb-3 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <div className="flex items-center gap-1 text-stone-700 dark:text-slate-300">
          <Bomb className="w-3.5 h-3.5 text-rose-500" />
          <span>{MINES} Ranjau</span>
        </div>
        <div className="text-rose-600 dark:text-rose-400 font-semibold">Aman: {score}/{ROWS * COLS - MINES}</div>
        <div className="text-stone-500 dark:text-slate-400">
          Terbaik: {bestScore !== null ? bestScore : "-"}
        </div>
      </div>

      {/* Flag Mode Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setFlagMode(!flagMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
            flagMode
              ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/50 font-semibold"
              : "bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-400 border-stone-200 dark:border-slate-700 hover:text-stone-900"
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>{flagMode ? "Mode: Bendera ON" : "Mode: Buka Sel"}</span>
        </button>
      </div>

      {/* Game status message */}
      <div className="text-xs font-mono mb-2 h-4">
        {isGameOver && <span className="text-rose-500 font-semibold">Kena ranjau! Ulangi yuk.</span>}
        {isWon && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Luar biasa, semua aman! 🎉</span>}
      </div>

      {/* Grid */}
      <div
        className="grid gap-1.5 p-3 bg-stone-100/90 dark:bg-slate-950/70 rounded-2xl border border-stone-300 dark:border-slate-800"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all ${
                cell.isOpen
                  ? cell.hasMine
                    ? "bg-rose-500/30 text-rose-500 border border-rose-500/50"
                    : "bg-white dark:bg-slate-800/80 text-rose-600 dark:text-rose-400 border border-stone-200 dark:border-slate-700/60"
                  : cell.isFlagged
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/40"
                  : "bg-stone-200/70 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 hover:border-rose-400 hover:bg-stone-300/60 dark:hover:bg-slate-850 text-transparent"
              }`}
            >
              {cell.isOpen ? (
                cell.hasMine ? (
                  <Bomb className="w-4 h-4 text-rose-500" />
                ) : cell.count > 0 ? (
                  cell.count
                ) : (
                  ""
                )
              ) : cell.isFlagged ? (
                <Flag className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                ""
              )}
            </button>
          ))
        )}
      </div>

      <button
        onClick={initGame}
        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-rose-500 transition-colors font-mono shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
        <span>Ulangi Papan</span>
      </button>
    </div>
  );
}
