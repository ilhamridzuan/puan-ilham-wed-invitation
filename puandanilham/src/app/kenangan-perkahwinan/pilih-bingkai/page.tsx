'use client';

import { useRouter } from 'next/navigation';
import { usePhotobooth } from '../PhotoboothContext';
import Image from 'next/image';

const FRAMES = [
  { id: '1', src: '/assets/Strip Photobooth 1 Photo.svg', name: 'Frame 1 Photo' },
  { id: '2', src: '/assets/Strip Photobooth 2 Photo.svg', name: 'Frame 2 Photo' },
  { id: '4', src: '/assets/Strip Photobooth 4 Photo.svg', name: 'Frame 4 Photo' },
];

export default function PilihBingkaiPage() {
  const router = useRouter();
  const { frameId, setFrameId } = usePhotobooth();

  const handleNext = () => {
    if (!frameId) return;
    router.push('/kenangan-perkahwinan/metode-foto');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pb-24">
      <h1 className="text-3xl font-serif text-center mb-2">Pilih Bingkai</h1>
      <p className="text-center text-gray-600 mb-8">Pilih bingkai kenangan favorit anda.</p>
      
      <div className="flex flex-wrap justify-center gap-6 mb-8 w-full max-w-4xl">
        {FRAMES.map((frame) => (
          <div 
            key={frame.id}
            onClick={() => setFrameId(frame.id)}
            className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-300 relative ${
              frameId === frame.id ? 'border-amber-600 shadow-xl scale-105' : 'border-transparent shadow hover:shadow-lg hover:scale-105'
            }`}
          >
            <div className="w-48 h-60 relative bg-gray-100">
              <Image src={frame.src} alt={frame.name} fill className="object-contain" />
            </div>
            <div className="text-center py-2 bg-white text-sm font-medium">{frame.name}</div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between max-w-md mx-auto right-0 z-10">
         <button 
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
        >
          Kembali
        </button>
        <button 
          onClick={handleNext}
          disabled={!frameId}
          className="px-8 py-3 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
