'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/flower-pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "300px auto",
          opacity: 0.2,
        }}
      />
      <div className="relative z-10 w-[94%] max-w-md flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-[24px] border border-white/30 shadow-sm p-6 text-center">
        <h2 className="text-xl mb-4 font-serif text-primary font-semibold">Terjadi kesalahan pada fitur photobooth.</h2>
        <button
          className="rounded-lg bg-primary px-6 py-2 text-white shadow-md transition hover:bg-[#2c3d75]"
          onClick={() => reset()}
        >
          Coba lagi
        </button>
      </div>
    </main>
  );
}
