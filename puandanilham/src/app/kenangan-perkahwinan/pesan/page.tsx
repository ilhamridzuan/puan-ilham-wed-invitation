"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import { mergePhotoAndFrame } from "@/lib/canvasUtils";
import { createClient } from "@/lib/supabase/client";
import { getFrameConfig } from "@/lib/frameConfigs";
import Image from "next/image";

export default function PesanPage() {
  const router = useRouter();
  const { senderName, frameId, photos, setFinalImageUrl } = usePhotobooth();
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const frameConfig = getFrameConfig(frameId || "1");

  // Generate Preview on Mount
  useEffect(() => {
    if (!photos || photos.length === 0 || !frameId) {
      router.replace("/kenangan-perkahwinan");
      return;
    }

    const generatePreview = async () => {
      try {
        const frameUrl = frameId === "1" 
          ? "/assets/Strip Photobooth 1 Photo.svg"
          : frameId === "2" 
            ? "/assets/Strip Photobooth 2 Photo.svg"
            : "/assets/Strip Photobooth 4 Photo.svg";

        const blob = await mergePhotoAndFrame(photos, frameUrl, frameConfig, 1200);
        setMergedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Failed to merge photo:", err);
        setError("Gagal memproses gambar.");
      }
    };

    generatePreview();
  }, [photos, frameId, frameConfig, router]);

  const handleSubmit = async () => {
    if (!mergedBlob) return;
    if (message.trim().length === 0) {
      setError("Sila isi mesej untuk pengantin.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const supabase = createClient();
      
      // 1. Upload to Storage
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("photobooth")
        .upload(fileName, mergedBlob, {
          contentType: "image/webp",
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("photobooth")
        .getPublicUrl(fileName);
        
      const publicUrl = publicUrlData.publicUrl;
      
      // 2. Insert into Database
      const { error: dbError } = await supabase
        .from("photobooth_entries")
        .insert({
          sender_name: senderName,
          message: message.trim(),
          photo_url: publicUrl,
          frame_id: frameId
        });
        
      if (dbError) throw dbError;
      
      // 3. Update Context & Route
      setFinalImageUrl(publicUrl);
      router.push("/kenangan-perkahwinan/hasil");
      
    } catch (err) {
      console.error("Submit error:", err);
      setError("Terjadi kesalahan saat mengirim data. Sila cuba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative flex w-full h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white"
      aria-label="Halaman Pesan Photobooth"
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
      <div className="relative z-10 w-[94%] h-[96%] sm:w-[92%] sm:h-[94%] max-w-md flex flex-col bg-white/20 backdrop-blur-sm rounded-[24px] border border-white/30 shadow-sm p-4 sm:p-5 overflow-hidden">
        
        {/* Top section: Back button */}
        <div className="flex w-full justify-start shrink-0">
          <button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm hover:bg-white/30 transition-colors disabled:opacity-50"
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
              src="/assets/Title Photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="relative w-[150px] h-[75px] sm:w-[180px] sm:h-[90px] shrink-0">
            <Image 
              src="/assets/Puan&Ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* Photobooth Preview Display */}
        <div className="flex-1 w-full relative min-h-0 flex flex-col items-center justify-center overflow-hidden mb-2 sm:mb-4 px-2">
          {previewUrl ? (
            <div 
              className="relative h-full max-h-[40vh] sm:max-h-[50vh] w-auto max-w-full bg-white rounded-md shadow-md overflow-hidden flex items-center justify-center mx-auto shrink-0"
              style={{ aspectRatio: `${frameConfig.widthInch} / ${frameConfig.heightInch}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview Photobooth" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div 
              className="relative h-full max-h-[40vh] sm:max-h-[50vh] w-auto max-w-full bg-white/50 backdrop-blur-md animate-pulse rounded-md flex flex-col items-center justify-center text-primary/70 mx-auto shrink-0"
              style={{ aspectRatio: `${frameConfig.widthInch} / ${frameConfig.heightInch}` }}
            >
              <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-serif italic">Memproses...</span>
            </div>
          )}
        </div>

        {/* Message Input & Action Area */}
        <div className="w-full shrink-0 flex flex-col items-center pb-2">
          
          <div className="w-full relative mb-3 sm:mb-4">
            <textarea
              id="message"
              rows={3}
              maxLength={200}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError("");
              }}
              placeholder="Tinggalkan pesan untuk kami..."
              className="w-full bg-white border border-[#b2bee0] rounded-xl p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-[#384d95] focus:border-transparent resize-none text-[14px] sm:text-[15px] text-gray-800 placeholder:text-gray-400 placeholder:italic shadow-sm transition-all"
            />
            {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!mergedBlob || isSubmitting}
            className="relative flex h-[50px] w-full items-center justify-center rounded-[12px] bg-primary hover:bg-[#2c3d75] disabled:bg-gray-400 disabled:opacity-50 transition-colors shadow-md text-white"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="font-serif text-[18px] sm:text-[20px] italic">
                Selanjutnya
              </span>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}
