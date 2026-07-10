"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { HoliGuide } from "@/components/holi/HoliGuide";

const ParticleField = dynamic(
  () =>
    import("@/components/effects/ParticleField").then((m) => m.ParticleField),
  { ssr: false },
);

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  holiTip?: string;
  children: ReactNode;
  ambient?: "particles" | "none";
};

export function PageHero({
  eyebrow,
  title,
  intro,
  holiTip,
  children,
  ambient = "particles",
}: Props) {
  return (
    <>
      <header className="page-hero border-b border-[var(--border)]">
        {ambient === "particles" && (
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <ParticleField density="low" />
          </div>
        )}
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
                {eyebrow}
              </p>
              <h1 className="font-display mt-3 text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-tight">
                {title}
              </h1>
              {intro && (
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]">
                  {intro}
                </p>
              )}
            </div>
            {holiTip && <HoliGuide tip={holiTip} pose="guide" />}
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        {children}
      </main>
    </>
  );
}
