'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePhotobooth } from '../PhotoboothContext';
import { mergePhotoAndFrame } from '@/lib/canvasUtils';
import { createClient } from '@/lib/supabase/client';
import { getFrameConfig } from '@/lib/frameConfigs';

export default function PesanPage() {
  const router = useRouter();
  const { senderName, frameId, photos, setFinalImageUrl } = usePhotobooth();
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const frameConfig = getFrameConfig(frameId || '1');

  // Generate Preview on Mount
  useEffect(() => {
    if (!photos || photos.length === 0 || !frameId) {
      router.replace('/kenangan-perkahwinan');
      return;
    }

    const generatePreview = async () => {
      try {
        const frameUrl = frameId === '1' 
          ? '/assets/Strip Photobooth 1 Photo.svg'
          : frameId === '2' 
            ? '/assets/Strip Photobooth 2 Photo.svg'
            : '/assets/Strip Photobooth 4 Photo.svg';

        const blob = await mergePhotoAndFrame(photos, frameUrl, frameConfig, 1200);
        setMergedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error('Failed to merge photo:', err);
        setError('Gagal memproses gambar.');
      }
    };

    generatePreview();
  }, [photos, frameId, frameConfig, router]);

  const handleSubmit = async () => {
    if (!mergedBlob) return;
    if (message.trim().length === 0) {
      setError('Sila isi mesej untuk pengantin.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const supabase = createClient();
      
      // 1. Upload to Storage
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photobooth')
        .upload(fileName, mergedBlob, {
          contentType: 'image/webp',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('photobooth')
        .getPublicUrl(fileName);
        
      const publicUrl = publicUrlData.publicUrl;
      
      // 2. Insert into Database
      const { error: dbError } = await supabase
        .from('photobooth_entries')
        .insert({
          sender_name: senderName,
          message: message.trim(),
          photo_url: publicUrl,
          frame_id: frameId
        });
        
      if (dbError) throw dbError;
      
      // 3. Update Context & Route
      setFinalImageUrl(publicUrl);
      router.push('/kenangan-perkahwinan/hasil');
      
    } catch (err) {
      console.error('Submit error:', err);
      setError('Terjadi kesalahan saat mengirim data. Sila cuba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 pb-24 bg-neutral-50">
      <h1 className="text-3xl font-serif text-center mb-6 mt-4">Pratonton & Mesej</h1>
      
      {/* Preview Container */}
      <div className="w-full max-w-sm mb-6 bg-white p-4 rounded-xl shadow-sm">
        {previewUrl ? (
          <div 
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner mx-auto"
            style={{ aspectRatio: `${frameConfig.widthInch} / ${frameConfig.heightInch}` }}
          >
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div 
            className="w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-500 mx-auto"
            style={{ aspectRatio: `${frameConfig.widthInch} / ${frameConfig.heightInch}` }}
          >
            Memproses...
          </div>
        )}
      </div>
      
      {/* Message Form */}
      <div className="w-full max-w-sm bg-white p-5 rounded-xl shadow-sm">
        <label className="block text-sm font-medium mb-2" htmlFor="message">Titipan Doa / Mesej (Maks 200 karakter)</label>
        <textarea 
          id="message"
          rows={3}
          maxLength={200}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError('');
          }}
          placeholder="Tulis ucapan anda di sini..."
          className="w-full border border-gray-300 rounded-lg p-3 mb-1 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-sm"
        />
        <div className="text-right text-xs text-gray-500 mb-2">
          {message.length}/200
        </div>
        
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      </div>
      
      {/* Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between max-w-md mx-auto right-0 z-10 gap-4">
         <button 
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50"
        >
          Kembali
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!mergedBlob || isSubmitting}
          className="flex-1 py-3 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex justify-center items-center"
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Hantar'}
        </button>
      </div>
    </div>
  );
}
