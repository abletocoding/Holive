"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-001 — Sacred watching iris (pointer-tracking). */
export function ExpWatchingEye() {
  const t = useTranslations("Experiments.files.eye");
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 28;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 18;
      el.style.setProperty("--ix", `${x}px`);
      el.style.setProperty("--iy", `${y}px`);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <ExperimentFile
      id="exp-eye"
      code="EXP-001"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={ref}
        className="exp-eye relative mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_30%,transparent)] bg-[radial-gradient(circle_at_center,#1a003d,#0a0810)]"
        style={{ ["--ix" as string]: "0px", ["--iy" as string]: "0px" }}
      >
        <div className="exp-eye-lid absolute h-[42%] w-[62%] rounded-[50%] border border-[var(--holive-gold)]/40 bg-[color-mix(in_srgb,var(--holive-purple)_35%,#0a0810)] shadow-[0_0_40px_rgba(51,0,114,0.45)]" />
        <div
          className="relative z-10 h-24 w-24 rounded-full border-2 border-[var(--holive-gold)] bg-[radial-gradient(circle_at_35%_35%,#fff_0%,#C9A84C_45%,#330072_100%)] md:h-28 md:w-28"
          style={{ transform: "translate(var(--ix), var(--iy))" }}
        >
          <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#101820]" />
          <span className="absolute left-[42%] top-[38%] h-2 w-2 rounded-full bg-white/80" />
        </div>
        <p className="pointer-events-none absolute bottom-3 font-mono-code text-[0.6rem] uppercase tracking-[0.25em] text-[var(--holive-gold)]">
          {t("hint")}
        </p>
      </div>
    </ExperimentFile>
  );
}
