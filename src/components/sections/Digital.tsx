"use client";

import { useTranslations } from "next-intl";
import {
  SectionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/ui/SectionReveal";

const items = [
  "webs",
  "systems",
  "automation",
  "maquila",
  "advisory",
] as const;

export function Digital() {
  const t = useTranslations("Digital");

  return (
    <section id="digital" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <SectionReveal preset="expand">
          <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]">
            {t("intro")}
          </p>
        </SectionReveal>

        <StaggerGroup
          className="mt-14 divide-y divide-[var(--border)] border-y border-[var(--border)]"
          stagger={0.08}
        >
          {items.map((key, i) => (
            <StaggerItem key={key} preset="slideLeft">
              <li className="group grid list-none gap-2 py-7 transition-colors md:grid-cols-[minmax(0,1fr)_1.4fr] md:items-baseline md:gap-10">
                <h3 className="font-display text-xl font-semibold group-hover:text-[var(--holive-purple-bright)]">
                  <span className="font-mono-code mr-3 text-xs text-[var(--holive-gold)]">
                    {`//${String(i + 1).padStart(2, "0")}`}
                  </span>
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)] md:text-base">
                  {t(`items.${key}.text`)}
                </p>
              </li>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
