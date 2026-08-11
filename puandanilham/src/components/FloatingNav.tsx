"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ArrowUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="6" y2="6"/>
      <line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function RSVPIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  );
}

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down a bit past the cover
      if (window.scrollY > 300) {
        setShowNav(true);
      } else {
        setShowNav(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navItems = [
    { label: "Atur Cara", icon: <ScheduleIcon />, onClick: () => scrollToSection("atur-cara") },
    { label: "Lokasi", icon: <MapPinIcon />, onClick: () => scrollToSection("lokasi") },
    { label: "RSVP", icon: <RSVPIcon />, onClick: () => scrollToSection("rsvp") },
    { label: "Ucapan", icon: <MessageIcon />, onClick: () => scrollToSection("ucapan") },
  ];

  return (
    <>
      {/* Scroll to Top Button (Bottom Right) */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={scrollToTop}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-[#384D95] shadow-lg border border-white/50 transition-transform active:scale-95 hover:bg-white/50"
              aria-label="Kembali ke atas"
            >
              <ArrowUpIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burger Menu (Top Right) */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3"
          >
            {/* Burger Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-[#384D95] shadow-xl border border-white/50 transition-transform active:scale-95 hover:bg-white/50"
              aria-label="Menu navigasi"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Expanded Navigation Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="flex flex-col items-end gap-3 mt-2 origin-top-right"
                >
                  {navItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.onClick}
                      className="flex items-center gap-3 pr-1"
                    >
                      <span className="bg-white/40 backdrop-blur-md border border-white/50 px-4 py-1.5 rounded-xl text-sm text-[#0E155E] font-medium shadow-md">
                        {item.label}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-[#384D95] shadow-lg border border-white/50 transition-transform active:scale-95">
                        {item.icon}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
