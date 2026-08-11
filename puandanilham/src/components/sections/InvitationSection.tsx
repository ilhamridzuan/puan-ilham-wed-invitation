"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function InvitationSection() {
  return (
    <section
      aria-label="Pesan Undangan"
      className="relative flex w-full justify-center overflow-hidden py-16"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Texture Background Overlay at 70% Opacity */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/Texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
        /* Dibesarkan dengan menggunakan w-[115%] supaya sedikit bleed dan flex-none */
        className="relative z-10 w-[115%] max-w-[460px] flex-none"
      >
        <Image
          src="/assets/Kalimat Jemputan Fix.svg"
          alt="Kalimat Jemputan — Pesan Undangan Pernikahan Puan & Ilham"
          width={460}
          height={680}
          className="h-auto w-full"
        />
      </motion.div>
    </section>
  );
}
