"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-006 — Sacred orbits around Holi. */
export function ExpSacredOrbit() {
  const t = useTranslations("Experiments.files.orbit");
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty("--ox", `${((e.clientX - r.left) / r.width - 0.5) * 16}px`);
      stage.style.setProperty("--oy", `${((e.clientY - r.top) / r.height - 0.5) * 12}px`);
    };
    stage.addEventListener("pointermove", onMove, { passive: true });
    return () => stage.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <ExperimentFile
      id="exp-orbit"
      code="EXP-006"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={stageRef}
        className="relative mx-auto flex aspect-square max-h-[26rem] w-full max-w-md items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[radial-gradient(circle_at_center,#1a003d,#0a0810)]"
        style={{ ["--ox" as string]: "0px", ["--oy" as string]: "0px" }}
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            aria-hidden
            className={`absolute rounded-full border ${reduced ? "" : "exp-orbit-spin"}`}
            style={{
              width: `${30 + n * 15}%`,
              height: `${30 + n * 15}%`,
              borderColor:
                n % 2 === 0
                  ? "color-mix(in srgb, var(--holive-gold) 55%, transparent)"
                  : "color-mix(in srgb, var(--holive-purple-bright) 50%, transparent)",
              animationDuration: `${5 + n * 2}s`,
              animationDirection: n % 2 ? "normal" : "reverse",
            }}
          >
            <span
              className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: n % 2 ? "var(--holive-purple-bright)" : "var(--holive-gold)",
              }}
            />
          </div>
        ))}
        <div className="relative z-10" style={{ transform: "translate(calc(var(--ox)*-0.35), calc(var(--oy)*-0.35))" }}>
          <HoliMascot className="h-20 w-16" />
        </div>
      </div>
    </ExperimentFile>
  );
}
