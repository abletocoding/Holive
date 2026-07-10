"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { TextScramble } from "@/components/effects/TextScramble";
import { LogoMorph } from "@/components/effects/LogoMorph";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

const MatrixRain = dynamic(
  () =>
    import("@/components/effects/MatrixRain").then((m) => m.MatrixRain),
  { ssr: false },
);

const HeroScene = dynamic(
  () => import("@/components/effects/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

const TouchAurora = dynamic(
  () => import("@/components/effects/TouchAurora").then((m) => m.TouchAurora),
  { ssr: false },
);

export function Hero() {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();
  const coarse = useIsCoarsePointer();

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-end overflow-hidden md:items-center"
      style={{
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="absolute inset-0 bg-[var(--holive-black)]">
        {coarse ? <TouchAurora /> : <MatrixRain />}
        {!coarse && <HeroScene />}
        {coarse && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35"
          >
            <div className="h-[42vw] max-h-56 w-[42vw] max-w-56 rounded-full border border-[var(--holive-gold)]/40 shadow-[var(--glow-gold)]" />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-veil)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-5 pb-16 pt-[max(6.5rem,calc(env(safe-area-inset-top)+5rem))] md:px-8 md:pb-24 md:pt-20">
        <motion.div
          className="flex items-center gap-3 sm:gap-4"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <LogoMorph
            size={56}
            className="h-12 w-12 drop-shadow-[0_0_24px_rgba(201,168,76,0.35)] sm:h-14 sm:w-14 md:h-16 md:w-16"
          />
          <p
            className="font-display text-[clamp(2.6rem,11vw,7.5rem)] font-semibold leading-[0.9] tracking-[0.08em] text-[var(--holive-white)]"
            style={{ textShadow: "0 0 60px rgba(51,0,114,0.45)" }}
          >
            {t("brand")}
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <TextScramble
            as="h1"
            text={t("headline")}
            className="mt-5 max-w-xl font-display text-[clamp(1.35rem,3.8vw,2.35rem)] font-medium leading-tight text-[var(--holive-gold-bright)]"
          />
        </motion.div>

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
          <MagneticButton>
            <Link
              href="/contact"
              className="focus-ring inline-flex min-h-12 items-center justify-center bg-[var(--holive-gold)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--holive-black)] transition hover:bg-[var(--holive-gold-bright)]"
            >
              {t("ctaPrimary")}
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.22}>
            <Link
              href="/courses"
              className="focus-ring inline-flex min-h-12 items-center justify-center border border-[color-mix(in_srgb,var(--holive-white)_35%,transparent)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--holive-white)] transition hover:border-[var(--holive-gold)] hover:text-[var(--holive-gold)]"
            >
              {t("ctaSecondary")}
            </Link>
          </MagneticButton>
        </motion.div>

        <p className="font-mono-code mt-12 text-[0.65rem] uppercase tracking-[0.35em] text-[color-mix(in_srgb,var(--holive-white)_45%,transparent)] md:mt-14">
          {t("scrollHint")} ↓
        </p>
      </div>
    </section>
  );
}
