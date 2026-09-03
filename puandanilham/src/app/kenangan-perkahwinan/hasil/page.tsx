"use client";

import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { sanitizeInput } from "@/lib/sanitize";

export default function HasilPage() {
  const router = useRouter();
  const { finalImageUrl, senderName, frameId, message, reset } = usePhotobooth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!finalImageUrl) {
      router.replace("/kenangan-perkahwinan");
    }
  }, [finalImageUrl, router]);

  const handleSaveToGallery = async () => {
    if (!finalImageUrl || isSaved) return;
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("photobooth_entries")
        .insert({
          sender_name: sanitizeInput(senderName),
          message: sanitizeInput(message),
          photo_url: finalImageUrl,
          frame_id: frameId
        });
        
      if (dbError) throw dbError;
      setIsSaved(true);
    } catch (err) {
      console.error("Save to gallery failed:", err);
      alert("Gagal menyimpan ke galeri. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!finalImageUrl) return;
    try {
      const response = await fetch(finalImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kenangan-puan-ilham-${senderName.replace(/\s+/g, "-").toLowerCase()}.png`;
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
        alert("Tautan berhasil disalin!");
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
      <div className="relative z-10 w-[94%] h-[96%] sm:w-[92%] sm:h-[94%] max-w-md flex flex-col bg-white/20 backdrop-blur-sm rounded-[24px] border border-white/30 shadow-sm px-4 py-5 sm:px-5 sm:py-6 overflow-hidden">
        
        {/* Header: Title & Logo */}
        <div className="flex w-full flex-col items-center shrink-0 mb-3 sm:mb-4">
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

        {/* Final Photobooth Display */}
        <div className="flex-1 w-full relative min-h-0 flex flex-col items-center justify-center overflow-hidden mb-8 sm:mb-10 mt-2">
          <div className="relative h-full max-h-[50vh] sm:max-h-[55vh] w-auto max-w-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={finalImageUrl} alt="Hasil Photobooth" className="w-auto h-full max-w-full max-h-full object-contain drop-shadow-xl" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full shrink-0 flex flex-col gap-4 sm:gap-5">

          {/* Primary Action */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleSaveToGallery}
            disabled={isSaving || isSaved}
            className={`flex h-[42px] sm:h-[50px] w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] transition-colors shadow-md text-white ${isSaved ? 'bg-green-600' : 'bg-primary hover:bg-[#2c3d75]'}`}
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isSaved ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            )}
            <span className="font-serif text-[15px] sm:text-[18px] italic font-semibold">
              {isSaved ? "Telah Ditambah ke Galeri" : "Tampilkan ke galeri kenangan"}
            </span>
          </button>
          
          <p className="text-center text-[10px] sm:text-xs text-gray-700 px-2 leading-tight">
            Kami sangat berterima kasih jika Anda berkenan untuk momen ini ditampilkan ke galeri kenangan.
          </p>
          </div>

          <div className="w-full h-[1px] bg-white/30 rounded-full my-0.5"></div>

          {/* Secondary Actions */}
          <div className="flex flex-col gap-2 sm:gap-3">

          <button
            onClick={handleDownload}
            className="flex h-[42px] sm:h-[50px] w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="font-serif text-[15px] sm:text-[18px] italic font-semibold">
              Unduh Momen
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex h-[42px] sm:h-[50px] w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            <span className="font-serif text-[15px] sm:text-[18px] italic font-semibold">
              Bagikan Momen
            </span>
          </button>

          <button
            onClick={handleRetake}
            className="flex h-[42px] sm:h-[50px] w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span className="font-serif text-[15px] sm:text-[18px] italic font-semibold">
              Ambil Momen Lagi
            </span>
          </button>

          <button
            onClick={handleGallery}
            className="flex h-[42px] sm:h-[50px] w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
            </svg>
            <span className="font-serif text-[15px] sm:text-[18px] italic font-semibold">
              Kembali ke Halaman Utama
            </span>
          </button>

          </div>

        </div>

      </div>
    </main>
  );
}
