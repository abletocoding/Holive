"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { HoliMascot } from "@/components/holi/HoliMascot";

export function ContactPageClient() {
  const t = useTranslations("Pages.contact");

  return (
    <PageHero
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("body")}
      holiTip={t("holiTip")}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <div className="max-w-xl">
          <LeadForm />
        </div>
        <div className="hidden flex-col items-center gap-3 lg:flex">
          <HoliMascot pose="guide" className="h-24 w-20" />
          <p className="font-mono-code max-w-[10rem] text-center text-[0.6rem] tracking-[0.18em] text-[var(--holive-gold)]">
            HOLI
          </p>
        </div>
      </div>
    </PageHero>
  );
}
