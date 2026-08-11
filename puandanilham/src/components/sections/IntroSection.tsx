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

export default function IntroSection() {
  return (
    <section
      aria-label="Intro"
      className="relative w-full"
      style={{ minHeight: "100svh" }}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-24 text-center"
           style={{ minHeight: "100svh" }}>

        {/* Eyebrow text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="mb-8"
        >
          <p className="font-serif text-[20px] uppercase tracking-[0.1em] text-primary">
            MAJELIS
          </p>
          <p className="font-script text-[42px] leading-none text-primary">
            Perkahwinan
          </p>
        </motion.div>

        {/* Names */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.15}
          className="my-6"
        >
          <div
            className="relative w-full"
            style={{ maxWidth: "360px" }}
          >
            <Image
              src="/assets/Puan&Ilham.svg"
              alt="Puan & Ilham"
              width={360}
              height={245}
              className="h-auto w-full"
              priority
            />
          </div>
        </motion.div>

        {/* Date */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.3}
          className="mt-6 font-serif text-[32px] italic text-primary"
        >
          04 . 09 . 2026
        </motion.p>
      </div>
    </section>
  );
}
