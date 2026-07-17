"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/SectionReveal";

const layers = ["strategy", "social", "design", "print"] as const;

export function Services() {
  const t = useTranslations("Services");

  return (
    <section
      id="services"
      className="section-pad relative overflow-hidden bg-[var(--surface-muted)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[var(--holive-purple)]/10 blur-3xl"
      />
      <div className="mx-auto max-w-6xl">
        <SectionReveal preset="drop">
          <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]">
            {t("intro")}
          </p>
        </SectionReveal>

        <div className="story-rail mt-16 space-y-14 md:space-y-20">
          {layers.map((key, i) => (
            <SectionReveal
              key={key}
              delay={0.04 * i}
              preset={i % 2 === 0 ? "slideLeft" : "slideRight"}
            >
              <article
                className={`relative grid gap-3 pl-8 md:grid-cols-2 md:items-baseline md:gap-12 md:pl-0 ${
                  i % 2 === 1 ? "md:text-right" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-[var(--holive-gold)] md:left-1/2 md:-translate-x-1/2"
                />
                <div className={i % 2 === 1 ? "md:col-start-2" : ""}>
                  <p className="font-mono-code text-[0.65rem] tracking-[0.25em] text-[var(--holive-purple)]">
                    0{i + 1}
                  </p>
                  <h3 className="font-display mt-1 text-2xl font-semibold">
                    {t(`layers.${key}.title`)}
                  </h3>
                </div>
                <p
                  className={`text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)] md:text-base ${
                    i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
                  }`}
                >
                  {t(`layers.${key}.text`)}
                </p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
