"use client";

import Image from "next/image";
import { lazy, Suspense } from "react";

// Eagerly import the first visible section; lazy-load the rest for performance
import IntroSection from "./sections/IntroSection";
import FloatingNav from "./FloatingNav";

const QuranSection = lazy(() => import("./sections/QuranSection"));
const InvitationSection = lazy(() => import("./sections/InvitationSection"));
const DateLocationSection = lazy(() => import("./sections/DateLocationSection"));
const ScheduleSection = lazy(() => import("./sections/ScheduleSection"));
const DressCodeSection = lazy(() => import("./sections/DressCodeSection"));
const RSVPSection = lazy(() => import("./sections/RSVPSection"));
const WishesSection = lazy(() => import("./sections/WishesSection"));
const FooterSection = lazy(() => import("./sections/FooterSection"));

function SectionLoader() {
  return (
    <div className="flex w-full items-center justify-center py-20">
      <span
        className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-label="Memuatkan..."
      />
    </div>
  );
}

/**
 * MainPage — assembles all wedding invitation sections in order.
 * Sections are rendered in the exact order specified by the Figma design (node 156:1831).
 *
 * Section order:
 *  1. IntroSection       — Hero: "MAJELIS Perkahwinan", names, date
 *  2. QuranSection       — Ayat Al-Quran SVG asset
 *  3. InvitationSection  — Kalimat Jemputan SVG asset
 *  4. DateLocationSection — September 4th calendar, address, Maps/Waze
 *  5. ScheduleSection    — Atur Cara Fix SVG asset
 *  6. DressCodeSection   — Aturan Berpakaian title + illustration
 *  7. RSVPSection        — RSVP form → Supabase `rsvps`
 *  8. WishesSection      — Ucapan form + realtime list → Supabase `wishes`
 *  9. FooterSection      — Logo, date, credit
 */
export default function MainPage() {
  return (
    <main
      id="main-content"
      className="relative flex w-full flex-col items-center overflow-x-hidden"
      aria-label="Halaman Utama Undangan Perkahwinan Puan & Ilham"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Layer 1 — Flower Pattern tile, fixed, 20% opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/Flower Pattern.png')",
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
          src="/assets/Flower Decoration Pop.gif"
          alt=""
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>

      {/* Layer 3 — all sections sit above both background layers */}
      <div className="relative z-10 flex w-full flex-col items-center">

      {/* 1. Intro */}
      <IntroSection />

      {/* 2. Quran Verse */}
      <Suspense fallback={<SectionLoader />}>
        <QuranSection />
      </Suspense>

      {/* Subtle section divider */}
      <div className="w-16 border-t border-primary/20 my-4" aria-hidden="true" />

      {/* 3. Invitation Message */}
      <Suspense fallback={<SectionLoader />}>
        <InvitationSection />
      </Suspense>

      <div className="w-16 border-t border-primary/20 my-4" aria-hidden="true" />

      {/* 4. Date & Location */}
      <Suspense fallback={<SectionLoader />}>
        <DateLocationSection />
      </Suspense>

      <div className="w-16 border-t border-primary/20 my-4" aria-hidden="true" />

      {/* 5. Event Schedule */}
      <Suspense fallback={<SectionLoader />}>
        <ScheduleSection />
      </Suspense>

      <div className="w-16 border-t border-primary/20 my-4" aria-hidden="true" />

      {/* 6. Dress Code */}
      <Suspense fallback={<SectionLoader />}>
        <DressCodeSection />
      </Suspense>

      <div className="w-16 border-t border-primary/20 my-4" aria-hidden="true" />

      {/* 7. RSVP */}
      <Suspense fallback={<SectionLoader />}>
        <RSVPSection />
      </Suspense>

      <div className="w-16 border-t border-primary/20 my-4" aria-hidden="true" />

      {/* 8. Wishes */}
      <Suspense fallback={<SectionLoader />}>
        <WishesSection />
      </Suspense>

      {/* 9. Footer */}
      <Suspense fallback={null}>
        <FooterSection />
      </Suspense>

      <FloatingNav />
      </div>{/* end z-10 wrapper */}
    </main>
  );
}
