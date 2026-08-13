'use client';

import { useRouter } from 'next/navigation';
import { usePhotobooth } from '../PhotoboothContext';
import { useEffect } from 'react';

export default function HasilPage() {
  const router = useRouter();
  const { finalImageUrl, senderName, reset } = usePhotobooth();

  useEffect(() => {
    if (!finalImageUrl) {
      router.replace('/kenangan-perkahwinan');
    }
  }, [finalImageUrl, router]);

  const handleDownload = async () => {
    if (!finalImageUrl) return;
    try {
      const response = await fetch(finalImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kenangan-puan-ilham-${senderName.replace(/\s+/g, '-').toLowerCase()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback
      window.open(finalImageUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (!finalImageUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kenangan Puan & Ilham',
          text: `Lihat gambar dari Virtual Photobooth Puan & Ilham oleh ${senderName}`,
          url: finalImageUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to copy link
      try {
        await navigator.clipboard.writeText(finalImageUrl);
        alert('Tautan disalin ke papan klip!');
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const handleRetake = () => {
    reset();
    router.push('/kenangan-perkahwinan/info');
  };

  const handleGallery = () => {
    reset();
    router.push('/kenangan-perkahwinan');
  };

  if (!finalImageUrl) return null;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 pb-32 bg-neutral-50">
      <h1 className="text-3xl font-serif text-center mb-2 mt-4">Terima Kasih!</h1>
      <p className="text-center text-gray-600 mb-6">Kenangan anda telah disimpan.</p>
      
      <div className="w-full max-w-sm mb-8 bg-white p-4 rounded-xl shadow-md">
        <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img src={finalImageUrl} alt="Hasil Photobooth" className="w-full h-full object-contain" />
        </div>
      </div>
      
      <div className="w-full max-w-sm flex flex-col gap-3">
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Unduh
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Bagikan
          </button>
        </div>
        
        <button 
          onClick={handleRetake}
          className="w-full bg-white border border-amber-600 text-amber-700 hover:bg-amber-50 font-medium py-3 rounded-lg"
        >
          Ambil Foto Lagi
        </button>
        <button 
          onClick={handleGallery}
          className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 mt-2"
        >
          Kembali ke Galeri
        </button>
      </div>
    </div>
  );
}
