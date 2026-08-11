"use client";

import { useState } from "react";
import CoverPage from "@/components/CoverPage";
import MainPage from "@/components/MainPage";

export default function Home() {
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  return (
    <>
      {/* Cover Page — fixed overlay, slides away when dismissed */}
      {!isCoverOpen && (
        <CoverPage onOpen={() => setIsCoverOpen(true)} />
      )}

      {/* Main Invitation Content — fades in after CoverPage is dismissed */}
      <div
        className={`w-full transition-opacity duration-1000 ${
          isCoverOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isCoverOpen}
      >
        <MainPage />
      </div>
    </>
  );
}
