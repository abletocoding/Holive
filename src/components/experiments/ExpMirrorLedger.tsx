"use client";

import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { SectionReveal } from "@/components/ui/SectionReveal";

/** EXP-010 — Mirror ledger: what you plant returns. */
export function ExpMirrorLedger() {
  const t = useTranslations("Experiments.files.mirror");

  return (
    <ExperimentFile
      id="exp-mirror"
      code="EXP-013"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div className="grid gap-0 overflow-hidden rounded-sm border border-[var(--border)]">
        <SectionReveal preset="drop" className="bg-[linear-gradient(180deg,#1a003d,#0a0810)] px-6 py-10 text-center">
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
            {t("aboveLabel")}
          </p>
          <p className="font-display mt-3 text-2xl text-[var(--holive-white)] md:text-3xl">
            {t("aboveText")}
          </p>
        </SectionReveal>
        <div className="h-px bg-[var(--holive-gold)]/50" />
        <SectionReveal preset="rise" delay={0.1} className="exp-mirror-flip bg-[linear-gradient(0deg,#1a003d,#0a0810)] px-6 py-10 text-center">
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
            {t("belowLabel")}
          </p>
          <p className="font-display mt-3 text-2xl text-[var(--holive-gold-bright)] md:text-3xl">
            {t("belowText")}
          </p>
        </SectionReveal>
      </div>
    </ExperimentFile>
  );
}
