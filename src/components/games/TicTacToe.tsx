"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Trophy, User, Bot } from "lucide-react";

export default function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [score, setScore] = useState({ player: 0, bot: 0, ties: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_ttt_score");
      if (saved) {
        setScore(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveScore = (newScore: { player: number; bot: number; ties: number }) => {
    setScore(newScore);
    try {
      localStorage.setItem("game_ttt_score", JSON.stringify(newScore));
    } catch {
      // ignore
    }
  };

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return { winner: "Tie", line: null };
    }
    return null;
  };

  // Bot move logic (simple smart bot)
  const makeBotMove = (currentBoard: (string | null)[]) => {
    const available = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (available.length === 0) return;

    // Check if bot can win
    for (const idx of available) {
      const copy = [...currentBoard];
      copy[idx] = "O";
      if (checkWinner(copy)?.winner === "O") {
        executeMove(idx, "O", copy);
        return;
      }
    }

    // Check if player can win and block
    for (const idx of available) {
      const copy = [...currentBoard];
      copy[idx] = "X";
      if (checkWinner(copy)?.winner === "X") {
        const botCopy = [...currentBoard];
        botCopy[idx] = "O";
        executeMove(idx, "O", botCopy);
        return;
      }
    }

    // Take center if available
    if (currentBoard[4] === null) {
      const copy = [...currentBoard];
      copy[4] = "O";
      executeMove(4, "O", copy);
      return;
    }

    // Random choice
    const randomIdx = available[Math.floor(Math.random() * available.length)];
    const copy = [...currentBoard];
    copy[randomIdx] = "O";
    executeMove(randomIdx, "O", copy);
  };

  const executeMove = (idx: number, player: string, newBoard: (string | null)[]) => {
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if (res) {
      setWinner(res.winner);
      setWinningLine(res.line);
      if (res.winner === "X") {
        saveScore({ ...score, player: score.player + 1 });
      } else if (res.winner === "O") {
        saveScore({ ...score, bot: score.bot + 1 });
      } else {
        saveScore({ ...score, ties: score.ties + 1 });
      }
    } else {
      setIsXNext(player === "O");
    }
  };

  const handleClick = (idx: number) => {
    if (board[idx] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[idx] = "X";
    setBoard(newBoard);

    const res = checkWinner(newBoard);
    if (res) {
      setWinner(res.winner);
      setWinningLine(res.line);
      if (res.winner === "X") {
        saveScore({ ...score, player: score.player + 1 });
      } else {
        saveScore({ ...score, ties: score.ties + 1 });
      }
    } else {
      setIsXNext(false);
      setTimeout(() => {
        makeBotMove(newBoard);
      }, 400);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full">
      {/* Score bar */}
      <div className="flex items-center justify-between w-full mb-4 px-3.5 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
          <User className="w-3.5 h-3.5" />
          <span>Kamu: {score.player}</span>
        </div>
        <div className="text-stone-500 dark:text-slate-400">Seri: {score.ties}</div>
        <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 font-semibold">
          <Bot className="w-3.5 h-3.5" />
          <span>Bot: {score.bot}</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-xs text-stone-600 dark:text-slate-300 font-mono mb-3 h-5 text-center">
        {winner ? (
          winner === "X" ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Kamu Menang! ✨</span>
          ) : winner === "O" ? (
            <span className="text-rose-500 font-semibold">Bot Menang! Coba lagi?</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Permainan Seri!</span>
          )
        ) : isXNext ? (
          <span className="text-rose-600 dark:text-rose-400">Giliranmu (X)</span>
        ) : (
          <span className="text-stone-400 dark:text-slate-400">Bot sedang berpikir...</span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 w-64 h-64 p-2 bg-stone-100 dark:bg-slate-950/70 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`rounded-xl font-mono text-2xl font-bold flex items-center justify-center transition-all ${
                cell
                  ? cell === "X"
                    ? isWinningCell
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 shadow-sm"
                      : "bg-white dark:bg-slate-800/80 text-rose-600 dark:text-rose-400 border border-stone-200 dark:border-slate-700 shadow-sm"
                    : isWinningCell
                    ? "bg-rose-500/20 text-rose-500 border border-rose-500/50"
                    : "bg-white dark:bg-slate-800/80 text-pink-600 dark:text-pink-400 border border-stone-200 dark:border-slate-700 shadow-sm"
                  : "bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/50 border border-stone-200 dark:border-slate-800 text-transparent shadow-sm active:scale-95"
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Reset Button */}
      <button
        onClick={resetGame}
        className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-rose-500 transition-colors font-mono shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
        <span>Main Lagi</span>
      </button>
    </div>
  );
}
