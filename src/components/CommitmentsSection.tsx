"use client";

import React, { useState } from "react";
import { CheckCircle2, CircleDot } from "lucide-react";

interface Commitment {
  text: string;
  detail: string;
}

const commitments: Commitment[] = [
  {
    text: "Belajar mempercayai lebih baik.",
    detail: "Membangun keyakinan yang sehat tanpa membiarkan rasa cemas mengambil alih pikiran.",
  },
  {
    text: "Mengurangi sikap posesif.",
    detail: "Menyadari bahwa mencintai bukan tentang memiliki, melainkan tentang mendukung dan menghargai.",
  },
  {
    text: "Mengurangi kebutuhan untuk selalu tahu semuanya.",
    detail: "Memberikan rasa tenang tanpa harus selalu menuntut penjelasan atas setiap hal kecil.",
  },
  {
    text: "Mendengarkan lebih banyak.",
    detail: "Memberi ruang penuh untuk ceritamu dan perasaanmu tanpa langsung membela diri.",
  },
  {
    text: "Menghargai ruang pribadi.",
    detail: "Menghormati batasan, privasi, dan waktu yang kamu butuhkan untuk dirimu sendiri.",
  },
  {
    text: "Menjadi pasangan yang memberi rasa aman.",
    detail: "Bukan yang menjadi sumber kekhawatiran atau beban pikiran, melainkan tempat berlabuh yang menenangkan.",
  },
];

export default function CommitmentsSection() {
  const [checkedItems, setCheckedItems] = useState<number[]>(
    commitments.map((_, i) => i) // Default all checked
  );

  const toggleCheck = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter((i) => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  return (
    <section id="komitmen" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-rose-500 dark:text-rose-400 font-mono mb-2">
            Langkah Nyata
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-white">
            Yang Akan Aku Perbaiki
          </h2>
          <p className="text-stone-500 dark:text-rose-300/70 text-sm mt-2">
            Bukan sekadar kata-kata manis, tapi komitmen untuk berubah menjadi pribadi yang lebih dewasa.
          </p>
        </div>

        {/* Checklist Container */}
        <div className="space-y-3.5">
          {commitments.map((item, index) => {
            const isChecked = checkedItems.includes(index);

            return (
              <div
                key={item.text}
                onClick={() => toggleCheck(index)}
                className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                  isChecked
                    ? "bg-white dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-sm"
                    : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-950"
                }`}
              >
                {/* Checkbox Icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                  ) : (
                    <CircleDot className="w-5 h-5 text-stone-400 dark:text-rose-400/50" />
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3
                    className={`text-base font-medium transition-colors ${
                      isChecked ? "text-stone-900 dark:text-rose-100" : "text-stone-500 dark:text-rose-300/50"
                    }`}
                  >
                    {item.text}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-rose-200/70 mt-1 font-light leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-rose-400 dark:text-rose-400/50">
                  #{index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
