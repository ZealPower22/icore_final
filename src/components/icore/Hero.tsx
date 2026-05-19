import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Particles } from "./Particles";
import { Ornament } from "./Ornament";

const stats = [
  { num: "500+", label: "Implant Placements" },
  { num: "35", label: "Full-Mouth Rehabilitations" },
  { num: "7", label: "Days of Raw Science" },
  { num: "12+", label: "Elite Mentors" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen w-full overflow-hidden bg-[var(--burgundy-deep)]">
      {/* Parallax palace */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src="/images/hero-palace.jpg"
          alt="Hawa Mahal palace, Jaipur"
          width={1920}
          height={1280}
          className="h-full w-full object-cover ken-burns opacity-90 filter contrast-[1.08] saturate-[1.1] brightness-[0.95]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--burgundy-deep)]/65 via-[var(--burgundy)]/35 to-[var(--burgundy-deep)]" />
        <div className="absolute inset-0 gradient-hero" />
      </motion.div>

      <Particles count={40} />

      {/* Ornate jali pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div style={{ opacity }} className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="text-xl font-bold tracking-[0.4em] text-[var(--gold)] font-display uppercase">
            Cortico Core
          </div>
          <Ornament />
          <div className="text-xs tracking-[0.4em] text-[var(--ivory)]/70 uppercase">
            ✦ The Pink City · Jaipur · Rajasthan · India ✦
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5 }}
          className="mt-10 font-display text-[18vw] sm:text-[14vw] md:text-[10rem] lg:text-[14rem] leading-[0.9] text-[var(--ivory)] tracking-[0.05em]"
        >
          I.C.O.R.E
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="font-display text-5xl md:text-7xl gradient-gold-text tracking-[0.3em] -mt-4"
        >
          2026
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10 max-w-2xl space-y-3"
        >
          <p className="font-serif italic text-2xl md:text-3xl text-[var(--ivory)]/90">
            One Biology. One Mission.
          </p>
          <p className="font-serif italic text-xl md:text-2xl text-[var(--gold-soft)]">
            Immediate Function for Every Smile.
          </p>
        </motion.div>

        {/* Date / Location strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.3em] text-[var(--ivory)]/80"
        >
          <span className="text-[var(--gold)]">◆</span>
          <span>21–27 November 2026</span>
          <span className="text-[var(--gold)]">◆</span>
          <span>SIAM Institute</span>
          <span className="text-[var(--gold)]">◆</span>
          <span>09:00 — 18:00</span>
          <span className="text-[var(--gold)]">◆</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px max-w-5xl w-full glass ornament-frame"
        >
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center bg-[var(--burgundy-deep)]/40 hover:bg-[var(--burgundy)]/40 transition-colors">
              <div className="font-display text-4xl md:text-5xl gradient-gold-text">{s.num}</div>
              <div className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--ivory)]/70">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#pricing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
          whileHover={{ scale: 1.02 }}
          className="mt-12 group inline-flex items-center gap-3 px-10 py-5 bg-[var(--gold)] text-[var(--burgundy-deep)] uppercase tracking-[0.3em] text-xs font-medium shadow-gold hover:shadow-luxe transition-all"
        >
          Register Now
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </motion.a>

        <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.4em] text-[var(--ivory)]/50">
          CPD/CME Certificate · Indexed Research Pathway · World-Record Attempt
        </p>
      </motion.div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--gold)]/20 bg-[var(--burgundy-deep)]/60 backdrop-blur py-3 overflow-hidden z-10">
        <div className="marquee-track text-xs tracking-[0.4em] uppercase text-[var(--gold)]/80">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 gap-10 px-10">
              {["I.C.O.R.E 2026", "Jaipur · Pink City", "21–27 November", "500+ Implant Placements", "35 Full-Mouth Rehabilitations", "Live Surgery", "CME / CPD", "Indexed Research"].map((t) => (
                <span key={t} className="flex items-center gap-10">
                  <span className="text-[var(--gold)]">✦</span>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}