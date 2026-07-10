"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
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
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-8 opacity-45"
      >
        <HoliDoodleMotif variant="halo" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-12 opacity-40"
      >
        <HoliDoodleMotif variant="spark" className="h-7 w-7" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
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

        <p className="font-mono-code mt-8 text-center text-[0.65rem] tracking-[0.25em] text-[color-mix(in_srgb,var(--foreground)_40%,transparent)]">
          {t("gameHint")}
        </p>

        {/* Hidden until user scrolls to the very bottom */}
        <div ref={sentinelRef} className="mt-10 min-h-[2rem]">
          {unlocked ? (
            <div className="doodle-border-sketch animate-[fadeIn_0.6s_ease] p-3 md:p-4">
              <HoliGame />
            </div>
          ) : (
            <div className="h-8" aria-hidden />
          )}
        </div>
      </div>
    </footer>
  );
}
