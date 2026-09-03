"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePhotobooth } from "../PhotoboothContext";
import { getFrameConfig } from "@/lib/frameConfigs";
import Image from "next/image";

export default function GaleriPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { frameId, setPhotos } = usePhotobooth();
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);
  
  const frameConfig = getFrameConfig(frameId || "1");
  const totalPhotos = frameConfig.photoCount;

  const handleUploadClick = () => {
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
          const newPhotos = [...localPhotos, ...uploadedPhotos];
          
          if (newPhotos.length >= totalPhotos) {
            // Trim to exactly totalPhotos
            const finalPhotos = newPhotos.slice(0, totalPhotos);
            setLocalPhotos(finalPhotos);
            setPhotos(finalPhotos);
            router.push("/kenangan-perkahwinan/filter");
          } else {
            setLocalPhotos(newPhotos);
          }
        }
      });
      
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRetakeLast = () => {
    setLocalPhotos(prev => prev.slice(0, -1));
  };

  // Preview the last uploaded photo or a placeholder
  const currentPreview = localPhotos.length > 0 ? localPhotos[localPhotos.length - 1] : null;

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

      {/* Main Preview */}
      <div className="flex-1 w-full flex justify-center items-center px-4 py-2 sm:py-4 min-h-0 relative z-10">
        <div 
          className="relative h-full aspect-[4/5] max-w-full bg-[#111] overflow-hidden border-[1.5px] border-dashed border-white/80 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleUploadClick}
        >
          {currentPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={currentPreview} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-white/50 text-center px-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="font-serif italic text-lg sm:text-xl text-white/80">Ketuk untuk pilih foto</p>
              <p className="text-xs sm:text-sm mt-2 max-w-[80%]">Anda bisa memilih satu atau beberapa foto sekaligus.</p>
            </div>
          )}
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
          title="Hapus foto sebelumnya"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        {/* Upload Button */}
        <button 
          onClick={handleUploadClick}
          className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] bg-white rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-90 transition-transform"
          title="Tambah Foto"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </button>

        {/* Spacer to keep center button balanced */}
        <div className="w-12 h-12 sm:w-14 sm:h-14"></div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        multiple
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />

    </main>
  );
}
