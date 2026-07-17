"use client";

import { useTranslations } from "next-intl";
import {
  FloatAccent,
  SectionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/ui/SectionReveal";
import { CrayonUnderline, HoliDoodleMotif } from "@/components/ui/Doodle";

const steps = ["listen", "design", "build", "evolve"] as const;
const stepPresets = ["drop", "slideLeft", "slideRight", "pop"] as const;

export function Process() {
  const t = useTranslations("Process");

  return (
    <section id="process" className="doodle-zone section-pad relative bg-[var(--surface-muted)]">
      <FloatAccent
        className="pointer-events-none absolute right-[10%] top-12 opacity-50"
        amplitude={11}
        duration={4.8}
        rotate={5}
      >
        <HoliDoodleMotif variant="olive" className="h-9 w-7 rotate-6" />
      </FloatAccent>

      <div className="relative mx-auto max-w-6xl">
        <SectionReveal preset="slideRight">
          <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold">
            {t("title")}
          </h2>
          <CrayonUnderline />
        </SectionReveal>

        <StaggerGroup
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.11}
        >
          {steps.map((key, i) => (
            <StaggerItem key={key} preset={stepPresets[i]}>
              <div className="doodle-border-sketch px-4 py-5">
                <span className="font-display text-4xl font-semibold text-[color-mix(in_srgb,var(--holive-purple)_55%,transparent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-xl font-semibold">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                  {t(`steps.${key}.text`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
