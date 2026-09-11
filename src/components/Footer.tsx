"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-stone-200/80 dark:border-slate-800/80 text-center">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-2">
        <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 font-light tracking-wide">
          Dibuat dengan harapan, bukan paksaan.
        </p>
        <p className="text-[10px] font-mono text-stone-400 dark:text-slate-600">
          Untuk Bita • {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
