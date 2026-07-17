"use client";

import { useTranslations } from "next-intl";
import {
  FloatAccent,
  SectionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/ui/SectionReveal";
import {
  CrayonUnderline,
  HoliDoodleMotif,
  SketchDivider,
} from "@/components/ui/Doodle";

const pillarKeys = ["purity", "loyalty", "code"] as const;
const pillarPresets = ["slideLeft", "rise", "slideRight"] as const;

export function Manifesto() {
  const t = useTranslations("Manifesto");

  return (
    <section id="manifesto" className="doodle-zone section-pad relative">
      <FloatAccent
        className="pointer-events-none absolute right-[4%] top-10 opacity-70 md:right-[8%] md:top-16"
        amplitude={12}
        duration={5}
      >
        <HoliDoodleMotif variant="halo" className="h-12 w-12 md:h-14 md:w-14" />
      </FloatAccent>
      <FloatAccent
        className="pointer-events-none absolute bottom-8 left-[6%] hidden opacity-55 sm:block"
        amplitude={8}
        duration={6}
        rotate={4}
      >
        <HoliDoodleMotif variant="olive" className="h-10 w-8 rotate-[-8deg]" />
      </FloatAccent>

      <div className="mx-auto max-w-6xl">
        <SectionReveal preset="skew">
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

        <StaggerGroup className="mt-10 grid gap-8 md:grid-cols-3 md:gap-8" stagger={0.12}>
          {pillarKeys.map((key, i) => (
            <StaggerItem key={key} preset={pillarPresets[i]}>
              <div className="doodle-stroke-top">
                <h3 className="font-display text-xl font-semibold text-[var(--holive-purple-bright)]">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                  {t(`pillars.${key}.text`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
