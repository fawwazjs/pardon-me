"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cat, RefreshCw, Heart, Info } from "lucide-react";

interface CatImage {
  id: string;
  url: string;
}

const fallbackCats: CatImage[] = [
  {
    id: "fb-1",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "fb-2",
    url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "fb-3",
    url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "fb-4",
    url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "fb-5",
    url: "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "fb-6",
    url: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&auto=format&fit=crop&q=80",
  },
];

const catFacts = [
  "Dengkuran kucing (purring) berada pada frekuensi 20-140 Hz yang terbukti secara medis dapat meredakan stres dan menenangkan pikiran.",
  "Kucing tidur sekitar 12-16 jam sehari untuk mengumpulkan energi menjadi makhluk paling menghibur.",
  "Saat kucing mengedipkan mata perlahan ke arahmu, itu adalah tanda kasih sayang dan rasa aman ('cat kiss').",
  "Kucing mengenali suara orang yang disayanginya, meski sesekali pura-pura santai.",
  "Pola hidung kucing unik seperti sidik jari manusia—tidak ada dua hidung kucing yang sama di dunia.",
  "Kucing tidak pernah menghakimi harimu yang buruk, mereka hanya datang dan duduk di sampingmu.",
];

export default function CatGallerySection() {
  const [cats, setCats] = useState<CatImage[]>(fallbackCats);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const fetchCats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=6", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCats((prev) => [...data, ...prev.slice(0, 6)]);
      }
    } catch {
      setCats((prev) => [...fallbackCats.sort(() => 0.5 - Math.random()), ...prev.slice(0, 6)]);
    } finally {
      setIsLoading(false);
      setCurrentFactIndex((prev) => (prev + 1) % catFacts.length);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return (
    <section id="kucing-darurat" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-600 dark:text-rose-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Cat className="w-3.5 h-3.5" />
            <span>Kucing Darurat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Saat Hidup Sedang Berat, Lihat Kucing
          </h2>
          <p className="text-stone-600 dark:text-slate-300 text-base sm:text-lg font-serif italic mt-3 max-w-xl mx-auto">
            &ldquo;Karena beberapa masalah memang tidak bisa diselesaikan, tapi bisa ditemani kucing.&rdquo;
          </p>
        </div>

        {/* Fact Banner */}
        <div className="mb-10 p-4 rounded-2xl theme-card flex items-start sm:items-center gap-3 max-w-2xl mx-auto shadow-sm">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-rose-600 dark:text-rose-400 mr-1">Fakta Kucing:</span>
            {catFacts[currentFactIndex]}
          </div>
        </div>

        {/* Masonry Gallery Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {cats.slice(0, 9).map((cat, idx) => (
            <div
              key={`${cat.id}-${idx}`}
              className="relative group rounded-2xl overflow-hidden theme-card break-inside-avoid shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.url}
                alt="Foto Kucing Lucu"
                loading="lazy"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-between pointer-events-none">
                <span className="text-[11px] font-mono text-white">#CatTherapy</span>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-rose-400">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button: "Kasih Aku Kucing Lagi" */}
        <div className="mt-12 text-center">
          <button
            onClick={fetchCats}
            disabled={isLoading}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 dark:bg-slate-800 hover:bg-stone-800 dark:hover:bg-slate-700 text-white text-xs font-mono tracking-wide shadow-md active:scale-[0.98] transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-rose-400 ${isLoading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`}
            />
            <span>{isLoading ? "Mengambil Kucing..." : "Kasih Aku Kucing Lagi"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
