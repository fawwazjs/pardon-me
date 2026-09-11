"use client";

import React from "react";
import { motion } from "framer-motion";
import { CornerDownRight, HeartHandshake } from "lucide-react";

export default function ReflectionSection() {
  const narrativeLines = [
    "Aku sadar bahwa rasa sayangku kadang berubah menjadi rasa ingin mengontrol.",
    "Aku terlalu ingin tahu banyak hal yang sebenarnya merupakan ruang pribadimu.",
    "Aku menghubungi teman laki-lakimu karena rasa takut kehilangan, bukan karena aku tidak menyayangimu.",
    "Namun rasa takut bukan alasan yang membenarkan tindakanku.",
    "Aku mengerti bahwa hal itu mungkin membuatmu merasa tidak dipercaya.",
    "Dan untuk itu, aku benar-benar minta maaf.",
  ];

  return (
    <section id="refleksi" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 border border-rose-300/60 dark:border-rose-800/60 text-rose-600 dark:text-rose-300 text-xs font-mono uppercase tracking-widest mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
            <span>Refleksi Kejujuran</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Aku Mengerti Sekarang
          </h2>
          <p className="text-stone-500 dark:text-rose-300/70 text-sm mt-2">
            Menyadari kesalahan tanpa mencari pembenaran.
          </p>
        </div>

        {/* Reflection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl p-8 sm:p-12 theme-card shadow-lg"
        >
          <div className="space-y-6">
            {narrativeLines.map((line, idx) => {
              const isApology = idx === narrativeLines.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 ${
                    isApology
                      ? "mt-8 pt-6 border-t border-rose-200 dark:border-rose-900/60"
                      : ""
                  }`}
                >
                  <div className="mt-1 flex-shrink-0">
                    {isApology ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block shadow-sm" />
                    ) : (
                      <CornerDownRight className="w-4 h-4 text-rose-400 dark:text-rose-500/80" />
                    )}
                  </div>
                  <p
                    className={`leading-relaxed ${
                      isApology
                        ? "text-lg sm:text-xl font-medium text-rose-600 dark:text-rose-300 tracking-wide font-serif"
                        : "text-base sm:text-lg text-stone-700 dark:text-rose-100/90 font-light"
                    }`}
                  >
                    {line}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
