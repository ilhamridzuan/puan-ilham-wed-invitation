"use client";

import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import { useRef } from "react";
import { getFrameConfig } from "@/lib/frameConfigs";
import Image from "next/image";

const FRAMES = [
  { id: "1", src: "/assets/strip-photobooth-1-photo.svg" },
  { id: "2", src: "/assets/strip-photobooth-2-photo.svg" },
  { id: "4", src: "/assets/strip-photobooth-4-photo.svg" },
];

export default function MetodeFotoPage() {
  const router = useRouter();
  const { frameId, setPhotos } = usePhotobooth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frameConfig = getFrameConfig(frameId || "1");
  const totalPhotos = frameConfig.photoCount;
  
  const selectedFrameSrc = FRAMES.find((f) => f.id === frameId)?.src || FRAMES[0].src;

  const handleCamera = () => {
    router.push("/kenangan-perkahwinan/kamera");
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const promises: Promise<string>[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const promise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                resolve(event.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          });
          promises.push(promise);
        }
      }
      
      Promise.all(promises).then(uploadedPhotos => {
        if (uploadedPhotos.length > 0) {
          let finalPhotos = [...uploadedPhotos];
          while (finalPhotos.length < totalPhotos) {
            finalPhotos.push(finalPhotos[finalPhotos.length - 1]);
          }
          finalPhotos = finalPhotos.slice(0, totalPhotos);
          
          setPhotos(finalPhotos);
          router.push("/kenangan-perkahwinan/filter");
        }
      });
    }
  };

  return (
    <main
      className="relative flex w-full h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white"
      aria-label="Halaman Metode Foto"
    >
      {/* Layer 1 — Flower Pattern tile, fixed, 20% opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/flower-pattern.png')",
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
          src="/assets/flower-decoration-pop.gif"
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
        <div className="flex w-full flex-col items-center shrink-0 -mt-2 mb-4">
          <div className="relative h-[45px] w-[120px] shrink-0 mb-1">
            <Image 
              src="/assets/title-photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          
          <div className="relative w-[180px] h-[90px] shrink-0">
            <Image 
              src="/assets/puan-dan-ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* Selected Frame Display */}
        <div className="flex-1 w-full relative min-h-0 flex items-center justify-center overflow-hidden mb-8">
          <div className="relative w-[70%] h-[95%] max-w-[240px] flex items-center justify-center">
            <Image 
              src={selectedFrameSrc} 
              alt="Bingkai Pilihan" 
              fill 
              className="object-contain drop-shadow-xl pointer-events-none" 
              priority 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full shrink-0 items-center">
          {/* Buka Kamera */}
          <button
            onClick={handleCamera}
            className="relative z-10 flex h-[50px] w-full shrink-0 items-center justify-center gap-3 rounded-[12px] bg-primary hover:bg-[#2c3d75] transition-colors shadow-md text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            <span className="font-serif text-[18px] sm:text-[20px] italic">
              Buka Kamera
            </span>
          </button>
          
          {/* Ambil dari Galeri */}
          <button
            onClick={handleGalleryClick}
            className="relative z-10 flex h-[50px] w-full shrink-0 items-center justify-center gap-3 rounded-[12px] bg-white hover:bg-neutral-50 shadow-md transition-colors text-primary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="font-serif text-[18px] sm:text-[20px] italic">
              Ambil dari Galeri
            </span>
          </button>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          multiple
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>
    </main>
  );
}
