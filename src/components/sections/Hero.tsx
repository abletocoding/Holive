"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const MatrixRain = dynamic(
  () =>
    import("@/components/effects/MatrixRain").then((m) => m.MatrixRain),
  { ssr: false },
);

const HeroScene = dynamic(
  () => import("@/components/effects/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

export function Hero() {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden md:items-center"
    >
      <div className="absolute inset-0 bg-[var(--holive-black)]">
        <MatrixRain />
        <HeroScene />
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-veil)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-20">
        <motion.div
          className="flex items-center gap-4"
          initial={reduce ? false : { opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/brand/logo-mark.svg"
            alt=""
            width={64}
            height={64}
            className="h-14 w-14 drop-shadow-[0_0_24px_rgba(201,168,76,0.35)] md:h-16 md:w-16"
            initial={reduce ? false : { rotate: -18, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.1 }}
          />
          <motion.p
            className="font-display text-[clamp(2.8rem,12vw,7.5rem)] font-semibold leading-[0.9] tracking-[0.08em] text-[var(--holive-white)]"
            style={{ textShadow: "0 0 60px rgba(51,0,114,0.45)" }}
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("brand")}
          </motion.p>
        </motion.div>

        <motion.h1
          className="mt-5 max-w-xl font-display text-[clamp(1.45rem,3.6vw,2.35rem)] font-medium leading-tight text-[var(--holive-gold-bright)]"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.28 }}
        >
          {t("headline")}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-md text-base leading-relaxed text-[color-mix(in_srgb,var(--holive-white)_82%,transparent)] md:text-lg"
          initial={reduce ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.4 }}
        >
          {t("sub")}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.52 }}
        >
          <a
            href="#contact"
            className="focus-ring inline-flex items-center justify-center bg-[var(--holive-gold)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--holive-black)] transition hover:bg-[var(--holive-gold-bright)]"
          >
            {t("ctaPrimary")}
          </a>
          <a
            href="#courses"
            className="focus-ring inline-flex items-center justify-center border border-[color-mix(in_srgb,var(--holive-white)_35%,transparent)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--holive-white)] transition hover:border-[var(--holive-gold)] hover:text-[var(--holive-gold)]"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>

        <motion.p
          className="font-mono-code mt-14 text-[0.65rem] uppercase tracking-[0.35em] text-[color-mix(in_srgb,var(--holive-white)_45%,transparent)]"
          initial={reduce ? false : { opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1 }
              : { opacity: [0.35, 1, 0.35], y: [0, 10, 0] }
          }
          transition={
            reduce
              ? { duration: 0.3 }
              : { duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.9 }
          }
        >
          {t("scrollHint")} ↓
        </motion.p>
      </div>
    </section>
  );
}
