'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePhotobooth } from '../PhotoboothContext';
import { getFrameConfig } from '@/lib/frameConfigs';

export default function KameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { frameId, setPhotos } = usePhotobooth();
  const [error, setError] = useState('');
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);
  
  const frameConfig = getFrameConfig(frameId || '1');
  const totalPhotos = frameConfig.photoCount;

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Gagal mengakses kamera. Pastikan anda telah memberikan izin.');
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
      const canvas = document.createElement('canvas');
      
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
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const newPhotos = [...localPhotos, dataUrl];
        
        setLocalPhotos(newPhotos);
        
        if (newPhotos.length >= totalPhotos) {
          setPhotos(newPhotos);
          router.push('/kenangan-perkahwinan/pesan');
        }
      }
    }
  };

  const handleRetakeLast = () => {
    setLocalPhotos(prev => prev.slice(0, -1));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.back()} className="px-6 py-2 border rounded-lg">Kembali</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative">
      <div className="absolute top-10 w-full text-center z-10">
        <h2 className="text-2xl font-serif text-white/90">
          Ambil Foto ({localPhotos.length + 1} / {totalPhotos})
        </h2>
      </div>

      <div className="relative w-full max-w-md aspect-[4/5] bg-gray-900 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
         <video 
           ref={videoRef} 
           autoPlay 
           playsInline 
           muted 
           className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
         />
         <div className="absolute inset-0 border-[8px] border-white/20 pointer-events-none"></div>
      </div>
      
      <div className="absolute bottom-10 left-0 w-full flex justify-center items-center gap-8 px-6">
        <button 
          onClick={localPhotos.length > 0 ? handleRetakeLast : () => router.back()}
          className="text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
          title={localPhotos.length > 0 ? "Ulang foto sebelumnya" : "Kembali"}
        >
          {localPhotos.length > 0 ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          )}
        </button>
        
        <button 
          onClick={handleCapture}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:scale-105 transition-transform flex items-center justify-center shadow-lg"
        >
          <div className="w-16 h-16 bg-white rounded-full border border-gray-200"></div>
        </button>
        
        <div className="w-12 flex justify-center">
          {/* Progress indicator */}
          <span className="text-white/70 font-medium">{localPhotos.length}/{totalPhotos}</span>
        </div>
      </div>
    </div>
  );
}
