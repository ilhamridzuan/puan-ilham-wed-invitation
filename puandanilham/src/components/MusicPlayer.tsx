"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

interface MusicPlayerProps {
  isPlayingProp: boolean;
  forcePlayTrigger?: boolean;
}

export default function MusicPlayer({ isPlayingProp, forcePlayTrigger }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playFailed, setPlayFailed] = useState(false);

  const attemptPlay = () => {
    if (audioRef.current && !isPlaying) {
      if (audioRef.current.currentTime < 5) {
        audioRef.current.currentTime = 5;
      }
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setPlayFailed(false);
      }).catch((e) => {
        console.error("Autoplay prevented:", e);
        setIsPlaying(false);
        setPlayFailed(true);
      });
    }
  };

  useEffect(() => {
    if (isPlayingProp) {
      attemptPlay();
    }
  }, [isPlayingProp]);

  useEffect(() => {
    if (forcePlayTrigger) {
      attemptPlay();
    }
  }, [forcePlayTrigger]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 5;
      audioRef.current.play();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/gurindam-jiwa.mp3"
        onEnded={handleEnded}
      />
      <AnimatePresence>
        {isPlayingProp && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50"
          >
            <button
              onClick={togglePlay}
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-[#384D95] shadow-lg border border-white/50 transition-transform active:scale-95 hover:bg-white/50 relative ${playFailed ? 'animate-bounce' : ''}`}
              aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
            >
              {playFailed && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
