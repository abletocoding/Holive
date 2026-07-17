"use client";

import type { ReactNode } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";

type Props = {
  id: string;
  code: string;
  status: string;
  title: string;
  summary: string;
  refran: string;
  children: ReactNode;
};

/** Classified Holive lab file chrome — humor + business mysticism. */
export function ExperimentFile({
  id,
  code,
  status,
  title,
  summary,
  refran,
  children,
}: Props) {
  return (
    <article
      id={id}
      className="exp-file relative scroll-mt-28 overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_28%,var(--border))] bg-[color-mix(in_srgb,var(--holive-black)_92%,var(--holive-purple))]"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[color-mix(in_srgb,var(--holive-gold)_22%,transparent)] px-4 py-3 md:px-5">
        <div>
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
            {code} · {status}
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-[var(--holive-white)] md:text-2xl">
            {title}
          </h2>
        </div>
        <span className="font-mono-code rounded border border-[color-mix(in_srgb,var(--holive-gold)_40%,transparent)] px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--holive-gold)]">
          CLASSIFIED
        </span>
      </header>

      <SectionReveal preset="fade" className="px-4 pt-4 md:px-5">
        <p className="max-w-3xl text-sm leading-relaxed text-[color-mix(in_srgb,var(--holive-white)_78%,transparent)]">
          {summary}
        </p>
        <p className="font-display mt-3 text-base italic text-[var(--holive-gold-bright)] md:text-lg">
          “{refran}”
        </p>
      </SectionReveal>

      <div className="mt-5 px-3 pb-4 md:px-4 md:pb-5">{children}</div>
    </article>
  );
}
