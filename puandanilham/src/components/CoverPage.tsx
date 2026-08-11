"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CoverPage({ onOpen }: { onOpen: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 500); // Wait for transition
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between w-full h-full overflow-hidden bg-white transition-transform duration-700 ease-in-out ${isOpen ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      onClick={handleOpen}
    >
      {/* Background Image - Full screen */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Backgroudn.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Full-width container for borders to follow screen edges up to a limit */}
      <div className="fixed inset-0 w-full h-[100dvh] max-w-5xl mx-auto pointer-events-none z-10 overflow-hidden">
        {/* Top Border Container */}
        <motion.div 
          initial={{ y: -50, opacity: 0, scaleY: -1 }}
          animate={{ y: 0, opacity: 1, scaleY: -1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-[25dvh] min-h-[120px] max-h-[286px] flex justify-between"
        >
          <div className="relative w-[70%] max-w-[347px] h-full">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Top Left Border"
              fill
              className="object-contain object-left-bottom"
            />
          </div>
          <div className="relative w-[70%] max-w-[347px] h-full scale-x-[-1]">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Top Right Border"
              fill
              className="object-contain object-left-bottom"
            />
          </div>
        </motion.div>

        {/* Bottom Border Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-full h-[25dvh] min-h-[120px] max-h-[286px] flex justify-between"
        >
          <div className="relative w-[70%] max-w-[347px] h-full">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Bottom Left Border"
              fill
              className="object-contain object-left-bottom"
            />
          </div>
          <div className="relative w-[70%] max-w-[347px] h-full scale-x-[-1]">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Bottom Right Border"
              fill
              className="object-contain object-left-bottom"
            />
          </div>
        </motion.div>
      </div>

      {/* Main Content Area - Constrained to mobile proportions */}
      <div className="relative z-20 flex flex-col items-center justify-end w-full h-[100dvh] max-w-[412px] mx-auto px-4 pointer-events-none">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: "-50%", y: -20 }}
          animate={{ opacity: 1, scale: 1, x: "-50%", y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="absolute top-[14%] left-1/2 w-[83%] max-w-[342px] flex justify-center z-20"
        >
          <div 
            className="w-full aspect-[342/80] bg-[#384D95]"
            style={{
              maskImage: 'url("/assets/Title Onboarding.svg")',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: 'url("/assets/Title Onboarding.svg")',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
            }}
            aria-label="Jemputan Kasih & Doa Restu"
          />
        </motion.div>

        {/* Illustration */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pt-[10dvh] z-10 pointer-events-none"
        >
          <Image
            src="/assets/Ilustrasi with border.svg"
            alt="Couple Illustration"
            width={864}
            height={1022}
            className="w-[145%] max-w-[650px] max-h-[65dvh] h-auto object-contain object-center"
            priority
          />
        </motion.div>

        {/* Call to Action Text overlaying the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="absolute bottom-[8%] z-30 text-center w-full pointer-events-auto cursor-pointer px-4"
        >
          <div className="animate-pulse">
            <p className="font-serif italic text-primary text-xl font-semibold bg-white/60 px-5 py-1.5 rounded-full inline-block backdrop-blur-sm shadow-sm">
              Tekan dimanapun untuk lanjut
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
