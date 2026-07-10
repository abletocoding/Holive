"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { TextScramble } from "@/components/effects/TextScramble";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { HoliGuide } from "@/components/holi/HoliGuide";

const LiquidMetaballs = dynamic(
  () =>
    import("@/components/effects/LiquidMetaballs").then(
      (m) => m.LiquidMetaballs,
    ),
  { ssr: false },
);

const ShaderAurora = dynamic(
  () =>
    import("@/components/effects/ShaderAurora").then((m) => m.ShaderAurora),
  { ssr: false },
);

/**
 * High-end visual showcase strip — agency-portfolio moments between manifesto and services.
 */
export function ShowcaseStrip() {
  const t = useTranslations("Pages");
  const tn = useTranslations("Nav");

  return (
    <section className="relative overflow-hidden border-y border-[var(--border)]">
      <div className="relative min-h-[42vh] md:min-h-[48vh]">
        <ShaderAurora />
        <div className="absolute inset-0 opacity-70">
          <LiquidMetaballs />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-end gap-6 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <SectionReveal>
            <p className="font-mono-code text-[0.65rem] tracking-[0.28em] text-[var(--holive-gold)]">
              HOLIVE://SHOWCASE
            </p>
            <TextScramble
              as="h2"
              text={t("about.title")}
              className="font-display mt-3 max-w-lg text-[clamp(1.6rem,3.5vw,2.6rem)] font-semibold text-[var(--holive-white)]"
            />
            <p className="mt-3 max-w-md text-sm text-[color-mix(in_srgb,var(--holive-white)_70%,transparent)]">
              {t("about.body")}
            </p>
          </SectionReveal>
          <div className="flex flex-wrap items-center gap-4">
            <HoliGuide tip={t("about.holiBody").slice(0, 120) + "…"} pose="wave" />
            <MagneticButton>
              <Link
                href="/about"
                className="focus-ring inline-flex bg-[var(--holive-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--holive-black)]"
              >
                {tn("about")}
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
