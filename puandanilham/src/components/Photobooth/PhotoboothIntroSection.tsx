"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PhotoboothIntroSection() {
  const router = useRouter();

  return (
    <section
      className="relative z-10 pt-20 pb-10 px-4 flex flex-col items-center text-center w-full max-w-md mx-auto"
      aria-label="Intro Photobooth"
    >
      {/* Title */}
      <div className="w-56 h-20 relative mb-4">
        <Image
          src="/assets/Title Photobooth.svg"
          alt="Kenangan Perkahwinan"
          fill
          className="object-contain"
        />
      </div>

      {/* Puan & Ilham name */}
      <div className="w-[576px] max-w-[140%] h-[288px] relative mb-8">
        <Image
          src="/assets/Puan&Ilham.svg"
          alt="Puan & Ilham"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Date */}
      <p className="font-serif text-[15px] text-[#384D95] mb-10 tracking-[0.3em]">
        04 . 09 . 2026
      </p>

      {/* Glass card — CTA box */}
      <div className="flex flex-col gap-3 items-center justify-center px-4 py-8 relative rounded-2xl w-full bg-white/20 backdrop-blur-sm shadow-sm border border-white/30">
        <div className="w-full flex flex-col items-center">
          <p className="font-serif italic text-[20px] text-[#384D95] text-center leading-[1.2]">
            Mari rayakan hari ini<br />melalui sudut pandangmu!
          </p>
        </div>

        <div className="w-full max-w-[346px] h-[1px] bg-[#384D95]/30 my-2" />

        <button
          onClick={() => router.push("/kenangan-perkahwinan/info")}
          className="w-full max-w-[350px] h-[50px] bg-[#384D95] hover:bg-[#2c3d75] text-white font-serif italic font-bold rounded-[12px] shadow-sm transition-all transform hover:-translate-y-0.5 text-[20px] flex items-center justify-center"
        >
          Tambahkan Kenangan
        </button>

        <div className="flex flex-col items-center mt-2">
          <p className="font-serif text-[14px] text-[#384D95] text-center underline underline-offset-4 cursor-pointer hover:text-[#2c3d75]">
            Scroll ke bawah untuk melihat kenangan
          </p>
        </div>
      </div>
    </section>
  );
}
