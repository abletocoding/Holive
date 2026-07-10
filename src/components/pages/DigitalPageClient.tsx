"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Link } from "@/i18n/navigation";
import { MagneticButton } from "@/components/effects/MagneticButton";

const NeuralMesh = dynamic(
  () => import("@/components/effects/NeuralMesh").then((m) => m.NeuralMesh),
  { ssr: false },
);

const items = ["webs", "systems", "automation", "maquila", "advisory"] as const;

export function DigitalPageClient() {
  const t = useTranslations("Pages.digital");
  const d = useTranslations("Digital");
  const n = useTranslations("Nav");

  return (
    <PageHero
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      holiTip={t("holiTip")}
      ambient="none"
    >
      <div className="relative mb-16 min-h-[280px] overflow-hidden rounded border border-[var(--border)] bg-[var(--surface-muted)]">
        <NeuralMesh />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((key, i) => (
          <SectionReveal key={key} delay={0.04 * i}>
            <article className="doodle-frame h-full">
              <p className="font-mono-code text-[0.6rem] tracking-[0.22em] text-[var(--holive-gold)]">
                0{i + 1}
              </p>
              <h2 className="font-display mt-2 text-xl font-semibold">
                {d(`items.${key}.title`)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                {d(`items.${key}.text`)}
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
