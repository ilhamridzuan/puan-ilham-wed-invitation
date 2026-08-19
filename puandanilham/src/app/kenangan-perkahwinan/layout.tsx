import { PhotoboothProvider } from './PhotoboothContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kenangan Perkahwinan | Puan & Ilham',
  description: 'Bagikan kenangan indah Anda bersama Puan & Ilham! Ambil foto, pilih bingkai, dan bagikan di galeri kenangan digital.',
  openGraph: {
    title: 'Kenangan Perkahwinan Puan & Ilham — Virtual Photobooth',
    description: 'Ambil foto kenangan bersama Puan & Ilham!',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function PhotoboothLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhotoboothProvider>
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
      </div>
    </PhotoboothProvider>
  );
}
