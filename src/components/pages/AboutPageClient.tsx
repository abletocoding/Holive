"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { HoliGuide } from "@/components/holi/HoliGuide";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { TextScramble } from "@/components/effects/TextScramble";

const ParticleField = dynamic(
  () =>
    import("@/components/effects/ParticleField").then((m) => m.ParticleField),
  { ssr: false },
);

const pillars = ["purity", "loyalty", "code"] as const;

export function AboutPageClient() {
  const t = useTranslations("Pages.about");
  const m = useTranslations("Manifesto");

  return (
    <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("body")}>
      <SectionReveal>
        <div className="relative overflow-hidden rounded border border-[var(--border)] bg-[var(--surface-muted)] p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <ParticleField density="low" />
          </div>
          <div className="relative grid items-center gap-8 md:grid-cols-[140px_1fr]">
            <HoliMascot pose="wave" className="mx-auto h-28 w-20 md:h-32 md:w-24" />
            <div>
              <TextScramble
                as="h2"
                text={t("holiTitle")}
                className="font-display text-2xl font-semibold"
              />
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,transparent)] md:text-base">
                {t("holiBody")}
              </p>
              <div className="mt-4">
                <HoliGuide tip={t("holiBody")} pose="guide" />
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        {t("pillarsTitle")}
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {pillars.map((key, i) => (
          <SectionReveal key={key} delay={0.05 * i}>
            <article className="doodle-frame h-full">
              <h3 className="font-display text-xl font-semibold">
                {m(`pillars.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                {m(`pillars.${key}.text`)}
              </p>
            </article>
          </SectionReveal>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-6 opacity-90">
        <HoliMascot pose="think" className="h-16 w-12" />
        <HoliMascot pose="guide" className="h-16 w-12" />
        <HoliMascot pose="celebrate" className="h-16 w-12" />
      </div>
    </PageHero>
  );
}
