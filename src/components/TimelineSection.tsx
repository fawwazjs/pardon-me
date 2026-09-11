"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Clock, Heart, Plane, BookOpen, GraduationCap } from "lucide-react";

interface TimelineItem {
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  description: string;
}

const timelineData: TimelineItem[] = [
  {
    title: "SMP kelas 7C",
    subtitle: "Tempat semuanya berawal",
    badge: "Chapter 01",
    icon: Compass,
    description: "Pertama kali aku mengenalmu di ruang kelas yang sederhana itu. Awal dari jejak langkah yang tidak pernah kuduga akan sejauh ini.",
  },
  {
    title: "Masa menunggu yang panjang",
    subtitle: "Waktu yang menguji kesabaran",
    badge: "Chapter 02",
    icon: Clock,
    description: "Bulan-bulan dan tahun-tahun berjalan. Ada keraguan, ada diam, namun nama itu tidak pernah benar-benar pudar di benakku.",
  },
  {
    title: "Akhirnya bersama",
    subtitle: "Sebuah titik temu yang berharga",
    badge: "Chapter 03",
    icon: Heart,
    description: "Ketika takdir akhirnya memberi ruang untuk kita melangkah berdampingan, rasanya seperti menemukan arah yang selama ini dicari.",
  },
  {
    title: "Banyak perjalanan",
    subtitle: "Langkah-langkah yang kita lalui",
    badge: "Chapter 04",
    icon: Plane,
    description: "Setiap kilometer, setiap jalanan yang kita lewati bersama bukan sekadar rute, melainkan kenangan yang terpatri rapi.",
  },
  {
    title: "Banyak cerita",
    subtitle: "Tawa dan obrolan tanpa akhir",
    badge: "Chapter 05",
    icon: BookOpen,
    description: "Dari hal-hal kecil tak penting hingga mimpi-mimpi besar tentang hari esok, selalu ada rasa nyaman saat berbagi denganmu.",
  },
  {
    title: "Banyak pelajaran",
    subtitle: "Proses mendewasakan diri",
    badge: "Chapter 06",
    icon: GraduationCap,
    description: "Tentang bagaimana menjaga perasaan, belajar mengerti, dan menyadari bahwa cinta juga membutuhkan kedewasaan.",
  },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-rose-500 dark:text-rose-400 font-mono mb-2">
            Napak Tilas
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Jejak Waktu Kita
          </h2>
        </div>

        {/* Timeline items */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-rose-200 dark:bg-rose-950/80" />

          <div className="space-y-10">
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className={`relative flex items-center ${
                    isEven ? "sm:flex-row-reverse" : "sm:flex-row"
                  } flex-row`}
                >
                  {/* Content Card */}
                  <div className="w-full sm:w-[calc(50%-28px)] pl-12 sm:pl-0">
                    <div className="theme-card p-6 rounded-2xl theme-card-hover shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-mono text-rose-500 dark:text-rose-400 font-semibold">
                          {item.badge}
                        </span>
                        <span className="text-xs text-stone-500 dark:text-rose-300/60">{item.subtitle}</span>
                      </div>
                      <h3 className="text-lg font-medium text-stone-900 dark:text-rose-50 mb-2">{item.title}</h3>
                      <p className="text-sm text-stone-600 dark:text-rose-200/80 leading-relaxed font-light">{item.description}</p>
                    </div>
                  </div>

                  {/* Marker Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-rose-950 border-2 border-rose-500 flex items-center justify-center shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Closing Narrative */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl theme-card border-rose-300/40 dark:border-rose-900/50 text-center max-w-2xl mx-auto shadow-sm">
          <p className="text-base sm:text-lg text-stone-800 dark:text-rose-100 font-serif italic leading-relaxed">
            &ldquo;Karena semua itu berarti bagiku, aku tidak ingin membiarkan kesalahanku berlalu tanpa memperbaikinya.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
