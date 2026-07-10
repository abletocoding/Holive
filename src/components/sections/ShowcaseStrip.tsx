"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { TextScramble } from "@/components/effects/TextScramble";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { HoliGuide } from "@/components/holi/HoliGuide";
import { ParallaxLayer } from "@/components/effects/ParallaxLayer";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

const LiquidMetaballs = dynamic(
  () =>
    import("@/components/effects/LiquidMetaballs").then(
      (m) => m.LiquidMetaballs,
    ),
  { ssr: false },
);

const ShaderAurora = dynamic(
  () => import("@/components/effects/ShaderAurora").then((m) => m.ShaderAurora),
  { ssr: false },
);

const TouchAurora = dynamic(
  () => import("@/components/effects/TouchAurora").then((m) => m.TouchAurora),
  { ssr: false },
);

/**
 * High-end visual showcase strip — agency-portfolio moments between manifesto and services.
 */
export function ShowcaseStrip() {
  const t = useTranslations("Pages");
  const tn = useTranslations("Nav");
  const coarse = useIsCoarsePointer();

  return (
    <section className="relative overflow-hidden border-y border-[var(--border)]">
      <div className="relative min-h-[min(52vh,28rem)] md:min-h-[48vh]">
        {coarse ? <TouchAurora /> : <ShaderAurora />}
        {!coarse && (
          <div className="absolute inset-0 opacity-70">
            <LiquidMetaballs />
          </div>
        )}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-end gap-6 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <ParallaxLayer strength={0.12}>
            <SectionReveal>
              <p className="font-mono-code text-[0.65rem] tracking-[0.28em] text-[var(--holive-gold)]">
                HOLIVE://SHOWCASE
              </p>
              <TextScramble
                as="h2"
                text={t("about.title")}
                className="font-display mt-3 max-w-lg text-[clamp(1.5rem,4.2vw,2.6rem)] font-semibold text-[var(--holive-white)]"
              />
              <p className="mt-3 max-w-md text-sm text-[color-mix(in_srgb,var(--holive-white)_70%,transparent)]">
                {t("about.body")}
              </p>
            </SectionReveal>
          </ParallaxLayer>
          <div className="flex flex-wrap items-center gap-4">
            <HoliGuide tip={t("about.holiBody").slice(0, 120) + "…"} pose="wave" />
            <MagneticButton>
              <Link
                href="/about"
                className="focus-ring inline-flex min-h-11 bg-[var(--holive-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--holive-black)]"
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
