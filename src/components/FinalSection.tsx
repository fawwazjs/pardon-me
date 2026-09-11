"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function FinalSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasClicked, setHasClicked] = useState(false);

  // Gentle starry drifting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.15 + 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${s.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const triggerStarConfetti = () => {
    setHasClicked(true);

    const count = 80;
    const defaults = {
      origin: { y: 0.7 },
      shapes: ["star"] as ("square" | "circle" | "star")[],
      colors: ["#F43F5E", "#FB7185", "#FDA4AF", "#F472B6", "#FDE047", "#FFF1F2"],
    };

    confetti({
      ...defaults,
      particleCount: count,
      spread: 65,
      startVelocity: 35,
      scalar: 1.2,
    });

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
      });
      confetti({
        ...defaults,
        particleCount: 40,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
      });
    }, 180);
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-80" />

      <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
        {/* Subtitle statement 1 */}
        <p className="text-xl sm:text-2xl text-stone-800 dark:text-rose-100 font-serif font-light leading-relaxed mb-4">
          Aku tidak meminta jawaban sekarang.
        </p>

        {/* Subtitle statement 2 */}
        <p className="text-base sm:text-lg text-stone-600 dark:text-rose-300/80 font-light leading-relaxed mb-10">
          Aku hanya ingin memastikan bahwa permintaan maaf ini sampai kepadamu.
        </p>

        {/* Star Confetti Button */}
        <button
          onClick={triggerStarConfetti}
          className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-medium text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-rose-400/40 shadow-rose-500/20 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform duration-300" />
          <span>Terima kasih sudah membaca</span>
        </button>

        {hasClicked && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-xs text-rose-500 dark:text-rose-300 font-mono flex items-center gap-1.5"
          >
            <span>Semoga harimu selalu hangat dan tenang ✨</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
