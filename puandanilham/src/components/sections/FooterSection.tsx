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

export default function FooterSection() {
  return (
    <footer aria-label="Footer" className="flex w-full flex-col bg-white">
      {/* Top Thank You Section */}
      <div className="flex w-full flex-col items-center px-4 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="w-full max-w-[380px] text-center"
        >
          <p className="font-serif text-[20px] italic leading-relaxed text-primary">
            Terimakasih kami ucapkan
            <br />
            atas segala ucapan, doa, dan
            <br />
            perhatian yang diberikan.
          </p>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="flex w-full justify-center px-4">
        <div className="h-[1px] w-full max-w-[346px] bg-primary/20" />
      </div>

      {/* Bottom Footer Section */}
      <div className="relative flex w-full flex-col items-center py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/assets/Flower Pattern.png"
            alt="Flower Pattern"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={0.2}
          className="relative z-10 flex w-full max-w-[380px] flex-col items-center gap-6 text-center"
        >
          <p className="font-serif text-[20px] font-bold text-primary">
            Designed with love by :
          </p>

          <div className="w-full max-w-[177px]">
            <Image
              src="/assets/Puan&Ilham.svg"
              alt="Puan & Ilham"
              width={177}
              height={120}
              className="h-auto w-full"
            />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
