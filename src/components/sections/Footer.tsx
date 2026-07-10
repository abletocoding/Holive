"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  HoliDoodleMotif,
  SketchDivider,
} from "@/components/ui/Doodle";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HoliGame = dynamic(
  () => import("@/components/holi/HoliGame").then((m) => m.HoliGame),
  { ssr: false, loading: () => null },
);

const footerLinks = [
  { href: "/services", key: "services" as const },
  { href: "/digital", key: "digital" as const },
  { href: "/courses", key: "courses" as const },
  { href: "/historias", key: "stories" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function Footer({ showGame = true }: { showGame?: boolean }) {
  const t = useTranslations("Footer");
  const tn = useTranslations("Nav");
  const year = new Date().getFullYear();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!showGame) return;
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
  }, [showGame]);

  return (
    <footer className="doodle-zone relative border-t border-[var(--border)] pb-10 pt-16">
      <div aria-hidden className="pointer-events-none absolute left-[8%] top-8 opacity-45">
        <HoliDoodleMotif variant="halo" />
      </div>
      <div aria-hidden className="pointer-events-none absolute right-[6%] top-12 opacity-40">
        <HoliDoodleMotif variant="spark" className="h-7 w-7" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
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
              <p className="mt-1 text-sm text-[var(--holive-gold)]">{t("tagline")}</p>
            </div>
          </div>
          <nav
            className="flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-wide text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]"
            aria-label="Footer"
          >
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="focus-ring hover:text-[var(--holive-gold)]"
              >
                {tn(l.key)}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-6 text-xs text-[color-mix(in_srgb,var(--foreground)_55%,transparent)]">
          {t("rights", { year })}
        </p>

        <SketchDivider className="mt-12" />

        {showGame && (
          <>
            <p className="font-mono-code mt-8 text-center text-[0.65rem] tracking-[0.25em] text-[color-mix(in_srgb,var(--foreground)_40%,transparent)]">
              {t("gameHint")}
            </p>
            <p
              aria-hidden
              className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[var(--holive-gold)] to-transparent opacity-60"
            />
            <div ref={sentinelRef} className="mt-10 min-h-[2rem]">
              {unlocked ? (
                <div className="animate-[fadeIn_0.6s_ease] -mx-5 md:-mx-8">
                  <HoliGame />
                </div>
              ) : (
                <div className="h-8" aria-hidden />
              )}
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
