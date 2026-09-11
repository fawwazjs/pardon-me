"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

type Grid = number[][];

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_2048_best");
      if (saved) setBestScore(parseInt(saved, 10));
    } catch {
      // ignore
    }
    initialize();
  }, []);

  const addRandomTile = (currentGrid: Grid): Grid => {
    const empty: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return currentGrid;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const newGrid = currentGrid.map((row) => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const initialize = () => {
    let newGrid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  const slideAndMergeRow = (row: number[]): { newRow: number[]; gainedScore: number } => {
    let filtered = row.filter((val) => val !== 0);
    let gainedScore = 0;
    const result: number[] = [];

    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;
        result.push(merged);
        gainedScore += merged;
        i++; // skip next
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { newRow: result, gainedScore };
  };

  const move = useCallback(
    (dir: "left" | "right" | "up" | "down") => {
      if (gameOver) return;

      let moved = false;
      let totalGained = 0;
      let newGrid = grid.map((r) => [...r]);

      if (dir === "left") {
        for (let r = 0; r < 4; r++) {
          const { newRow, gainedScore } = slideAndMergeRow(newGrid[r]);
          totalGained += gainedScore;
          if (newRow.some((val, idx) => val !== newGrid[r][idx])) moved = true;
          newGrid[r] = newRow;
        }
      } else if (dir === "right") {
        for (let r = 0; r < 4; r++) {
          const reversed = [...newGrid[r]].reverse();
          const { newRow, gainedScore } = slideAndMergeRow(reversed);
          const restored = newRow.reverse();
          totalGained += gainedScore;
          if (restored.some((val, idx) => val !== newGrid[r][idx])) moved = true;
          newGrid[r] = restored;
        }
      } else if (dir === "up") {
        for (let c = 0; c < 4; c++) {
          const col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
          const { newRow, gainedScore } = slideAndMergeRow(col);
          totalGained += gainedScore;
          for (let r = 0; r < 4; r++) {
            if (newGrid[r][c] !== newRow[r]) moved = true;
            newGrid[r][c] = newRow[r];
          }
        }
      } else if (dir === "down") {
        for (let c = 0; c < 4; c++) {
          const col = [newGrid[3][c], newGrid[2][c], newGrid[1][c], newGrid[0][c]];
          const { newRow, gainedScore } = slideAndMergeRow(col);
          const restored = newRow.reverse();
          totalGained += gainedScore;
          for (let r = 0; r < 4; r++) {
            if (newGrid[r][c] !== restored[r]) moved = true;
            newGrid[r][c] = restored[r];
          }
        }
      }

      if (moved) {
        const nextGrid = addRandomTile(newGrid);
        setGrid(nextGrid);
        const newScore = score + totalGained;
        setScore(newScore);

        if (newScore > bestScore) {
          setBestScore(newScore);
          try {
            localStorage.setItem("game_2048_best", newScore.toString());
          } catch {
            // ignore
          }
        }
      }
    },
    [grid, score, bestScore, gameOver]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowLeft") move("left");
        if (e.key === "ArrowRight") move("right");
        if (e.key === "ArrowUp") move("up");
        if (e.key === "ArrowDown") move("down");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2:
        return "bg-rose-100 dark:bg-rose-950/40 text-stone-700 dark:text-rose-200 border-rose-200 dark:border-rose-900/50";
      case 4:
        return "bg-rose-200/80 dark:bg-rose-900/50 text-rose-800 dark:text-rose-100 border-rose-300 dark:border-rose-800";
      case 8:
        return "bg-rose-400/40 dark:bg-rose-800/60 text-rose-900 dark:text-rose-100 border-rose-400/50";
      case 16:
        return "bg-rose-400 text-white border-rose-300";
      case 32:
        return "bg-rose-500 text-white border-rose-400";
      case 64:
        return "bg-rose-600 text-white border-rose-500 shadow-sm";
      case 128:
      case 256:
      case 512:
        return "bg-pink-600 text-white shadow-glow border-pink-400";
      case 1024:
      case 2048:
        return "bg-emerald-500 text-white shadow-glow border-emerald-300";
      default:
        return "bg-stone-100 dark:bg-slate-900/60 border-stone-200 dark:border-slate-800/80 text-transparent";
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      {/* Score Header */}
      <div className="flex items-center justify-between w-full mb-3 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <span className="text-stone-700 dark:text-slate-300">Skor: {score}</span>
        <span className="text-rose-600 dark:text-rose-400">Rekor: {bestScore}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 w-64 h-64 p-2 bg-stone-200/80 dark:bg-slate-950/70 rounded-2xl border border-stone-300 dark:border-slate-800">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base border transition-all ${getTileColor(
                cell
              )}`}
            >
              {cell > 0 ? cell : ""}
            </div>
          ))
        )}
      </div>

      {/* Touch D-Pad Controls for mobile */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <button
          onClick={() => move("up")}
          className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => move("left")}
            className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => move("down")}
            className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => move("right")}
            className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        onClick={initialize}
        className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-rose-500 transition-colors font-mono shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
        <span>Mulai Ulang</span>
      </button>
    </div>
  );
}
