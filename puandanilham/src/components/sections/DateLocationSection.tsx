"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 2.0, 
      delay, 
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function DateLocationSection() {
  const googleMapsUrl = "https://maps.app.goo.gl/wWX8iS3PMZmRUa8u8?g_st=iw";

  return (
    <section
      id="lokasi"
      aria-label="Tarikh & Lokasi"
      className="flex w-full flex-col items-center gap-10 px-4 py-12"
    >
      {/* Top Section: Date & Calendar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={0}
        className="flex w-full max-w-[380px] justify-center rounded-2xl border border-white/30 bg-white/20 p-6 shadow-sm backdrop-blur-sm"
      >
        <Image
          src="/assets/September 4th Calendar.svg"
          alt="4 September Calendar"
          width={270}
          height={327}
          className="h-auto w-full max-w-[270px]"
        />
      </motion.div>

      {/* Bottom Section: Location */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={0.2}
        className="flex w-full max-w-[380px] flex-col items-center gap-6 rounded-2xl border border-white/30 bg-white/20 p-8 text-center shadow-sm backdrop-blur-sm"
      >
        <h2 className="font-script text-5xl text-primary">Lokasi Majelis</h2>
        
        <Image
          src="/assets/Location Ilustration.svg"
          alt="Lokasi Ilustration"
          width={100}
          height={100}
          className="h-auto w-[100px]"
        />

        <p className="max-w-[319px] font-serif text-2xl italic leading-tight text-primary">
          Sam’s Anna Seafood Restaurant,
          <br />
          Kota Tanjungpinang
        </p>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="google-maps-link"
          className="mt-2 rounded-full bg-primary px-9 py-3 font-serif text-2xl text-white shadow-md transition-all hover:bg-primary/90 active:scale-95"
        >
          Google Maps
        </a>
      </motion.div>
    </section>
  );
}
