"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Heart, Sparkles } from "lucide-react";

interface WordItem {
  word: string;
  hint: string;
}

const wordBank: WordItem[] = [
  { word: "GEODESI", hint: "Ilmu pengukuran dan pemodelan bentuk permukaan bumi" },
  { word: "KOORDINAT", hint: "Titik perpotongan garis lintang dan garis bujur" },
  { word: "TOPOGRAFI", hint: "Keadaan tinggi rendah muka bumi pada suatu kawasan" },
  { word: "KARTOGRAFI", hint: "Seni dan sains perancangan dan pembuatan peta" },
  { word: "SATELIT", hint: "Wahana antariksa untuk navigasi GNSS dan penginderaan jauh" },
  { word: "AZIMUTH", hint: "Sudut horizontal yang diukur searah jarum jam dari arah utara" },
  { word: "FOTOGRAMETRI", hint: "Seni dan teknologi survei dari foto udara atau drone" },
  { word: "POLIGON", hint: "Rangkaian titik pengukuran yang terhubung membentuk jaringan" },
  { word: "KONTUR", hint: "Garis khayal yang menghubungkan titik-titik dengan ketinggian sama" },
  { word: "THEODOLIT", hint: "Instrumen optik presisi untuk mengukur sudut horizontal dan vertikal" },
  { word: "BATIMETRI", hint: "Cabang survei yang mengukur kedalaman dasar perairan" },
  { word: "MERIDIAN", hint: "Garis bujur khayal yang membentang dari kutub utara ke selatan" },
  { word: "GEOID", hint: "Model fisik bentuk bumi berdasarkan bidang ekuipotensial gravitasi" },
  { word: "PROYEKSI", hint: "Metode pemindahan permukaan bola bumi ke bidang datar peta" },
  { word: "ZENITH", hint: "Titik koordinat langit yang berada tegak lurus tepat di atas kita" },
  { word: "NADIR", hint: "Titik bola langit yang berada tepat di bawah kaki pengamat" },
  { word: "BENCHMARK", hint: "Titik tetap di lapangan dengan koordinat dan elevasi presisi" },
  { word: "REFLEKSI", hint: "Perenungan mendalam untuk menyadari dan memperbaiki diri" },
  { word: "KESABARAN", hint: "Daya tahan hati yang tenang saat melalui proses pendewasaan" },
  { word: "KETULUSAN", hint: "Kebaikan yang diberikan secara murni tanpa mengharapkan pamrih" },
  { word: "KEPERCAYAAN", hint: "Ruang aman yang dibangun dari kejujuran dan saling menghargai" },
  { word: "KEHANGATAN", hint: "Rasa damai yang hadir ketika bersama seseorang yang berarti" },
  { word: "KOMUNIKASI", hint: "Jembatan untuk saling mendengar dan memahami tanpa berasumsi" },
  { word: "RUMAH", hint: "Tempat paling menenangkan untuk kembali di mana pun kita berada" },
  { word: "KENANGAN", hint: "Jejak cerita berharga yang tersimpan abadi di ingatan" },
  { word: "KOMITMEN", hint: "Janji teguh untuk melangkah lebih baik dan bertanggung jawab" },
];

export default function Hangman() {
  const [availableIndices, setAvailableIndices] = useState<number[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(6);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("game_hangman_best");
      if (saved) setBestStreak(parseInt(saved, 10));
    } catch {
      // ignore
    }
    initPool();
  }, []);

  const initPool = () => {
    const indices = Array.from({ length: wordBank.length }, (_, i) => i).sort(
      () => 0.5 - Math.random()
    );
    const first = indices.pop() ?? 0;
    setAvailableIndices(indices);
    setCurrentWordIdx(first);
    setGuessedLetters([]);
    setLives(6);
  };

  const pickNextWord = () => {
    let nextQueue = [...availableIndices];
    if (nextQueue.length === 0) {
      nextQueue = Array.from({ length: wordBank.length }, (_, i) => i).sort(
        () => 0.5 - Math.random()
      );
    }
    const nextIdx = nextQueue.pop() ?? 0;
    setAvailableIndices(nextQueue);
    setCurrentWordIdx(nextIdx);
    setGuessedLetters([]);
    setLives(6);
  };

  const currentItem = wordBank[currentWordIdx] || wordBank[0];
  const targetWord = currentItem.word;

  const isWon = targetWord.split("").every((letter) => guessedLetters.includes(letter));
  const isLost = lives <= 0;

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || isWon || isLost) return;

    const nextGuessed = [...guessedLetters, letter];
    setGuessedLetters(nextGuessed);

    if (!targetWord.includes(letter)) {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives === 0) {
        setStreak(0);
      }
    } else {
      if (targetWord.split("").every((l) => nextGuessed.includes(l))) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak > bestStreak) {
          setBestStreak(nextStreak);
          try {
            localStorage.setItem("game_hangman_best", nextStreak.toString());
          } catch {
            // ignore
          }
        }
      }
    }
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3 px-3 py-2 rounded-xl bg-stone-100/80 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-xs font-mono">
        <div className="flex items-center gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-3.5 h-3.5 ${
                i < lives
                  ? "text-rose-500 fill-rose-500/80"
                  : "text-stone-300 dark:text-slate-700"
              }`}
            />
          ))}
        </div>
        <span className="text-stone-700 dark:text-slate-300">Streak: {streak}</span>
        <span className="text-rose-600 dark:text-rose-400">Rekor: {bestStreak}</span>
      </div>

      {/* Clue */}
      <div className="text-xs text-stone-600 dark:text-slate-300 text-center mb-4 px-2 italic min-h-[32px] flex items-center justify-center">
        Petunjuk: &ldquo;{currentItem.hint}&rdquo;
      </div>

      {/* Word display */}
      <div className="flex gap-1.5 sm:gap-2 mb-6 flex-wrap justify-center max-w-xs">
        {targetWord.split("").map((letter, idx) => {
          const isGuessed = guessedLetters.includes(letter);
          return (
            <div
              key={idx}
              className={`w-7 sm:w-8 h-9 sm:h-10 border-b-2 flex items-center justify-center font-mono text-base sm:text-lg font-bold transition-colors ${
                isGuessed
                  ? "border-rose-500 text-stone-900 dark:text-white"
                  : isLost
                  ? "border-rose-500 text-rose-500"
                  : "border-stone-300 dark:border-slate-600 text-transparent"
              }`}
            >
              {isGuessed || isLost ? letter : "_"}
            </div>
          );
        })}
      </div>

      {/* Game State Message */}
      <div className="text-xs font-mono mb-3 h-5 text-center">
        {isWon && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tebakan tepat! Keren! 🎉</span>}
        {isLost && <span className="text-rose-500">Kesempatan habis! Jawabannya: {targetWord}</span>}
      </div>

      {/* Alphabet keyboard */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 w-full max-w-xs mb-4">
        {alphabet.map((letter) => {
          const isGuessed = guessedLetters.includes(letter);
          const isMatch = isGuessed && targetWord.includes(letter);

          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed || isWon || isLost}
              className={`h-8 rounded-lg font-mono text-xs font-semibold transition-all ${
                isGuessed
                  ? isMatch
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                    : "bg-stone-200/50 dark:bg-slate-900/50 text-stone-400 dark:text-slate-600 border border-stone-200 dark:border-slate-800 opacity-40"
                  : "bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-rose-500 hover:text-rose-600 shadow-sm active:scale-95"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <button
        onClick={pickNextWord}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-rose-500 transition-colors font-mono shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
        <span>Kata Acak Berikutnya</span>
      </button>
    </div>
  );
}
