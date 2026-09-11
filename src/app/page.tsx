"use client";

import React, { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import AudioPlayer from "@/components/AudioPlayer";
import Header, { NavTab } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import ReflectionSection from "@/components/ReflectionSection";
import ThankYouSection from "@/components/ThankYouSection";
import CommitmentsSection from "@/components/CommitmentsSection";
import GameCenterSection from "@/components/GameCenterSection";
import GeoCornerSection from "@/components/GeoCornerSection";
import CatGallerySection from "@/components/CatGallerySection";
import GeomaticsCalculatorSection from "@/components/GeomaticsCalculatorSection";
import LetterSection from "@/components/LetterSection";
import FinalSection from "@/components/FinalSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>("surat");
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage or default dark
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("bita_theme");
      if (savedTheme === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      } else {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    } catch {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("bita_theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("bita_theme", "light");
      } catch {}
    }
  };

  const handleOpenLetter = () => {
    const timelineEl = document.getElementById("timeline");
    if (timelineEl) {
      timelineEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-400">
      {/* Initial Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Floating Audio Player for RADWIMPS - Date */}
      <AudioPlayer />

      {/* Header Navigation with View Switcher & Theme Toggle */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Dynamic Content Views */}
      <main className="flex-1 w-full">
        {activeTab === "surat" && (
          <div className="animate-fadeIn">
            {/* 1. Hero Section */}
            <HeroSection onOpen={handleOpenLetter} />

            {/* 2. Timeline Section */}
            <TimelineSection />

            {/* 3. Section: Aku Mengerti Sekarang */}
            <ReflectionSection />

            {/* 4. Section: Terima Kasih */}
            <ThankYouSection />

            {/* 5. Section: Yang Akan Aku Perbaiki */}
            <CommitmentsSection />

            {/* 6. Letter Section (Surat Panjang Wildan) */}
            <LetterSection />

            {/* 7. Final Section (Langit Malam & Confetti Bintang) */}
            <FinalSection />
          </div>
        )}

        {activeTab === "geocorner" && (
          <div className="animate-fadeIn">
            <GeoCornerSection />
          </div>
        )}

        {activeTab === "kalkulator" && (
          <div className="animate-fadeIn">
            <GeomaticsCalculatorSection />
          </div>
        )}

        {activeTab === "games" && (
          <div className="animate-fadeIn">
            <GameCenterSection />
          </div>
        )}

        {activeTab === "kucing" && (
          <div className="animate-fadeIn">
            <CatGallerySection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
