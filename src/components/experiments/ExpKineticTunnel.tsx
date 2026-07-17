"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-015 — Kinetic tunnel: the corridor of craft. */
export function ExpKineticTunnel() {
  const t = useTranslations("Experiments.files.tunnel");
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    let z = 0;
    const tick = () => {
      z = (z + 0.35) % 100;
      el.style.setProperty("--tz", `${z}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <ExperimentFile
      id="exp-tunnel"
      code="EXP-015"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={ref}
        className="exp-tunnel relative aspect-[16/10] overflow-hidden rounded-sm border border-[var(--border)] bg-[#05040a]"
        style={{ ["--tz" as string]: "0" }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="exp-tunnel-ring absolute left-1/2 top-1/2 border border-[var(--holive-gold)]/25"
            style={{ ["--i" as string]: String(i) }}
          />
        ))}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-display text-xl text-[var(--holive-gold-bright)] md:text-2xl">HOLIVE</p>
          <p className="mt-1 font-mono-code text-[0.55rem] uppercase tracking-[0.3em] text-[var(--muted)]">
            {t("hint")}
          </p>
        </div>
      </div>
    </ExperimentFile>
  );
}
