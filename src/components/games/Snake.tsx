"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Gauge } from "lucide-react";

type Point = { x: number; y: number };
const GRID_SIZE = 14;

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
  ]);
  const [food, setFood] = useState<Point>({ x: 4, y: 4 });
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 });
  const [isAlive, setIsAlive] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speed, setSpeed] = useState<"santai" | "sedang">("santai");

  const dirRef = useRef(dir);
  dirRef.current = dir;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_snake_best");
      if (saved) setBestScore(parseInt(saved, 10));
    } catch {
      // ignore
    }
  }, []);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    while (true) {
      const candidate = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((p) => p.x === candidate.x && p.y === candidate.y)) {
        return candidate;
      }
    }
  }, []);

  const startGame = () => {
    const initialSnake = [
      { x: 7, y: 7 },
      { x: 7, y: 8 },
    ];
    setSnake(initialSnake);
    setDir({ x: 0, y: -1 });
    setFood(generateFood(initialSnake));
    setScore(0);
    setIsAlive(true);
  };

  const changeDirection = (newDir: Point) => {
    if (newDir.x === -dirRef.current.x && newDir.y === -dirRef.current.y) return;
    setDir(newDir);
  };

  const tickInterval = speed === "santai" ? 270 : 200; // Relaxed speed (270ms)

  useEffect(() => {
    if (!isAlive) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = {
          x: prev[0].x + dirRef.current.x,
          y: prev[0].y + dirRef.current.y,
        };

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsAlive(false);
          return prev;
        }

        // Self collision
        if (prev.some((p) => p.x === head.x && p.y === head.y)) {
          setIsAlive(false);
          return prev;
        }

        const nextSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > bestScore) {
              setBestScore(nextScore);
              try {
                localStorage.setItem("game_snake_best", nextScore.toString());
              } catch {
                // ignore
              }
            }
            return nextScore;
          });
          setFood(generateFood(nextSnake));
        } else {
          nextSnake.pop();
        }

        return nextSnake;
      });
    }, tickInterval);

    return () => clearInterval(interval);
  }, [isAlive, food, bestScore, generateFood, tickInterval]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAlive) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAlive]);

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full">
      {/* Score Header */}
      <div className="flex items-center justify-between w-full mb-3 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <span className="text-stone-700 dark:text-slate-300">Skor: {score}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSpeed(speed === "santai" ? "sedang" : "santai")}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-stone-200/70 dark:bg-slate-700 text-stone-700 dark:text-slate-300"
          >
            <Gauge className="w-3 h-3 text-rose-500" />
            <span>Mode: {speed === "santai" ? "Santai (Lambat)" : "Sedang"}</span>
          </button>
        </div>
        <span className="text-rose-600 dark:text-rose-400">Rekor: {bestScore}</span>
      </div>

      {/* Game Board */}
      <div className="relative w-64 h-64 bg-stone-100/90 dark:bg-slate-950/80 rounded-2xl border border-stone-300 dark:border-slate-800 p-1 flex flex-col justify-between overflow-hidden shadow-inner">
        <div
          className="grid gap-0.5 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((p, i) => i > 0 && p.x === x && p.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`rounded-sm transition-colors ${
                  isHead
                    ? "bg-rose-500 shadow-sm"
                    : isBody
                    ? "bg-rose-400 dark:bg-rose-500/80"
                    : isFood
                    ? "bg-emerald-500 animate-pulse rounded-full shadow-sm"
                    : "bg-stone-200/40 dark:bg-slate-900/30"
                }`}
              />
            );
          })}
        </div>

        {/* Start / Game Over Overlay */}
        {!isAlive && (
          <div className="absolute inset-0 bg-stone-900/80 dark:bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <span className="text-xs font-mono text-white">
              {score > 0 ? "Permainan Berakhir" : "Gerakan Santai & Tenang"}
            </span>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{score > 0 ? "Main Lagi" : "Mulai Main"}</span>
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Controls for mobile */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <button
          onClick={() => changeDirection({ x: 0, y: -1 })}
          className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeDirection({ x: -1, y: 0 })}
            className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => changeDirection({ x: 0, y: 1 })}
            className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => changeDirection({ x: 1, y: 0 })}
            className="w-10 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
