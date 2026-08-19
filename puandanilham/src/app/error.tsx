'use client';

import { useEffect } from 'react';

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
    <main className="flex h-[100dvh] w-full flex-col items-center justify-center bg-[#f5e6d3] p-4 text-center font-serif text-[#384d95]">
      <h2 className="text-2xl mb-4 font-semibold">Terjadi kesalahan.</h2>
      <button
        className="rounded-lg bg-[#384d95] px-6 py-2 text-white shadow-md transition hover:bg-[#2c3d75]"
        onClick={() => reset()}
      >
        Coba lagi
      </button>
    </main>
  );
}
