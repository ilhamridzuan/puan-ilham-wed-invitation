"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import { FILTER_PRESETS, type FilterPreset } from "@/lib/filterPresets";
import { getFrameConfig } from "@/lib/frameConfigs";
import Image from "next/image";

export default function FilterPage() {
  const router = useRouter();
  const { photos, setFilterId, setFilterCss, frameId } = usePhotobooth();
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>(FILTER_PRESETS[0]);
  const frameConfig = getFrameConfig(frameId || "1");

  useEffect(() => {
    if (!photos || photos.length === 0) {
      router.replace("/kenangan-perkahwinan");
    }
  }, [photos, router]);

  if (!photos || photos.length === 0) {
    return null; // Or a loading spinner
  }

  const handleSelect = () => {
    setFilterId(selectedFilter.id);
    setFilterCss(selectedFilter.css);
    router.push('/kenangan-perkahwinan/pesan');
  };

  return (
    <main
      className="relative flex w-full h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white"
      aria-label="Halaman Pilih Filter"
    >
      {/* Layer 1 — Flower Pattern tile */}
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

      {/* Layer 2 — Flower Decoration Pop GIF */}
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
      <div className="relative z-10 w-[94%] h-[96%] sm:w-[92%] sm:h-[94%] max-w-md flex flex-col bg-white/20 backdrop-blur-sm rounded-[24px] border border-white/30 shadow-sm p-4 sm:p-5 overflow-hidden">
        
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
        <div className="flex w-full flex-col items-center shrink-0 -mt-2 mb-2 sm:mb-4">
          <div className="relative h-[35px] w-[100px] sm:h-[45px] sm:w-[120px] shrink-0 mb-1">
            <Image 
              src="/assets/title-photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="relative w-[150px] h-[75px] sm:w-[180px] sm:h-[90px] shrink-0">
            <Image 
              src="/assets/puan-dan-ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* Filter Preview */}
        <div className="flex-1 w-full relative min-h-0 flex flex-col items-center justify-center overflow-hidden mb-4 sm:mb-6 px-2">
          <div 
            className="relative h-full max-h-[40vh] sm:max-h-[50vh] w-auto max-w-full bg-[#f8f8f8] p-2 sm:p-3 rounded-md overflow-hidden flex items-center justify-center mx-auto shrink-0 shadow-md"
            style={{ aspectRatio: `${frameConfig.widthInch} / ${frameConfig.heightInch}` }}
          >
            <div className={`w-full h-full ${
              frameConfig.layout === 'single' ? 'flex items-center justify-center' :
              frameConfig.layout === 'vertical' ? 'flex flex-col justify-center' :
              'grid grid-cols-2 grid-rows-2'
            }`}>
              {Array.from({ length: frameConfig.photoCount }).map((_, i) => (
                <div key={i} className={`relative w-full h-full overflow-hidden bg-gray-200 shadow-sm ${frameConfig.layout === 'vertical' ? 'flex-1' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[i] || photos[0]}
                    alt={`Preview Filter ${i+1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: selectedFilter.css }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Carousel */}
        <div className="w-full shrink-0 flex flex-col items-center pb-2">
          <div className="text-primary font-serif italic mb-3 sm:mb-4">
            Pilih Filter
          </div>
          
          <div className="w-full flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-4 mb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {FILTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedFilter(preset)}
                className={`flex flex-col items-center shrink-0 snap-center transition-all ${
                  selectedFilter.id === preset.id
                    ? 'scale-105'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden bg-gray-100 shadow-sm ${
                  selectedFilter.id === preset.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-transparent' : ''
                }`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[0]}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                    style={{ filter: preset.css }}
                  />
                </div>
                <span className={`text-[11px] sm:text-xs mt-2 font-serif italic ${
                  selectedFilter.id === preset.id
                    ? 'text-primary font-semibold'
                    : 'text-gray-600'
                }`}>
                  {preset.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleSelect}
            className="relative flex h-[50px] w-full items-center justify-center rounded-[12px] bg-primary hover:bg-[#2c3d75] transition-colors shadow-md text-white"
          >
            <span className="font-serif text-[18px] sm:text-[20px] italic">
              Pilih Filter
            </span>
          </button>
        </div>

      </div>
      
      {/* Hide scrollbar styles for WebKit */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </main>
  );
}
