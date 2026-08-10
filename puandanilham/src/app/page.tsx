"use client";

import { useState } from "react";
import CoverPage from "@/components/CoverPage";

export default function Home() {
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  return (
    <main className="min-h-screen w-full relative">
      {!isCoverOpen && (
        <CoverPage onOpen={() => setIsCoverOpen(true)} />
      )}
      
      {/* Main Invitation Content (Displayed after Cover Page) */}
      <div 
        className={`w-full min-h-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
          isCoverOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-3xl text-primary font-script mb-4">Undangan Pernikahan</h1>
        <p className="text-lg">Konten utama akan dimuat di sini.</p>
      </div>
    </main>
  );
}
