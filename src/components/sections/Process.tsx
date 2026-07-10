"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CrayonUnderline, HoliDoodleMotif } from "@/components/ui/Doodle";

const steps = ["listen", "design", "build", "evolve"] as const;

export function Process() {
  const t = useTranslations("Process");

  return (
    <section id="process" className="doodle-zone section-pad relative bg-[var(--surface-muted)]">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] top-12 opacity-40"
      >
        <HoliDoodleMotif variant="olive" className="h-9 w-7 rotate-6" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionReveal>
          <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold">
            {t("title")}
          </h2>
          <CrayonUnderline />
        </SectionReveal>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((key, i) => (
            <SectionReveal key={key} delay={0.06 * i}>
              <li className="doodle-border-sketch px-4 py-5">
                <span className="font-display text-4xl font-semibold text-[color-mix(in_srgb,var(--holive-purple)_55%,transparent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-xl font-semibold">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                  {t(`steps.${key}.text`)}
                </p>
              </li>
            </SectionReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
