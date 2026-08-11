"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Wish } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

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

export default function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);

  // Initial load + real-time subscription
  useEffect(() => {
    const supabase = createClient();

    // Initial fetch — ordered newest first
    supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setWishes(data as Wish[]);
      });

    // Real-time subscription
    const channel = supabase
      .channel("wishes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        (payload) => {
          setWishes((prev) => [payload.new as Wish, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section
      aria-label="Ucapan &amp; Doa"
      className="flex w-full flex-col items-center gap-6 bg-[#FFFFFF] px-4 py-12"
      id="ucapan"
    >
      {/* Top Card (Title) */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={0}
        className="relative flex w-full max-w-[380px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-6 text-center shadow-sm backdrop-blur-sm"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/assets/Flower Pattern.png"
            alt="Flower Pattern"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <h2 className="relative z-10 font-script text-[48px] leading-none text-primary">
          Ucapan &amp; Doa
        </h2>
      </motion.div>

      {/* Divider */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={0.1}
        className="my-2 h-[1px] w-full max-w-[346px] bg-[#384d95]/20"
      />

      {/* Wish List */}
      <div
        className="flex w-full max-w-[380px] flex-col gap-6"
        aria-live="polite"
        aria-label="Senarai ucapan tamu"
      >
        <AnimatePresence initial={false}>
          {wishes.map((wish, i) => (
            <motion.article
              key={wish.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.0, delay: Math.min(i * 0.1, 0.5), ease: [0.22, 1, 0.36, 1] }}
              className="relative flex w-full flex-col items-center overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-3 shadow-sm backdrop-blur-sm"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 z-0 opacity-20">
                <Image
                  src="/assets/Flower Pattern.png"
                  alt="Flower Pattern"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Inner Card */}
              <div className="relative z-10 flex w-full flex-col overflow-hidden rounded-xl border border-primary/40 bg-white">
                {/* Header */}
                <div className="border-b border-primary/20 px-4 py-4">
                  <p className="font-serif text-[18px] text-primary">
                    Dari : <span className="font-bold italic">{wish.name}</span>
                  </p>
                </div>
                {/* Body */}
                <div className="px-4 py-4">
                  <p className="font-serif text-[18px] text-primary whitespace-pre-wrap">
                    {wish.message}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {wishes.length === 0 && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-serif mt-4 text-center text-[15px] italic text-primary/70"
          >
            Belum ada ucapan. Jadilah yang pertama!
          </motion.p>
        )}
      </div>
    </section>
  );
}
