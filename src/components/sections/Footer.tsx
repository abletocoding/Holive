"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { FloatAccent } from "@/components/ui/SectionReveal";
import {
  HoliDoodleMotif,
  SketchDivider,
} from "@/components/ui/Doodle";

const HoliGame = dynamic(
  () => import("@/components/holi/HoliGame").then((m) => m.HoliGame),
  { ssr: false, loading: () => null },
);

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setUnlocked(true);
      },
      { rootMargin: "0px", threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="doodle-zone relative border-t border-[var(--border)] pb-10 pt-16">
      <FloatAccent
        className="pointer-events-none absolute left-[8%] top-8 opacity-50"
        amplitude={7}
        duration={5.5}
      >
        <HoliDoodleMotif variant="halo" />
      </FloatAccent>
      <FloatAccent
        className="pointer-events-none absolute right-[6%] top-12 opacity-45"
        amplitude={10}
        duration={4}
        rotate={6}
      >
        <HoliDoodleMotif variant="spark" className="h-7 w-7" />
      </FloatAccent>

      <motion.div
        className="relative mx-auto max-w-6xl px-5 md:px-8"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-mark.svg"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <div>
              <p className="font-display text-2xl font-semibold tracking-[0.2em]">
                HOLIVE
              </p>
              <p className="mt-1 text-sm text-[var(--holive-gold)]">
                {t("tagline")}
              </p>
            </div>
          </div>
          <p className="text-xs text-[color-mix(in_srgb,var(--foreground)_55%,transparent)]">
            {t("rights", { year })}
          </p>
        </div>

        <SketchDivider className="mt-12" />

        <div className="mt-8 text-center">
          <Link
            href="/experimentos"
            className="focus-ring font-mono-code text-[0.7rem] uppercase tracking-[0.28em] text-[var(--holive-gold)] transition hover:text-[var(--holive-gold-bright)]"
          >
            {t("experimentsLink")}
          </Link>
          <p className="mt-2 text-xs text-[color-mix(in_srgb,var(--foreground)_50%,transparent)]">
            {t("experimentsHint")}
          </p>
        </div>

        <p className="font-mono-code mt-8 text-center text-[0.65rem] tracking-[0.25em] text-[color-mix(in_srgb,var(--foreground)_40%,transparent)]">
          {t("gameHint")}
        </p>

        <div ref={sentinelRef} className="mt-10 min-h-[2rem]">
          {unlocked ? (
            <motion.div
              className="doodle-border-sketch p-3 md:p-4"
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 14 }}
            >
              <HoliGame />
            </motion.div>
          ) : (
            <div className="h-8" aria-hidden />
          )}
        </div>
      </motion.div>
    </footer>
  );
}
