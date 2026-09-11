"use client";

import React from "react";
import { Sparkles, Shield, Anchor, Home } from "lucide-react";

interface ThankYouItem {
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const thankYouCards: ThankYouItem[] = [
  {
    title: "Terima kasih karena pernah hadir.",
    subtitle: "Membawa warna dan cerita yang mengubah cara pandangku terhadap banyak hal.",
    icon: Sparkles,
  },
  {
    title: "Terima kasih karena pernah percaya.",
    subtitle: "Memberikan ruang kepercayaan yang begitu hangat dan berharga.",
    icon: Shield,
  },
  {
    title: "Terima kasih karena pernah bertahan.",
    subtitle: "Menemani di masa-masa sulit dengan kesabaran yang luar biasa.",
    icon: Anchor,
  },
  {
    title: "Terima kasih karena pernah menjadi rumah ketika dunia terasa berat.",
    subtitle: "Tempat paling tenang di mana aku selalu merasa diterima seutuhnya.",
    icon: Home,
  },
];

export default function ThankYouSection() {
  return (
    <section id="terima-kasih" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-rose-500 dark:text-rose-400 font-mono mb-2">
            Apresiasi Terdalam
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Terima Kasih
          </h2>
          <p className="text-stone-500 dark:text-rose-300/70 text-sm mt-2 max-w-md mx-auto">
            Untuk setiap kebaikan, waktu, dan ketulusan yang pernah kamu berikan.
          </p>
        </div>

        {/* 2x2 Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {thankYouCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-7 rounded-2xl theme-card theme-card-hover flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-500 dark:text-rose-300 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-stone-900 dark:text-white mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-rose-200/80 font-light leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-100 dark:border-rose-950/80 flex items-center justify-between text-[11px] text-stone-400 dark:text-rose-400/60 font-mono">
                  <span>GRATITUDE #{String(index + 1).padStart(2, "0")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
