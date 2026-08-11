"use client";

import { useState, useActionState, useEffect } from "react";
import type { Attendance } from "@/lib/types";
import { motion } from "framer-motion";
import { submitRSVP } from "@/lib/actions";

const MAX_GUESTS = 10;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" as const },
  }),
};

export default function RSVPSection() {
  const [formState, formAction, isPending] = useActionState(submitRSVP, { status: "idle", message: "" });

  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (formState.status === "success") {
      setName("");
      setAttendance("hadir");
      setGuestCount(1);
      setMessage("");
    }
  }, [formState.status]);

  return (
    <section
      aria-label="RSVP"
      className="flex w-full flex-col items-center gap-6 px-4 py-12"
      id="rsvp"
    >
      {/* Top Card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={0}
        className="flex w-full max-w-[380px] flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/20 p-6 text-center shadow-sm backdrop-blur-sm"
      >
        <p className="font-serif text-[17px] italic leading-relaxed text-primary">
          Merupakan suatu kebahagiaan bagi kami apabila Bapak / Ibu / Saudara / Saudari berkenan hadir pada hari bahagia kami.
        </p>
      </motion.div>

      {/* Main RSVP Form Card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={0.2}
        className="flex w-full max-w-[380px] flex-col items-center rounded-2xl border border-white/30 bg-white/20 p-6 shadow-sm backdrop-blur-sm"
      >
        <h2 className="font-script text-[42px] leading-none text-primary text-center">
          Konfirmasi Kehadiran
        </h2>
        <p className="mt-3 mb-8 max-w-[280px] text-center font-serif text-[13px] italic leading-relaxed text-primary">
          Kami sangat berterima kasih jika Anda dapat memberikan konfirmasi kehadiran sebelum 2 September 2026
        </p>

        {formState.status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-2xl border border-primary/20 bg-white/50 p-8 text-center"
          >
            <p className="font-script text-4xl leading-tight text-primary">
              Terima Kasih!
            </p>
            <p className="mt-3 font-serif text-sm text-primary">
              Kehadiran dan ucapan Anda telah dicatat. Kami sangat menantikan kehadiran Anda!
            </p>
          </motion.div>
        ) : (
          <form
            action={formAction}
            noValidate
            className="flex w-full flex-col gap-4"
          >
            {/* Nama */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rsvp-name" className="font-serif text-[15px] text-primary">
                Nama
              </label>
              <input
                id="rsvp-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tamu Undangan"
                className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 font-serif text-[15px] text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Konfirmasi Kehadiran */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rsvp-attendance" className="font-serif text-[15px] text-primary">
                Konfirmasi Kehadiran
              </label>
              <div className="relative">
                <select
                  id="rsvp-attendance"
                  name="attendance"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value as Attendance)}
                  className="w-full appearance-none rounded-xl border border-primary/20 bg-white py-3 pl-4 pr-10 font-serif text-[15px] text-gray-800 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="hadir">Saya berniat untuk hadir</option>
                  <option value="tidak_hadir">Maaf, saya tidak dapat hadir</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Jumlah Tamu */}
            {attendance === "hadir" && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rsvp-guest-count" className="font-serif text-[15px] text-primary">
                  Jumlah Tamu
                </label>
                <div className="relative">
                  <select
                    id="rsvp-guest-count"
                    name="guestCount"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full appearance-none rounded-xl border border-primary/20 bg-white py-3 pl-4 pr-10 font-serif text-[15px] text-gray-800 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Ucapan / Doa */}
            <div className="mt-2 flex flex-col gap-1.5">
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tinggalkan sepatah dua kata ucapan & doa untuk kami..."
                rows={4}
                className="w-full resize-none rounded-xl border border-primary/20 bg-white px-4 py-3 font-serif text-[15px] text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            {/* Error message */}
            {formState?.status === "error" && (
              <p role="alert" className="font-serif text-sm text-red-500">
                {formState.message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full rounded-xl bg-[#384d95] px-4 py-3.5 font-serif text-[18px] font-bold italic text-white shadow-sm transition-all hover:bg-[#384d95]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Mengirim..." : "Kirim"}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
