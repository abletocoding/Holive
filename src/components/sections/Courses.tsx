"use client";

import { useTranslations } from "next-intl";
import {
  FloatAccent,
  SectionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/ui/SectionReveal";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import {
  CrayonUnderline,
  HoliDoodleMotif,
  SketchFrame,
} from "@/components/ui/Doodle";

const teasers = ["one", "two", "three"] as const;

export function Courses() {
  const t = useTranslations("Courses");

  return (
    <section
      id="courses"
      className="doodle-zone section-pad relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--holive-purple) 18%, var(--background)), var(--background) 55%, color-mix(in srgb, var(--holive-gold) 10%, var(--background)))",
      }}
    >
      <FloatAccent
        className="pointer-events-none absolute -right-2 top-12 opacity-60 md:right-8 md:top-20"
        amplitude={14}
        duration={3.6}
        rotate={8}
      >
        <HoliDoodleMotif variant="spark" className="h-10 w-10" />
      </FloatAccent>
      <FloatAccent
        className="pointer-events-none absolute bottom-16 left-4 opacity-50 md:left-10"
        amplitude={9}
        duration={5.2}
      >
        <HoliDoodleMotif variant="halo" className="h-9 w-9 -rotate-12" />
      </FloatAccent>

      <div className="mx-auto max-w-6xl">
        <SectionReveal preset="pop">
          <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.9rem,4.2vw,3.2rem)] font-semibold leading-tight">
            {t("title")}
          </h2>
          <CrayonUnderline />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,transparent)]">
            {t("body")}
          </p>
        </SectionReveal>

        <StaggerGroup className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" stagger={0.1}>
          {teasers.map((key) => (
            <StaggerItem key={key} preset="pop">
              <SketchFrame className="font-mono-code text-sm tracking-wide text-[color-mix(in_srgb,var(--foreground)_85%,transparent)]">
                {t(`teasers.${key}`)}
              </SketchFrame>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <SectionReveal delay={0.15} preset="rise" className="mt-6">
          <WaitlistForm />
        </SectionReveal>
      </div>
    </section>
  );
}
