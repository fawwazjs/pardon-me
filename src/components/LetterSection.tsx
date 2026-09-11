"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Feather, Eye } from "lucide-react";

const fullLetterText = `Aku tahu akhir-akhir ini aku membuatmu lelah.

Aku tahu mungkin ada banyak hal yang selama ini kamu pendam sampai akhirnya terasa terlalu berat untuk disimpan sendiri.

Saat kita berbicara dan sama-sama menangis, aku menyadari bahwa masalah kita bukan hanya tentang satu kejadian.

Ada rasa lelah, kecewa, dan kehilangan kenyamanan yang mungkin sudah lama menumpuk.

Aku tidak bisa mengubah apa yang sudah terjadi.

Tapi aku bisa mengakui bahwa aku salah.

Aku masih menyayangimu.

Aku masih ingin memperjuangkan hubungan ini.

Namun kali ini bukan dengan memaksa.

Melainkan dengan menjadi seseorang yang lebih baik daripada sebelumnya.

Aku ingin belajar mempercayai.

Aku ingin belajar memberi ruang.

Aku ingin belajar mencintai tanpa membuatmu merasa terkekang.

Terima kasih sudah membaca sampai akhir.

Wildan`;

export default function LetterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [skipTypewriter, setSkipTypewriter] = useState(false);

  useEffect(() => {
    if (!isInView || skipTypewriter) {
      if (skipTypewriter) {
        setDisplayedText(fullLetterText);
        setIsDone(true);
      }
      return;
    }

    let currentIndex = 0;
    const speed = 25; // ms per char

    const interval = setInterval(() => {
      currentIndex++;
      setDisplayedText(fullLetterText.slice(0, currentIndex));

      if (currentIndex >= fullLetterText.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, skipTypewriter]);

  const handleSkip = () => {
    setSkipTypewriter(true);
    setDisplayedText(fullLetterText);
    setIsDone(true);
  };

  return (
    <section id="surat" ref={containerRef} className="relative py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Letter Card */}
        <div className="rounded-3xl p-8 sm:p-14 theme-card shadow-xl">
          {/* Top Letter Header */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-rose-200/80 dark:border-rose-950">
            <div className="flex items-center gap-2 text-stone-500 dark:text-rose-300/70">
              <Feather className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-mono tracking-widest uppercase">Surat Untukmu</span>
            </div>

            {!isDone && (
              <button
                onClick={handleSkip}
                className="text-xs font-mono text-rose-500 dark:text-rose-400 hover:underline flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Baca Langsung</span>
              </button>
            )}
          </div>

          {/* Letter Title */}
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-white tracking-tight mb-8">
            Untuk <span className="text-rose-500 dark:text-rose-400">Bita</span>
          </h2>

          {/* Typewriter Letter Content */}
          <div className="text-base sm:text-lg text-stone-700 dark:text-rose-100 font-light leading-loose whitespace-pre-line tracking-wide">
            {displayedText}
            {!isDone && (
              <span className="inline-block w-2 h-5 bg-rose-500 ml-1 animate-pulse align-middle" />
            )}
          </div>

          {/* Signature Area */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 pt-8 border-t border-rose-200/80 dark:border-rose-950 flex flex-col items-end"
            >
              <span className="text-xs font-mono text-stone-500 dark:text-rose-300/70 mb-1">Tertulis dengan tulus,</span>
              <span className="text-2xl font-serif italic text-stone-900 dark:text-white tracking-wider">Wildan</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
