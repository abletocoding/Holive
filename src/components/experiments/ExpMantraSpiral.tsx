"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-002 — Kinetic mantra spiral (scroll-linked). */
export function ExpMantraSpiral() {
  const t = useTranslations("Experiments.files.spiral");
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const lines = [t("l1"), t("l2"), t("l3"), t("l4"), t("l5"), t("l6")];

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = 1 - Math.min(1, Math.max(0, r.top / (window.innerHeight * 0.85)));
      el.style.setProperty("--sp", p.toFixed(3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <ExperimentFile
      id="exp-spiral"
      code="EXP-002"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={ref}
        className="exp-spiral relative min-h-[20rem] overflow-hidden rounded-sm border border-[var(--border)] bg-[#0a0810] md:min-h-[24rem]"
        style={{ ["--sp" as string]: "0.2" }}
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className="font-display absolute left-1/2 w-[88%] -translate-x-1/2 text-center font-semibold tracking-tight text-[var(--holive-white)]"
            style={{
              top: `${12 + i * 13}%`,
              fontSize: `clamp(${0.95 - i * 0.04}rem, ${3.6 - i * 0.35}vw, ${2.1 - i * 0.18}rem)`,
              opacity: `calc(0.2 + var(--sp) * ${0.8 - i * 0.08})`,
              transform: `translate(-50%, calc(var(--sp) * ${-18 * (i + 1)}px)) rotate(calc(var(--sp) * ${i % 2 === 0 ? 4 : -4}deg)) scale(calc(${1.08 - i * 0.04} + var(--sp) * 0.12))`,
              color: i % 2 === 0 ? "var(--holive-gold)" : "var(--holive-white)",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </ExperimentFile>
  );
}
