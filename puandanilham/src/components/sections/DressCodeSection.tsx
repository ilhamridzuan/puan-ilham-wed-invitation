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

export default function DressCodeSection() {
  return (
    <section
      aria-label="Aturan Berpakaian"
      className="flex w-full flex-col items-center px-4 py-12"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={0}
        className="flex w-full max-w-[380px] flex-col items-center gap-12 rounded-2xl border border-white/30 bg-white/20 p-10 text-center shadow-sm backdrop-blur-sm"
      >
        {/* Title */}
        <h2 className="font-script text-6xl leading-[0.9] text-primary">
          Aturan
          <br />
          Berpakaian
        </h2>

        {/* Illustration */}
        <div className="w-full max-w-[240px]">
          <Image
            src="/assets/dress-code-illustration.svg"
            alt="Ilustrasi Aturan Berpakaian — Pakaian Kurung Melayu"
            width={240}
            height={397}
            className="h-auto w-full"
          />
        </div>

        {/* Subtitle */}
        <p className="font-serif text-[24px] italic leading-tight text-primary">
          Pakaian Kurung Melayu
          <br />/ Sopan dan Bersesuaian
        </p>
      </motion.div>
    </section>
  );
}
