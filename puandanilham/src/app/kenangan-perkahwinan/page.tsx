'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MemoryGallery from '@/components/Photobooth/MemoryGallery';

export default function PhotoboothMainPage() {
  const router = useRouter();
  const [showCover, setShowCover] = useState(true);

  if (showCover) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => setShowCover(false)}>
        {/* Same Cover Style as main invitation */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/Backgroudn.png" 
            alt="Background" 
            fill 
            className="object-cover opacity-30" 
            priority
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="mb-8 w-64 h-24 relative">
            <Image src="/assets/Title Onboarding.svg" alt="Walimatul Urus" fill className="object-contain" />
          </div>
          
          <div className="w-48 h-32 relative mb-6">
            <Image src="/assets/Puan&Ilham.svg" alt="Puan & Ilham" fill className="object-contain" priority />
          </div>
          
          <p className="font-serif text-lg text-amber-900 mb-8 mt-4 tracking-widest">
            04 . 09 . 2026
          </p>
          
          <div className="mt-12 animate-bounce">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Sentuh untuk membuka</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Intro Section */}
      <section className="pt-16 pb-12 px-6 flex flex-col items-center text-center relative">
        <div className="absolute top-0 w-full h-full opacity-10 pointer-events-none z-0">
          <Image src="/assets/Flower Pattern.png" alt="Pattern" fill className="object-cover" />
        </div>
        
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-64 h-24 relative mb-6">
            <Image src="/assets/Title Photobooth.svg" alt="Virtual Photobooth" fill className="object-contain" />
          </div>
          
          <p className="text-gray-700 font-serif text-lg leading-relaxed mb-10 max-w-md">
            Abadikan momen istimewa dan sampaikan doa terbaik anda untuk kami. Pilih bingkai, ambil gambar, dan jadikan kenangan ini abadi.
          </p>
          
          <button 
            onClick={() => router.push('/kenangan-perkahwinan/info')}
            className="px-10 py-4 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg"
          >
            Mulai Photobooth
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 bg-white relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-amber-900">Galeri Kenangan</h2>
          <div className="w-24 h-[1px] bg-amber-300 mx-auto mt-4"></div>
        </div>
        
        <MemoryGallery />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-neutral-900 text-neutral-400 text-center">
        <div className="w-32 h-16 relative mx-auto mb-6 opacity-50">
          <Image src="/assets/Logo Website Jemputan.svg" alt="Logo" fill className="object-contain filter invert" />
        </div>
        <p className="font-serif text-sm">&copy; 2026 Puan & Ilham. All rights reserved.</p>
        <p className="text-xs mt-2 opacity-50">Virtual Photobooth MVP</p>
      </footer>
    </div>
  );
}
