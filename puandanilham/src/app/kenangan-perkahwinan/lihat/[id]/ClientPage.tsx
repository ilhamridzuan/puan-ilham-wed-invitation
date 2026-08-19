"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LihatMomenPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("photobooth_entries")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          throw new Error("Not found");
        }
        setEntry(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEntry();
    }
  }, [id]);

  const handleDownload = async () => {
    if (!entry?.photo_url) return;
    try {
      const response = await fetch(entry.photo_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kenangan-puan-ilham-${entry.sender_name.replace(/\s+/g, "-").toLowerCase()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(entry.photo_url, "_blank");
    }
  };

  const handleShare = async () => {
    if (!entry?.photo_url) return;
    const urlToShare = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kenangan Puan & Ilham",
          text: `Lihat gambar dari Virtual Photobooth Puan & Ilham oleh ${entry.sender_name}`,
          url: urlToShare,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(urlToShare);
        alert("Tautan halaman berhasil disalin!");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  if (loading) {
    return (
      <main className="flex h-[100dvh] w-full items-center justify-center bg-white">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </main>
    );
  }

  if (error || !entry) {
    return (
      <main className="flex h-[100dvh] w-full flex-col items-center justify-center bg-white p-4 text-center">
        <p className="text-primary font-serif mb-4">Momen tidak ditemukan.</p>
        <a href="/kenangan-perkahwinan" className="px-4 py-2 bg-primary text-white rounded-lg transition-colors hover:bg-[#2c3d75]">Kembali ke Galeri</a>
      </main>
    );
  }

  return (
    <main
      className="relative flex w-full h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white"
      aria-label="Halaman Lihat Momen Photobooth"
    >
      {/* Layer 1 — Flower Pattern tile */}
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

      {/* Layer 2 — Flower Decoration Pop GIF */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ opacity: 0.7 }}
      >
        <Image
          src="/assets/flower-decoration-pop.gif"
          alt=""
          fill
          className="object-cover md:object-contain"
          unoptimized
          priority
        />
      </div>

      {/* Main Container - Giant Glass Card */}
      <div className="relative z-10 w-[94%] h-[96%] sm:w-[92%] sm:h-[94%] max-w-md flex flex-col bg-white/20 backdrop-blur-sm rounded-[24px] border border-white/30 shadow-sm p-4 sm:p-5 overflow-hidden">
        
        {/* Top section: Back button */}
        <div className="flex w-full justify-start shrink-0">
          <button
            onClick={() => router.push("/kenangan-perkahwinan")}
            className="flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm hover:bg-white/30 transition-colors"
            aria-label="Kembali"
          >
            <div className="flex items-center justify-center size-7 text-primary">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-full h-full"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Header: Title & Logo */}
        <div className="flex w-full flex-col items-center shrink-0 -mt-2 mb-2 sm:mb-4">
          <div className="relative h-[35px] w-[100px] sm:h-[45px] sm:w-[120px] shrink-0 mb-1">
            <Image 
              src="/assets/title-photobooth.svg" 
              alt="Title Photobooth" 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="relative w-[150px] h-[75px] sm:w-[180px] sm:h-[90px] shrink-0">
            <Image 
              src="/assets/puan-dan-ilham.svg" 
              alt="Puan & Ilham" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* Sender & Message */}
        <div className="w-full shrink-0 flex flex-col items-center text-center mb-2 px-2">
          <p className="font-serif text-lg sm:text-xl text-[#384d95] font-semibold">
            {entry.sender_name}
          </p>
          <p className="font-sans text-sm sm:text-base text-gray-700 italic mt-1 line-clamp-3">
            &quot;{entry.message}&quot;
          </p>
        </div>

        {/* Final Photobooth Display */}
        <div className="flex-1 w-full relative min-h-0 flex flex-col items-center justify-center overflow-hidden mb-6 sm:mb-8 mt-2">
          <div className="relative h-full max-h-[45vh] sm:max-h-[50vh] w-auto max-w-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.photo_url} alt="Hasil Photobooth" className="w-auto h-full max-w-full max-h-full object-contain drop-shadow-xl rounded-md" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full shrink-0 flex flex-col gap-2 sm:gap-3">
          
          <button
            onClick={handleDownload}
            className="flex h-[42px] sm:h-[50px] w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="font-serif text-[15px] sm:text-[18px] italic font-semibold">
              Unduh Momen
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex h-[42px] sm:h-[50px] w-full items-center justify-center gap-2 sm:gap-3 rounded-[12px] bg-white hover:bg-neutral-50 transition-colors shadow-md text-primary"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            <span className="font-serif text-[15px] sm:text-[18px] italic font-semibold">
              Bagikan Momen
            </span>
          </button>

        </div>

      </div>
    </main>
  );
}
