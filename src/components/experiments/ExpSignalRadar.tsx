"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";

/** EXP-009 — Signal of the craft (radar). */
export function ExpSignalRadar() {
  const t = useTranslations("Experiments.files.signal");
  const ref = useRef<HTMLDivElement>(null);
  const bars = 26;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = 1 - Math.min(1, Math.max(0, r.top / (window.innerHeight * 0.9)));
      el.style.setProperty("--sp", p.toFixed(3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ExperimentFile
      id="exp-signal"
      code="EXP-009"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={ref}
        className="relative flex min-h-[16rem] items-end justify-center gap-[3px] overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_28%,transparent)] bg-[#0a0810] px-3 pb-5 pt-8 md:min-h-[20rem]"
        style={{ ["--sp" as string]: "0.35" }}
      >
        {Array.from({ length: bars }, (_, i) => {
          const d = Math.abs(i - bars / 2) / (bars / 2);
          return (
            <span
              key={i}
              className="exp-signal-bar w-[3%] max-w-3 rounded-t-sm"
              style={{
                ["--d" as string]: d.toFixed(3),
                background:
                  i % 3 === 0
                    ? "linear-gradient(to top,#330072,#C9A84C)"
                    : "linear-gradient(to top,#1a003d,#6B3DB8)",
              }}
            />
          );
        })}
        <p className="pointer-events-none absolute left-3 top-3 font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[var(--holive-gold)]">
          {t("hint")}
        </p>
      </div>
    </ExperimentFile>
  );
}
