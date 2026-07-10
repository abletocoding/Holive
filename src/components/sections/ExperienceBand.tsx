"use client";

import type { ReactNode } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CrayonUnderline } from "@/components/ui/Doodle";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  refran: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
};

/** Shared chrome for decorative experience bands — one job, one refrán. */
export function ExperienceBand({
  id,
  eyebrow,
  title,
  refran,
  children,
  className = "",
  dark = false,
}: Props) {
  return (
    <section
      id={id}
      className={`section-pad relative isolate overflow-hidden ${
        dark
          ? "bg-[var(--holive-black)] text-[var(--holive-white)]"
          : "bg-[var(--background)]"
      } ${className}`}
    >
      <div className="relative z-[var(--z-section-content)] mx-auto max-w-6xl">
        <SectionReveal>
          <p
            className={`font-mono-code text-xs uppercase tracking-[0.3em] ${
              dark ? "text-[var(--holive-gold)]" : "text-[var(--holive-gold)]"
            }`}
          >
            {eyebrow}
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-[clamp(1.65rem,3.8vw,2.75rem)] font-semibold leading-tight">
            {title}
          </h2>
          <CrayonUnderline />
          <p
            className={`mt-4 max-w-2xl font-display text-lg italic leading-snug md:text-xl ${
              dark
                ? "text-[color-mix(in_srgb,var(--holive-gold)_88%,white)]"
                : "text-[var(--holive-purple-bright)]"
            }`}
          >
            “{refran}”
          </p>
        </SectionReveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
