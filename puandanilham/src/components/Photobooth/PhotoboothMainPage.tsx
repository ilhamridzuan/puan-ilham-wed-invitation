"use client";

import Image from "next/image";
import PhotoboothIntroSection from "./PhotoboothIntroSection";
import PhotoboothMemorySection from "./PhotoboothMemorySection";
import FooterSection from "../sections/FooterSection";
import { ErrorBoundary } from "../ErrorBoundary";

/**
 * PhotoboothMainPage — assembles all photobooth sections in order.
 *
 * Section order:
 *  1. PhotoboothIntroSection  — Title, Puan & Ilham name, date, CTA button
 *  2. PhotoboothMemorySection — Gallery title, subtitle, masonry gallery
 *  3. Footer                  — Thank you text, Puan & Ilham logo
 */
export default function PhotoboothMainPage() {
  return (
    <main
      id="photobooth-main"
      className="relative flex w-full flex-col items-center overflow-x-hidden"
      aria-label="Halaman Utama Kenangan Perkahwinan"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Layer 1 — Flower Pattern tile, fixed, 20% opacity */}
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

      {/* Layer 2 — Flower Decoration Pop GIF, fixed, above pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ opacity: 0.7 }}
      >
        <Image
          src="/assets/flower-decoration-pop.gif"
          alt=""
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>

      {/* Layer 3 — all sections sit above background layers */}
      <div className="relative z-10 flex w-full flex-col items-center">

        {/* 1. Intro */}
        <ErrorBoundary sectionName="PhotoboothIntro">
          <PhotoboothIntroSection />
        </ErrorBoundary>

        {/* 2. Memory Gallery */}
        <ErrorBoundary sectionName="PhotoboothMemory">
          <PhotoboothMemorySection />
        </ErrorBoundary>

        {/* 3. Footer */}
        <ErrorBoundary sectionName="Footer">
          <FooterSection />
        </ErrorBoundary>

      </div>
    </main>
  );
}
