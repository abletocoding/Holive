"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-013 — Glitch dossier: corrupted sacred files that heal on hover. */
export function ExpGlitchDossier() {
  const t = useTranslations("Experiments.files.glitch");
  const reduced = usePrefersReducedMotion();
  const [corrupt, setCorrupt] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced || !corrupt) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 180);
    return () => window.clearInterval(id);
  }, [corrupt, reduced]);

  const scramble = (s: string) => {
    if (!corrupt || reduced) return s;
    const glyphs = "░▒▓█◈◉✦※※※HOLIVE";
    return s
      .split("")
      .map((ch, i) => ((i + tick) % 5 === 0 ? glyphs[(i + tick) % glyphs.length] : ch))
      .join("");
  };

  return (
    <ExperimentFile
      id="exp-glitch"
      code="EXP-016"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <button
        type="button"
        onMouseEnter={() => setCorrupt(false)}
        onMouseLeave={() => setCorrupt(true)}
        onFocus={() => setCorrupt(false)}
        onBlur={() => setCorrupt(true)}
        className="group relative w-full overflow-hidden rounded-sm border border-[var(--border)] bg-[#08060c] px-6 py-10 text-left transition hover:border-[var(--holive-gold)]/50"
      >
        <p className="font-mono-code text-[0.6rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
          {t("fileLabel")}
        </p>
        <p
          className={`font-display mt-4 text-2xl md:text-3xl ${corrupt ? "text-[var(--holive-gold)] exp-glitch-jitter" : "text-[var(--holive-white)]"}`}
        >
          {scramble(t("line1"))}
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
          {scramble(t("line2"))}
        </p>
        <p className="mt-6 font-mono-code text-[0.65rem] uppercase tracking-[0.2em] text-[var(--holive-gold)]/80">
          {corrupt ? t("hintCorrupt") : t("hintClean")}
        </p>
        {corrupt && !reduced ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,168,76,0.15) 2px, rgba(201,168,76,0.15) 3px)`,
              transform: `translateX(${(tick % 7) - 3}px)`,
            }}
          />
        ) : null}
      </button>
    </ExperimentFile>
  );
}
