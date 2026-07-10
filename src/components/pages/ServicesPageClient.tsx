"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/effects/MagneticButton";

const layers = ["strategy", "social", "design", "print"] as const;

export function ServicesPageClient() {
  const t = useTranslations("Pages.services");
  const s = useTranslations("Services");
  const n = useTranslations("Nav");

  return (
    <PageHero
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      holiTip={t("holiTip")}
    >
      <div className="story-rail space-y-14 md:space-y-20">
        {layers.map((key, i) => (
          <SectionReveal key={key} delay={0.05 * i} immersive>
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
                <h2 className="font-display mt-1 text-2xl font-semibold">
                  {s(`layers.${key}.title`)}
                </h2>
              </div>
              <p
                className={`text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)] md:text-base ${
                  i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
                }`}
              >
                {s(`layers.${key}.text`)}
              </p>
            </article>
          </SectionReveal>
        ))}
      </div>
      <div className="mt-16">
        <MagneticButton>
          <Link
            href="/contact"
            className="focus-ring inline-flex bg-[var(--holive-gold)] px-6 py-3 text-sm font-semibold text-[var(--holive-black)]"
          >
            {n("contact")}
          </Link>
        </MagneticButton>
      </div>
    </PageHero>
  );
}
