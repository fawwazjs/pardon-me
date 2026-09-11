"use client";

import React from "react";
import { Compass, ExternalLink, Globe } from "lucide-react";

export default function GeoCornerSection() {
  return (
    <section id="geo-corner" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-600 dark:text-rose-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Geomatika Edition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Geo Corner
          </h2>
        </div>

        {/* Clean GeoLibre Viewer Embed */}
        <div className="rounded-3xl overflow-hidden theme-card border shadow-xl flex flex-col">
          {/* Top Bar with Direct Link */}
          <div className="px-5 py-3 border-b border-stone-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-mono bg-stone-100/70 dark:bg-slate-900/80">
            <div className="flex items-center gap-2 text-stone-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-rose-500" />
              <span className="font-semibold">GeoLibre GIS Viewer</span>
            </div>
            <a
              href="https://viewer.geolibre.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:underline"
            >
              <span>Buka Layar Penuh</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Full Interactive Viewer Iframe */}
          <div className="w-full h-[580px] sm:h-[660px] relative bg-stone-900">
            <iframe
              src="https://viewer.geolibre.app"
              title="GeoLibre Viewer Geomatika"
              className="w-full h-full border-0"
              allow="geolocation; fullscreen"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
