"use client";

import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import { useEffect } from "react";
import Image from "next/image";

export default function HasilPage() {
  const router = useRouter();
  const { finalImageUrl, senderName, reset } = usePhotobooth();

  useEffect(() => {
    if (!finalImageUrl) {
      router.replace("/kenangan-perkahwinan");
    }
  }, [finalImageUrl, router]);

  const handleDownload = async () => {
    if (!finalImageUrl) return;
    try {
      const response = await fetch(finalImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kenangan-puan-ilham-${senderName.replace(/\s+/g, "-").toLowerCase()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(finalImageUrl, "_blank");
    }
  };

  const handleShare = async () => {
    if (!finalImageUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kenangan Puan & Ilham",
          text: `Lihat gambar dari Virtual Photobooth Puan & Ilham oleh ${senderName}`,
          url: finalImageUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(finalImageUrl);
        alert("Tautan disalin ke papan klip!");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  const handleRetake = () => {
    reset();
    router.push("/kenangan-perkahwinan/info");
  };

  const handleGallery = () => {
    reset();
    router.push("/kenangan-perkahwinan");
  };

  if (!finalImageUrl) return null;

  return (
    <main
      className="relative flex w-full h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white"
      aria-label="Halaman Hasil Photobooth"
    >
      {/* Layer 1 — Flower Pattern tile */}
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

      {/* Layer 2 — Flower Decoration Pop GIF */}
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
      <div className="relative z-10 w-[92%] h-[94%] max-w-md flex flex-col bg-white/20 backdrop-blur-sm rounded-[24px] border border-white/30 shadow-sm px-5 py-6 overflow-hidden">
        
        {/* Header: Title & Logo */}
        <div className="flex w-full flex-col items-center shrink-0 mb-4">
          <div className="relative h-[45px] w-[120px] shrink-0 mb-1">
            <Image 
              src="/assets/Title Photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="relative w-[180px] h-[90px] shrink-0">
            <Image 
              src="/assets/Puan&Ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* Final Photobooth Display */}
        <div className="flex-1 w-full relative min-h-0 flex flex-col items-center justify-center overflow-hidden mb-6">
          <div className="relative w-full max-w-[200px] sm:max-w-[240px] max-h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={finalImageUrl} alt="Hasil Photobooth" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full shrink-0 flex flex-col gap-3">
          
          <button
            onClick={handleDownload}
            className="flex h-[45px] sm:h-[50px] w-full items-center justify-center gap-3 rounded-[12px] bg-primary hover:bg-[#2c3d75] transition-colors shadow-md text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="font-serif text-[16px] sm:text-[18px] italic font-semibold">
              Unduh Kenangan
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex h-[45px] sm:h-[50px] w-full items-center justify-center gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            <span className="font-serif text-[16px] sm:text-[18px] italic font-semibold">
              Bagikan Kenangan
            </span>
          </button>

          <button
            onClick={handleRetake}
            className="flex h-[45px] sm:h-[50px] w-full items-center justify-center gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span className="font-serif text-[16px] sm:text-[18px] italic font-semibold">
              Ambil Momen Lagi
            </span>
          </button>

          <button
            onClick={handleGallery}
            className="flex h-[45px] sm:h-[50px] w-full items-center justify-center gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
            </svg>
            <span className="font-serif text-[16px] sm:text-[18px] italic font-semibold">
              Kembali ke Halaman Utama
            </span>
          </button>

        </div>

      </div>
    </main>
  );
}
