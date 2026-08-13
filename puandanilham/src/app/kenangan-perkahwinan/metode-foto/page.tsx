'use client';

import { useRouter } from 'next/navigation';
import { usePhotobooth } from '../PhotoboothContext';
import { useRef } from 'react';
import { getFrameConfig } from '@/lib/frameConfigs';

export default function MetodeFotoPage() {
  const router = useRouter();
  const { frameId, setPhotos } = usePhotobooth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frameConfig = getFrameConfig(frameId || '1');
  const totalPhotos = frameConfig.photoCount;

  const handleCamera = () => {
    router.push('/kenangan-perkahwinan/kamera');
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const promises: Promise<string>[] = [];
      
      // Process all selected files (up to the required count)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
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
          // If they uploaded fewer photos than required, duplicate the last one
          let finalPhotos = [...uploadedPhotos];
          while (finalPhotos.length < totalPhotos) {
            finalPhotos.push(finalPhotos[finalPhotos.length - 1]);
          }
          // If they uploaded too many, slice it
          finalPhotos = finalPhotos.slice(0, totalPhotos);
          
          setPhotos(finalPhotos);
          router.push('/kenangan-perkahwinan/pesan');
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pb-24 bg-neutral-50 relative overflow-hidden">
      <button 
        onClick={() => router.back()}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-black/5 transition-colors z-10"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="text-center mb-10 mt-10">
        <h1 className="text-3xl font-serif text-amber-900 mb-3">Ambil Gambar</h1>
        <p className="text-gray-600">
          Bingkai ini memerlukan {totalPhotos} foto. Sila pilih metode.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button 
          onClick={handleCamera}
          className="w-full flex flex-col items-center justify-center gap-3 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow hover:border-amber-300 group"
        >
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className="font-medium text-lg text-gray-800">Gunakan Kamera</span>
          <span className="text-sm text-gray-500">Ambil {totalPhotos} foto secara langsung</span>
        </button>
        
        <button 
          onClick={handleGalleryClick}
          className="w-full flex flex-col items-center justify-center gap-3 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow hover:border-amber-300 group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span className="font-medium text-lg text-gray-800">Unggah dari Galeri</span>
          <span className="text-sm text-gray-500">Pilih {totalPhotos} foto dari perangkat</span>
        </button>
        
        <input 
          type="file" 
          accept="image/*" 
          multiple
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
}
