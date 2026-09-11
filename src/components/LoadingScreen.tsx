"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Progressive loading simulation (approx 2.8s)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 600);
        }, 300);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Star particles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const stars: { x: number; y: number; radius: number; alpha: number; speed: number; drift: number }[] = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        drift: (Math.random() - 0.5) * 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.y -= star.speed;
        star.x += star.drift;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 205, 214, ${star.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(244, 63, 94, 0.7)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#140A10] text-rose-100 overflow-hidden"
        >
          {/* Subtle star particle canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Glowing gradient aura in background */}
          <div className="absolute w-96 h-96 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <p className="text-sm md:text-base font-light tracking-widest text-rose-200 uppercase font-mono">
                Memuat kenangan...
              </p>
            </motion.div>

            {/* Progressive Loading Bar */}
            <div className="w-64 h-1.5 bg-rose-950/80 rounded-full overflow-hidden border border-rose-900/60 p-0.5 backdrop-blur">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300 rounded-full shadow-glow"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Percentage counter */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-xs font-mono text-slate-400"
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
