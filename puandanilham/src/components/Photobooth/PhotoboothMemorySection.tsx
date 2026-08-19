"use client";

import Image from "next/image";
import MemoryGallery from "./MemoryGallery";

export default function PhotoboothMemorySection() {
  return (
    <section
      className="relative z-10 pt-10 pb-8 flex flex-col items-center w-full px-4"
      aria-label="Galeri Kenangan"
    >
      {/* Title */}
      <div className="w-full flex flex-col items-center mb-4">
        <div className="w-60 h-[94px] relative">
          <Image
            src="/assets/title-photobooth.svg"
            alt="Kenangan Perkahwinan"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Subtitle in a glass card */}
      <div className="w-full max-w-[420px] rounded-2xl border border-white/30 bg-white/20 backdrop-blur-sm shadow-sm p-4 mb-8 flex items-center justify-center">
        <p className="text-[#384D95] font-serif italic text-[20px] text-center leading-snug">
          Abadikan setiap momen indah<br />dan ciptakan kenangan bersama
        </p>
      </div>

      {/* Glass card wrapping the gallery */}
      <div className="w-full max-w-[420px] rounded-2xl border border-white/30 bg-white/20 backdrop-blur-sm shadow-sm p-3">
        <MemoryGallery />
      </div>
    </section>
  );
}
