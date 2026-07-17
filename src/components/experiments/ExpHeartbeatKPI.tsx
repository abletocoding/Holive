"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-012 — Heartbeat KPI: the olive pulse as a living metric. */
export function ExpHeartbeatKPI() {
  const t = useTranslations("Experiments.files.heartbeat");
  const reduced = usePrefersReducedMotion();
  const [bpm, setBpm] = useState(72);
  const [beat, setBeat] = useState(false);
  const phase = useRef(0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      phase.current += dt * (bpm / 60);
      const frac = phase.current % 1;
      setBeat(frac < 0.12 || (frac > 0.22 && frac < 0.32));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bpm, reduced]);

  return (
    <ExperimentFile
      id="exp-heartbeat"
      code="EXP-012"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div className="relative overflow-hidden rounded-sm border border-[var(--border)] bg-[linear-gradient(160deg,#0a0810,#1a003d_55%,#0a0810)] px-6 py-12 text-center">
        <div
          className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-[var(--holive-gold)]/60 bg-[color-mix(in_srgb,var(--holive-purple)_40%,transparent)] transition-transform duration-100 ${beat ? "scale-110 shadow-[0_0_40px_rgba(201,168,76,0.45)]" : "scale-100"}`}
        >
          <span className="font-display text-3xl text-[var(--holive-gold-bright)]">◉</span>
        </div>
        <p className="font-mono-code mt-6 text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
          {t("metric")}
        </p>
        <p className="font-display mt-2 text-5xl text-[var(--holive-white)] tabular-nums">{bpm}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("unit")}</p>
        <div className="mx-auto mt-8 flex max-w-xs items-center gap-3">
          <span className="font-mono-code text-[0.55rem] uppercase text-[var(--muted)]">48</span>
          <input
            type="range"
            min={48}
            max={120}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="h-1.5 w-full accent-[var(--holive-gold)]"
            aria-label={t("metric")}
          />
          <span className="font-mono-code text-[0.55rem] uppercase text-[var(--muted)]">120</span>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">{t("hint")}</p>
      </div>
    </ExperimentFile>
  );
}
