"use client";

import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAMES = [
  { id: "1", src: "/assets/Strip Photobooth 1 Photo.svg", name: "1 Foto" },
  { id: "2", src: "/assets/Strip Photobooth 2 Photo.svg", name: "2 Foto" },
  { id: "4", src: "/assets/Strip Photobooth 4 Photo.svg", name: "4 Foto" },
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function PilihBingkaiPage() {
  const router = useRouter();
  const { frameId, setFrameId } = usePhotobooth();

  // Find initial index based on context, default to 0
  const initialIndex = FRAMES.findIndex(f => f.id === frameId);
  const [[page, direction], setPage] = useState([initialIndex >= 0 ? initialIndex : 0, 0]);

  // Wrap around index
  const imageIndex = ((page % FRAMES.length) + FRAMES.length) % FRAMES.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // Sync context with local slider state
  useEffect(() => {
    const currentFrameId = FRAMES[imageIndex].id;
    if (frameId !== currentFrameId) {
      setFrameId(currentFrameId);
    }
  }, [imageIndex, frameId, setFrameId]);

  const handleNext = () => {
    if (!frameId) return;
    router.push("/kenangan-perkahwinan/metode-foto");
  };

  return (
    <main
      className="relative flex w-full h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white"
      aria-label="Halaman Pilih Bingkai"
    >
      {/* Layer 1 — Flower Pattern tile, fixed, 20% opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/Flower Pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "300px auto",
          opacity: 0.2,
        }}
      />

      {/* Layer 2 — Flower Decoration Pop GIF, fixed, above pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ opacity: 0.7 }}
      >
        <Image
          src="/assets/Flower Decoration Pop.gif"
          alt=""
          fill
          className="object-cover md:object-contain"
          unoptimized
          priority
        />
      </div>

      {/* Main Container - Giant Glass Card */}
      <div className="relative z-10 w-[92%] h-[94%] max-w-md flex flex-col bg-white/20 backdrop-blur-sm rounded-[24px] border border-white/30 shadow-sm p-5 overflow-hidden">
        
        {/* Top section: Back button */}
        <div className="flex w-full justify-start shrink-0">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm hover:bg-white/30 transition-colors"
            aria-label="Kembali"
          >
            <div className="flex items-center justify-center size-7 text-primary">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-full h-full"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Header: Title & Logo */}
        <div className="flex w-full flex-col items-center shrink-0 -mt-2 mb-2">
          {/* Title Photobooth */}
          <div className="relative h-[45px] w-[120px] shrink-0 mb-1">
            <Image 
              src="/assets/Title Photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          
          {/* Puan & Ilham Logo */}
          <div className="relative w-[180px] h-[90px] shrink-0 mb-1">
            <Image 
              src="/assets/Puan&Ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className="flex w-full shrink-0 flex-col items-center mb-4">
          <h1 className="font-script text-primary text-[32px] sm:text-[36px] leading-tight text-center whitespace-pre-wrap">
            {"Pilihlah Bingkai yang \nDiinginkan"}
          </h1>
        </div>

        {/* Carousel via Framer Motion */}
        <div className="flex-1 w-full relative min-h-0 flex items-center justify-center overflow-hidden mb-2">
          
          {/* Previous Button */}
          <button
            className="absolute left-1 z-20 p-2 rounded-full bg-white/40 backdrop-blur-md shadow-md border border-white/50 text-primary hover:bg-white/60 transition-colors active:scale-95"
            onClick={() => paginate(-1)}
            aria-label="Bingkai Sebelumnya"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-[70%] max-w-[240px] h-[90%] cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              <Image 
                src={FRAMES[imageIndex].src} 
                alt={FRAMES[imageIndex].name} 
                fill 
                className="object-contain drop-shadow-xl pointer-events-none" 
                priority 
              />
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          <button
            className="absolute right-1 z-20 p-2 rounded-full bg-white/40 backdrop-blur-md shadow-md border border-white/50 text-primary hover:bg-white/60 transition-colors active:scale-95"
            onClick={() => paginate(1)}
            aria-label="Bingkai Seterusnya"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

        </div>

        {/* Submit Button */}
        <button
          onClick={handleNext}
          disabled={!frameId}
          className="relative z-10 mt-2 flex h-[50px] w-full shrink-0 items-center justify-center rounded-[12px] bg-primary hover:bg-[#2c3d75] disabled:bg-gray-400 disabled:opacity-50 transition-colors shadow-md"
        >
          <span className="font-serif text-[20px] italic text-white">
            Pilih
          </span>
        </button>

      </div>
    </main>
  );
}
