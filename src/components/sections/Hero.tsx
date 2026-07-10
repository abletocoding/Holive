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
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mark.svg"
            alt=""
            width={64}
            height={64}
            className="h-14 w-14 drop-shadow-[0_0_24px_rgba(201,168,76,0.35)] md:h-16 md:w-16"
          />
          <p
            className="font-display text-[clamp(2.8rem,12vw,7.5rem)] font-semibold leading-[0.9] tracking-[0.08em] text-[var(--holive-white)]"
            style={{ textShadow: "0 0 60px rgba(51,0,114,0.45)" }}
          >
            {t("brand")}
          </p>
        </motion.div>

        <motion.h1
          className="mt-5 max-w-xl font-display text-[clamp(1.45rem,3.6vw,2.35rem)] font-medium leading-tight text-[var(--holive-gold-bright)]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("headline")}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-md text-base leading-relaxed text-[color-mix(in_srgb,var(--holive-white)_82%,transparent)] md:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
        >
          {t("sub")}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.4 }}
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

        <p className="font-mono-code mt-14 text-[0.65rem] uppercase tracking-[0.35em] text-[color-mix(in_srgb,var(--holive-white)_45%,transparent)]">
          {t("scrollHint")} ↓
        </p>
      </div>
    </section>
  );
}
