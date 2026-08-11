"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ScheduleSection() {
  return (
    <section id="atur-cara" className="flex w-full flex-col items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-[380px] flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/20 p-8 shadow-sm backdrop-blur-sm"
      >
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="font-script text-[3.5rem] leading-none text-primary">
            Aturcara<br />
            <span className="ml-12 inline-block pt-2">Majelis</span>
          </h2>
        </div>

        {/* Schedule Graphic */}
        <Image
          src="/assets/Atur Cara Fix.svg"
          alt="Atur Cara — Jadual Susunan Acara Perkahwinan"
          width={380}
          height={480}
          className="h-auto w-full"
        />

        {/* Footer Note */}
        <p className="mt-10 text-center font-serif text-[15px] italic leading-relaxed text-primary max-w-[280px]">
          Tamu undangan diharapkan hadir tepat waktu untuk menyaksikan prosesi Ijab &amp; Qabul
        </p>
      </motion.div>
    </section>
  );
}
