"use client";

import { useState } from "react";
import PhotoboothCoverPage from "@/components/Photobooth/PhotoboothCoverPage";
import PhotoboothMainPage from "@/components/Photobooth/PhotoboothMainPage";

export default function PhotoboothPage() {
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  return (
    <>
      {/* Cover Page — fixed overlay, slides away when dismissed */}
      {!isCoverOpen && (
        <PhotoboothCoverPage onOpen={() => setIsCoverOpen(true)} />
      )}

      {/* Main Photobooth Content — fades in after CoverPage is dismissed */}
      <div
        className={`w-full transition-opacity duration-1000 ${
          isCoverOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isCoverOpen}
      >
        <PhotoboothMainPage />
      </div>
    </>
  );
}
