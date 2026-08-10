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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between w-full h-full overflow-hidden bg-white transition-transform duration-700 ease-in-out ${
        isOpen ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
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

      {/* Mobile container to constrain content on desktop */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-[100dvh] max-w-[412px] mx-auto overflow-hidden">
        
        {/* Top Border Container */}
        <motion.div 
          initial={{ y: -50, opacity: 0, scaleY: -1 }}
          animate={{ y: 0, opacity: 1, scaleY: -1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full aspect-[412/286] pointer-events-none z-10"
        >
          <div className="absolute top-0 left-0 w-[84.22%] h-full">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Top Left Border"
              fill
              className="object-contain object-left-top"
            />
          </div>
          <div className="absolute top-0 left-[15.78%] w-[84.22%] h-full scale-x-[-1]">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Top Right Border"
              fill
              className="object-contain object-left-top"
            />
          </div>
        </motion.div>

        {/* Bottom Border Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-full aspect-[412/286] pointer-events-none z-10"
        >
          <div className="absolute top-0 left-0 w-[84.22%] h-full">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Bottom Left Border"
              fill
              className="object-contain object-left-top"
            />
          </div>
          <div className="absolute top-0 left-[15.78%] w-[84.22%] h-full scale-x-[-1]">
            <Image
              src="/assets/Border Floral 1.svg"
              alt="Bottom Right Border"
              fill
              className="object-contain object-left-top"
            />
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col items-center justify-end w-full px-4 z-20 pointer-events-none">
          
          {/* Title */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: -20 }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="absolute top-[24%] left-1/2 w-[83%] max-w-[342px] flex justify-center z-20"
          >
            <div 
              className="w-full aspect-[342/80] bg-primary"
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
            className="w-full flex justify-center relative"
          >
            <Image
              src="/assets/Ilustrasi no bg.png"
              alt="Couple Illustration"
              width={531}
              height={738}
              className="w-[128%] min-w-[128%] max-w-[600px] h-auto object-contain object-bottom"
              priority
            />
          </motion.div>
        </div>

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
