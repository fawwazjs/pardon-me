"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Play, Pause, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube Iframe API script if not present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player("yt-audio-player", {
          height: "1",
          width: "1",
          videoId: "_A6AZQN6RP4", // RADWIMPS - Date (Kimi no Na wa)
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            loop: 1,
            playlist: "_A6AZQN6RP4",
          },
          events: {
            onReady: () => {
              setIsReady(true);
            },
            onStateChange: (event: any) => {
              // 1 = playing, 2 = paused, 0 = ended
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {
      // fallback
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* Hidden YouTube Player Iframe */}
      <div className="fixed -bottom-96 -left-96 opacity-0 pointer-events-none">
        <div id="yt-audio-player" />
      </div>

      {/* Floating Ambient Music Controller */}
      <div className="fixed bottom-5 right-5 z-40">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full theme-card shadow-lg border hover:border-rose-300 dark:hover:border-rose-600 transition-all duration-300">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Jeda lagu" : "Putar lagu"}
            className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm flex-shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <div className="flex flex-col text-left pr-1 cursor-pointer" onClick={togglePlay}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-wide text-stone-800 dark:text-rose-100">
                RADWIMPS — Date
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-rose-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
                  <span className="w-0.5 bg-pink-400 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-3" />
                  <span className="w-0.5 bg-rose-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s] h-1.5" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-stone-500 dark:text-rose-300/70">
              Kimi no Na wa OST • {isPlaying ? "Memutar musik" : "Ketuk untuk putar"}
            </span>
          </div>

          <a
            href="https://music.youtube.com/watch?v=_A6AZQN6RP4&si=aWe6p3v1CaimkjP2"
            target="_blank"
            rel="noopener noreferrer"
            title="Buka di YouTube Music"
            className="text-stone-400 dark:text-rose-400 hover:text-rose-500 transition-colors p-1"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </>
  );
}
