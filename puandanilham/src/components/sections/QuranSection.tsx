"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function QuranSection() {
  return (
    <section
      aria-label="Ayat Al-Quran — Ar-Rum 30:21"
      className="relative w-full overflow-hidden flex justify-center py-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        /* 
         * Robust flex centering for bleeding elements: 
         * flex-none prevents squishing, w-[136%] scales on mobile, 
         * and justify-center on parent handles the symmetrical overflow.
         */
        className="flex-none w-[136%] max-w-[561px]"
      >
        <Image
          src="/assets/Ayat Qur'an with border & bg.svg"
          alt="Ayat Al-Quran Ar-Rum 30:21 — Dan antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan daripada jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan antara kamu rasa kasih dan sayang."
          width={561}
          height={664}
          className="h-auto w-full"
        />
      </motion.div>
    </section>
  );
}
