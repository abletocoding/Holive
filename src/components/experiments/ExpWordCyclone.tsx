"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-008 — Lexicon cyclone. */
export function ExpWordCyclone() {
  const t = useTranslations("Experiments.files.cyclone");
  const reduced = usePrefersReducedMotion();
  const words = useMemo(
    () => [t("w0"), t("w1"), t("w2"), t("w3"), t("w4"), t("w5"), t("w6"), t("w7")],
    [t],
  );

  return (
    <ExperimentFile
      id="exp-cyclone"
      code="EXP-008"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div className="relative mx-auto aspect-square max-h-[24rem] w-full max-w-md overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--holive-black)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(51,0,114,0.5),transparent_65%)]" />
        {words.map((word, i) => (
          <span
            key={word + i}
            className={`font-display absolute left-1/2 top-1/2 text-[clamp(0.7rem,2.2vw,1.05rem)] font-semibold ${i % 2 ? "text-[var(--holive-white)]" : "text-[var(--holive-gold)]"} ${reduced ? "" : "exp-cyclone-spin"}`}
            style={{
              ["--a" as string]: `${(i / words.length) * 360}deg`,
              ["--r" as string]: `${34 + (i % 3) * 6}%`,
              animationDuration: `${11 + (i % 4) * 3}s`,
              animationDelay: `${-i * 0.35}s`,
            }}
          >
            {word}
          </span>
        ))}
        <p className="font-display absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 tracking-[0.2em] text-[var(--holive-gold-bright)]">
          HOLIVE
        </p>
      </div>
    </ExperimentFile>
  );
}
