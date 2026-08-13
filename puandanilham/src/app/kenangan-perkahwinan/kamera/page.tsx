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
  
  const frameConfig = getFrameConfig(frameId || "1");
  const totalPhotos = frameConfig.photoCount;

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Gagal mengakses kamera. Pastikan anda telah memberikan izin.");
      }
    };
    
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const newPhotos = [...localPhotos, dataUrl];
        
        setLocalPhotos(newPhotos);
        
        if (newPhotos.length >= totalPhotos) {
          setPhotos(newPhotos);
          router.push("/kenangan-perkahwinan/pesan");
        }
      }
    }
  };

  const handleRetakeLast = () => {
    setLocalPhotos(prev => prev.slice(0, -1));
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
    <main className="relative flex w-full h-[100dvh] flex-col items-center overflow-hidden bg-[#050505] pb-8">
      
      {/* Top Header Section */}
      <div className="w-full flex justify-center items-start pt-6 pb-2 px-6 shrink-0 relative z-10">
        
        {/* Back / Undo Button */}
        <button 
          onClick={localPhotos.length > 0 ? handleRetakeLast : () => router.back()}
          className="absolute left-6 top-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-200 transition-colors z-20"
          title={localPhotos.length > 0 ? "Ulang foto sebelumnya" : "Kembali"}
        >
          {localPhotos.length > 0 ? (
            <svg className="w-5 h-5 text-[#384d95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-[#384d95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m15 18-6-6 6-6" />
            </svg>
          )}
        </button>

        {/* Logos centered */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative h-[40px] w-[130px] mb-1 brightness-0 invert opacity-90">
            <Image 
              src="/assets/Title Photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="relative w-[150px] h-[75px] brightness-0 invert">
            <Image 
              src="/assets/Puan&Ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 w-full flex flex-col justify-center items-center px-[5%] sm:px-10 min-h-0 relative z-10 my-4">
        <div className="relative w-full max-w-[340px] aspect-[4/5] bg-gray-900 overflow-hidden border-[1.5px] border-dashed border-white/80">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
          />
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="w-full flex justify-center gap-2 mb-8 px-4 shrink-0">
        {Array.from({ length: totalPhotos }).map((_, i) => (
          <div 
            key={i} 
            className={`w-[14vw] max-w-[64px] aspect-square relative flex items-center justify-center overflow-hidden border border-dashed border-white/60 ${localPhotos[i] ? 'bg-black' : 'bg-[#333333]'}`}
          >
             {localPhotos[i] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={localPhotos[i]} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
             ) : (
                <span className="text-white font-serif italic text-xl sm:text-2xl mt-1">
                  {i + 1}
                </span>
             )}
          </div>
        ))}
      </div>

      {/* Capture Button */}
      <button 
        onClick={handleCapture}
        className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-90 transition-transform"
        title="Ambil Foto"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      </button>

    </main>
  );
}
