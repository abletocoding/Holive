"use client";

import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Vertical mantra waterfall — business refranes cascading.
 */
export function MantraWaterfall() {
  const t = useTranslations("Experience.mantra");
  const reduced = usePrefersReducedMotion();
  const items = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => t(`items.${i}`));
  const loop = [...items, ...items];

  return (
    <ExperienceBand
      id="mantras"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
      dark
    >
      <div className="relative mx-auto h-[22rem] max-w-xl overflow-hidden border border-[color-mix(in_srgb,#C9A84C_30%,transparent)] bg-[#101820] md:h-[26rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-gradient-to-b from-[#101820] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-[#101820] to-transparent"
        />
        <div
          className={`flex flex-col gap-6 py-8 ${reduced ? "" : "mantra-fall"}`}
          style={reduced ? undefined : { animationDuration: "42s" }}
        >
          {loop.map((text, i) => (
            <p
              key={`${i}-${text.slice(0, 12)}`}
              className={`px-6 text-center font-display text-lg leading-snug md:text-xl ${
                i % 2 === 0
                  ? "text-[var(--holive-gold)]"
                  : "text-[color-mix(in_srgb,#5a2a9e_80%,white)]"
              }`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </ExperienceBand>
  );
}
