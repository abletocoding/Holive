"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { LeadForm } from "@/components/forms/LeadForm";

export function Contact() {
  const t = useTranslations("Contact");

  return (
    <section id="contact" className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <SectionReveal>
          <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]">
            {t("body")}
          </p>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <LeadForm />
        </SectionReveal>
      </div>
    </section>
  );
}
