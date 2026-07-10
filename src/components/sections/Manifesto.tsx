"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/SectionReveal";
import {
  CrayonUnderline,
  HoliDoodleMotif,
  SketchDivider,
} from "@/components/ui/Doodle";

const pillarKeys = ["purity", "loyalty", "code"] as const;

export function Manifesto() {
  const t = useTranslations("Manifesto");

  return (
    <section id="manifesto" className="doodle-zone section-pad relative">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[4%] top-10 opacity-60 md:right-[8%] md:top-16"
      >
        <HoliDoodleMotif variant="halo" className="h-12 w-12 md:h-14 md:w-14" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-[6%] hidden opacity-50 sm:block"
      >
        <HoliDoodleMotif variant="olive" className="h-10 w-8 rotate-[-8deg]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight">
            {t("title")}
          </h2>
          <CrayonUnderline />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,transparent)]">
            {t("body")}
          </p>
        </SectionReveal>

        <SketchDivider className="mt-12 mb-2" />

        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-8">
          {pillarKeys.map((key, i) => (
            <SectionReveal key={key} delay={0.08 * i}>
              <div className="doodle-stroke-top">
                <h3 className="font-display text-xl font-semibold text-[var(--holive-purple-bright)]">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                  {t(`pillars.${key}.text`)}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
