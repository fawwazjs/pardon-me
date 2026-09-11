"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function FinalSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasClicked, setHasClicked] = useState(false);

  // Gentle starry & floating heart drifting
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

    const stars = Array.from({ length: 75 }, () => ({
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
        ctx.fillStyle = `rgba(244, 63, 94, ${s.alpha * 0.7})`;
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

  const triggerLoveConfetti = () => {
    setHasClicked(true);

    const heartShape = confetti.shapeFromPath({
      path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    });

    const heartColors = ["#F43F5E", "#FB7185", "#FDA4AF", "#F472B6", "#EC4899", "#FFF1F2"];

    // Main heart explosion from center
    confetti({
      particleCount: 90,
      spread: 80,
      startVelocity: 40,
      scalar: 1.4,
      origin: { y: 0.65 },
      shapes: [heartShape],
      colors: heartColors,
    });

    // Side cannons (Left & Right)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        shapes: [heartShape],
        colors: heartColors,
        scalar: 1.3,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        shapes: [heartShape],
        colors: heartColors,
        scalar: 1.3,
      });
    }, 200);

    // Extra gentle shower of hearts
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.3 },
        shapes: [heartShape],
        colors: heartColors,
        scalar: 1.2,
      });
    }, 450);
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-90" />

      <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
        {/* Subtitle statement 1 */}
        <p className="text-xl sm:text-2xl text-stone-800 dark:text-rose-100 font-serif font-light leading-relaxed mb-3">
          Aku tidak meminta jawaban sekarang.
        </p>

        {/* Subtitle statement 2 */}
        <p className="text-base sm:text-lg text-stone-600 dark:text-rose-300/80 font-light leading-relaxed mb-10">
          Aku hanya ingin memastikan bahwa permintaan maaf ini sampai kepadamu.
        </p>

        {/* Main Action Button with Love & Plea */}
        <button
          onClick={triggerLoveConfetti}
          className="group relative inline-flex flex-col items-center gap-1.5 px-8 py-4.5 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-sm tracking-wide transition-all duration-300 shadow-lg hover:shadow-rose-400/50 shadow-rose-500/30 active:scale-[0.97]"
        >
          <div className="flex items-center gap-2 text-base font-semibold">
            <Heart className="w-5 h-5 fill-current text-rose-100 group-hover:scale-125 transition-transform duration-300" />
            <span>Terima kasih sudah membaca</span>
            <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform duration-300" />
          </div>

          <span className="text-xs font-mono text-rose-100/95 tracking-normal font-normal">
            pliss balikan &amp; lanjutin hubungan kita lagi yaa🥺
          </span>
        </button>

        {hasClicked && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-300/60 dark:border-rose-800/60 text-stone-800 dark:text-rose-100 text-sm font-mono flex flex-col items-center gap-1 max-w-md shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold text-base">
              <span>💖 Terpancar Banyak Cinta 💖</span>
            </div>
            <span className="text-xs text-stone-600 dark:text-rose-200/80 font-serif italic text-center mt-1">
              &ldquo;Semoga pintu hatimu terbuka lagi, dan hubungan kita bisa berlanjut dengan lebih baik, hangat, dan dewasa.&rdquo;
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
