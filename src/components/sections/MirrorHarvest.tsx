"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Mirror / reflection — the business returns what you plant.
 */
export function MirrorHarvest() {
  const t = useTranslations("Experience.mirror");
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      el.style.setProperty("--mx", `${x.toFixed(1)}px`);
      el.style.setProperty("--my", `${y.toFixed(1)}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <ExperienceBand
      id="espejo"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
    >
      <div
        ref={wrapRef}
        className="relative mx-auto grid max-w-3xl gap-0 overflow-hidden border border-[var(--border)] md:grid-cols-2"
        style={
          {
            ["--mx"]: "0px",
            ["--my"]: "0px",
          } as CSSProperties
        }
      >
        <div className="relative flex min-h-[14rem] flex-col justify-end bg-[linear-gradient(160deg,#330072,#101820)] p-6 text-[var(--holive-white)]">
          <p className="font-mono-code text-[0.6rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
            {t("above.label")}
          </p>
          <p className="font-display mt-2 text-2xl font-semibold">{t("above.text")}</p>
          <div
            aria-hidden
            className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full border border-[var(--holive-gold)]/50"
            style={{
              transform: reduced
                ? undefined
                : "translate(var(--mx), var(--my))",
            }}
          />
        </div>
        <div
          className="relative flex min-h-[14rem] flex-col justify-start border-t border-[var(--border)] bg-[linear-gradient(200deg,#f7f4fb,#ebe4f5)] p-6 dark:border-[color-mix(in_srgb,#C9A84C_20%,transparent)] dark:bg-[linear-gradient(200deg,#1a1524,#141018)] md:border-l md:border-t-0"
          style={{
            transform: reduced
              ? "scaleY(-1)"
              : "scaleY(-1) translate(calc(var(--mx) * -0.4), calc(var(--my) * -0.3))",
          }}
        >
          <div style={{ transform: "scaleY(-1)" }}>
            <p className="font-mono-code text-[0.6rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
              {t("below.label")}
            </p>
            <p className="font-display mt-2 text-2xl font-semibold text-[var(--holive-purple-bright)]">
              {t("below.text")}
            </p>
          </div>
        </div>
      </div>
    </ExperienceBand>
  );
}
