"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import { getFrameConfig } from "@/lib/frameConfigs";
import Image from "next/image";

export default function KameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { frameId, setPhotos } = usePhotobooth();
  const [error, setError] = useState("");
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  
  const frameConfig = getFrameConfig(frameId || "1");
  const totalPhotos = frameConfig.photoCount;

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Gagal mengakses kamera. Pastikan Anda telah memberikan izin.");
      }
    };
    
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      
      const videoAspect = video.videoWidth / video.videoHeight;
      const targetAspect = 4 / 5;
      
      let sWidth = video.videoWidth;
      let sHeight = video.videoHeight;
      let sx = 0;
      let sy = 0;
      
      if (videoAspect > targetAspect) {
        sWidth = video.videoHeight * targetAspect;
        sx = (video.videoWidth - sWidth) / 2;
      } else {
        sHeight = video.videoWidth / targetAspect;
        sy = (video.videoHeight - sHeight) / 2;
      }
      
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const newPhotos = [...localPhotos, dataUrl];
        
        setLocalPhotos(newPhotos);
        
        if (newPhotos.length >= totalPhotos) {
          setPhotos(newPhotos);
          router.push("/kenangan-perkahwinan/filter");
        }
      }
    }
  };

  const handleRetakeLast = () => {
    setLocalPhotos(prev => prev.slice(0, -1));
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.back()} className="px-6 py-2 border border-white text-white rounded-lg hover:bg-white/10 transition-colors">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <main className="relative flex w-full h-[100dvh] flex-col items-center overflow-hidden bg-[#050505] pb-6 sm:pb-8">
      
      {/* Top Header Section */}
      <div className="w-full flex justify-center items-start pt-6 pb-2 px-6 shrink-0 relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute left-6 top-6 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-200 transition-colors z-20"
          title="Kembali"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#384d95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Logos centered */}
        <div className="flex flex-col items-center pt-2 max-w-[50%]">
          <div className="relative h-[30px] w-[100px] sm:h-[40px] sm:w-[130px] mb-1 brightness-0 invert opacity-90">
            <Image 
              src="/assets/title-photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="relative w-[120px] h-[60px] sm:w-[150px] sm:h-[75px] brightness-0 invert">
            <Image 
              src="/assets/puan-dan-ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

      </div>

      {/* Camera Preview */}
      <div className="flex-1 w-full flex justify-center items-center px-4 py-2 sm:py-4 min-h-0 relative z-10">
        <div className="relative h-full aspect-[4/5] max-w-full bg-gray-900 overflow-hidden border-[1.5px] border-dashed border-white/80">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover transform ${facingMode === "user" ? "-scale-x-100" : ""}`}
          />
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="w-full flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-8 px-4 shrink-0">
        {Array.from({ length: totalPhotos }).map((_, i) => (
          <div 
            key={i} 
            className={`w-[14vw] max-w-[56px] sm:max-w-[64px] aspect-square relative flex items-center justify-center overflow-hidden border border-dashed border-white/60 ${localPhotos[i] ? 'bg-black' : 'bg-[#333333]'}`}
          >
             {localPhotos[i] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={localPhotos[i]} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
             ) : (
                <span className="text-white font-serif italic text-lg sm:text-2xl mt-1">
                  {i + 1}
                </span>
             )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm flex items-center justify-between px-8 sm:px-12 mt-2">
        {/* Undo Button */}
        <button 
          onClick={handleRetakeLast}
          disabled={localPhotos.length === 0}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
            localPhotos.length > 0 
              ? "bg-white/20 hover:bg-white/30 text-white shadow-md backdrop-blur-sm" 
              : "opacity-0 cursor-default"
          }`}
          title="Ulang foto sebelumnya"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        {/* Capture Button */}
        <button 
          onClick={handleCapture}
          className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] bg-white rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-90 transition-transform"
          title="Ambil Foto"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </button>

        {/* Flip Camera Button */}
        <button 
          onClick={handleFlipCamera}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-colors"
          title="Ganti Kamera"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

    </main>
  );
}
