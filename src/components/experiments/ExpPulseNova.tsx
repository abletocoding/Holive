"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Ripple = { id: number; x: number; y: number; gold: boolean };

/** EXP-007 — Office nova: tap to expand clarity. */
export function ExpPulseNova() {
  const t = useTranslations("Experiments.files.nova");
  const reduced = usePrefersReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [hits, setHits] = useState(0);
  const idRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const burst = useCallback(
    (cx: number, cy: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const id = ++idRef.current;
      setRipples((p) => [...p.slice(-8), { id, x: ((cx - r.left) / r.width) * 100, y: ((cy - r.top) / r.height) * 100, gold: id % 2 === 0 }]);
      setHits((h) => h + 1);
      window.setTimeout(() => setRipples((p) => p.filter((x) => x.id !== id)), reduced ? 500 : 1100);
    },
    [reduced],
  );

  return (
    <ExperimentFile
      id="exp-nova"
      code="EXP-007"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={stageRef}
        role="presentation"
        onPointerDown={(e) => burst(e.clientX, e.clientY)}
        className="relative flex min-h-[18rem] cursor-crosshair select-none items-center justify-center overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--holive-purple-bright)_40%,transparent)] bg-[radial-gradient(ellipse_at_center,#2a1055,#0a0810)] md:min-h-[22rem]"
      >
        {ripples.map((p) => (
          <span
            key={p.id}
            className={`exp-nova-ring pointer-events-none absolute rounded-full border-2 ${p.gold ? "border-[var(--holive-gold)]" : "border-[var(--holive-purple-bright)]"}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}
        <div className="pointer-events-none relative z-10 text-center">
          <p className="font-display text-4xl font-semibold text-[var(--holive-gold)]">{hits}</p>
          <p className="font-mono-code mt-2 text-[0.6rem] uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--holive-white)_70%,transparent)]">
            {t("hint")}
          </p>
        </div>
      </div>
    </ExperimentFile>
  );
}
