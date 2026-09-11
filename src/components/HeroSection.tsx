"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Laptop,
  Calculator,
  Coffee,
  BookOpen,
  Glasses,
  PenTool,
  Backpack,
  Compass,
  ClipboardList,
  StickyNote,
  HardHat,
  Radio,
  Camera,
  GraduationCap,
  Sparkles,
  MapPin,
  Ruler,
} from "lucide-react";

interface HeroSectionProps {
  onOpen: () => void;
}

// Student & Geomatics equipment icons - purely visual elements, NO text labels as requested
const studentElements = [
  { icon: Laptop, pos: "top-10 left-6 sm:left-14", size: "w-11 h-11", delay: 0.1, duration: 4.2 },
  { icon: Calculator, pos: "top-16 right-6 sm:right-16", size: "w-11 h-11", delay: 0.2, duration: 4.8 },
  { icon: Coffee, pos: "top-44 left-4 sm:left-24", size: "w-10 h-10", delay: 0.3, duration: 5.1 },
  { icon: BookOpen, pos: "top-48 right-4 sm:right-24", size: "w-10 h-10", delay: 0.4, duration: 4.5 },
  { icon: Glasses, pos: "bottom-36 left-8 sm:left-20", size: "w-10 h-10", delay: 0.5, duration: 5.4 },
  { icon: Ruler, pos: "bottom-32 right-8 sm:right-20", size: "w-10 h-10", delay: 0.6, duration: 4.3 },
  { icon: Backpack, pos: "top-28 left-1/4 hidden md:flex", size: "w-10 h-10", delay: 0.7, duration: 5.2 },
  { icon: Compass, pos: "top-24 right-1/4 hidden md:flex", size: "w-10 h-10", delay: 0.8, duration: 4.7 },
  { icon: HardHat, pos: "bottom-48 left-1/3 hidden lg:flex", size: "w-10 h-10", delay: 0.9, duration: 5.0 },
  { icon: Radio, pos: "bottom-44 right-1/3 hidden lg:flex", size: "w-10 h-10", delay: 1.0, duration: 4.6 },
  { icon: ClipboardList, pos: "bottom-20 left-12 sm:left-32", size: "w-10 h-10", delay: 1.1, duration: 5.3 },
  { icon: Camera, pos: "bottom-16 right-12 sm:right-32", size: "w-10 h-10", delay: 1.2, duration: 4.9 },
  { icon: StickyNote, pos: "top-64 left-2 sm:left-10 hidden sm:flex", size: "w-9 h-9", delay: 1.3, duration: 4.4 },
  { icon: PenTool, pos: "top-64 right-2 sm:right-10 hidden sm:flex", size: "w-9 h-9", delay: 1.4, duration: 5.5 },
];

export default function HeroSection({ onOpen }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 py-20 overflow-hidden bg-gradient-to-b from-rose-100/50 via-pink-50/40 to-transparent dark:from-rose-950/30 dark:via-[#1a0f16]/30 dark:to-transparent">
      {/* Soft pink ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-rose-400/20 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Student & Geomatics Equipment (Pure visual icons, NO text) */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto overflow-hidden">
        {studentElements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: item.delay }}
              className={`absolute ${item.pos} pointer-events-auto`}
            >
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, idx % 2 === 0 ? 3 : -3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: item.duration,
                  ease: "easeInOut",
                }}
                className={`${item.size} rounded-2xl bg-white/90 dark:bg-rose-950/70 border border-rose-200/90 dark:border-rose-800/70 shadow-sm hover:shadow-md hover:scale-110 hover:border-rose-400 transition-all flex items-center justify-center text-rose-500 dark:text-rose-300 backdrop-blur-sm cursor-pointer`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Title: "Untuk Bita" */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white mb-6"
        >
          Untuk <span className="text-rose-500 dark:text-rose-400">Bita</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-stone-600 dark:text-rose-200/90 font-light leading-relaxed max-w-xl mb-12"
        >
          Sebuah surat yang mungkin terlambat kusampaikan dengan cara yang benar.
        </motion.p>

        {/* Action button "Buka" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <button
            onClick={onOpen}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-medium text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-rose-400/40 shadow-rose-500/25 active:scale-[0.98]"
          >
            <span>Buka Surat</span>
            <ChevronDown className="w-4 h-4 text-rose-100 group-hover:translate-y-0.5 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.9, delay: 0.9 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={onOpen}
      >
        <span className="text-[10px] uppercase tracking-widest text-rose-400 dark:text-rose-300/60 font-mono">
          Gulir ke bawah
        </span>
        <div className="w-5 h-8 rounded-full border border-rose-300 dark:border-rose-800 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-rose-500"
          />
        </div>
      </motion.div>
    </section>
  );
}
