"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePhotobooth } from "../PhotoboothContext";

export default function InfoPage() {
  const router = useRouter();
  const { senderName, setSenderName } = usePhotobooth();
  const [name, setName] = useState(senderName);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (name.trim().length < 2) {
      setError("Nama harus minimal 2 karakter.");
      return;
    }
    setSenderName(name.trim());
    router.push("/kenangan-perkahwinan/pilih-bingkai");
  };

  return (
    <main
      className="relative flex w-full h-[100dvh] flex-col items-center overflow-hidden bg-white"
      aria-label="Halaman Info Pengirim"
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

      {/* Main Content */}
      <div className="relative z-10 w-full h-full max-w-md mx-auto">
        
        {/* Top section: Back button and Title/Logo */}
        <div className="absolute top-[6%] sm:top-[8%] left-0 w-full flex flex-col items-start px-4 z-20">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center p-2 mb-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm hover:bg-white/30 transition-colors"
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
          
          <div className="flex w-full flex-col items-center relative shrink-0">
            {/* Title Photobooth */}
            <div className="relative h-[55px] w-[140px] shrink-0 mb-4">
              <Image 
                src="/assets/Title Photobooth.svg" 
                alt="Title Photobooth" 
                fill 
                className="object-contain" 
              />
            </div>
            
            {/* Puan & Ilham Logo */}
            <div className="relative w-[240px] h-[120px] shrink-0 mb-4">
              <Image 
                src="/assets/Puan&Ilham.svg" 
                alt="Puan & Ilham" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom section: Form box perfectly centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 z-20">
          <div className="relative flex w-full shrink-0 flex-col items-center justify-center gap-3 rounded-[12px] px-4 py-8 drop-shadow-sm">
            {/* Glass background */}
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[12px] bg-white/20 backdrop-blur-sm shadow-sm border border-white/30" />

            {/* Form Title */}
            <div className="relative z-10 flex w-full shrink-0 flex-col items-center mb-1">
              <h1 className="font-script text-primary text-[36px] leading-tight text-center whitespace-pre-wrap">
                {"Dari siapa \nkenangan ini?"}
              </h1>
            </div>

            {/* Divider Line */}
            <div className="relative z-10 h-px w-[90%] shrink-0 bg-primary/30 my-2" />

            {/* Input field */}
            <div className="relative z-10 flex w-full shrink-0 flex-col items-start gap-1">
              <div className="flex w-full shrink-0 items-center rounded-[12px] border-[0.5px] border-primary bg-transparent px-3 py-[14px]">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Nama Kamu..."
                  className="w-full bg-transparent font-serif text-[18px] text-neutral-800 placeholder:text-neutral-500/60 focus:outline-none text-center"
                />
              </div>
              {error && <p className="text-red-500 text-sm w-full text-center mt-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleNext}
              className="relative z-10 mt-3 flex h-[50px] w-full shrink-0 items-center justify-center rounded-[12px] bg-primary hover:bg-[#2c3d75] transition-colors"
            >
              <span className="font-serif text-[20px] italic text-white">
                Berikutnya
              </span>
            </button>
          </div>
        </div>
        
      </div>
    </main>
  );
}
