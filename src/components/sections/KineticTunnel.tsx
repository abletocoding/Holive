"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Kinetic refrán typography tunnel — scroll-linked depth cascade.
 */
export function KineticTunnel() {
  const t = useTranslations("Experience.kinetic");
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const lines = [t("line1"), t("line2"), t("line3"), t("line4"), t("line5")];

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const view = window.innerHeight;
      const progress = 1 - Math.min(1, Math.max(0, rect.top / (view * 0.85)));
      el.style.setProperty("--tunnel-p", progress.toFixed(3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <ExperienceBand
      id="tunel-tipografico"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
    >
      <div
        ref={trackRef}
        className="kinetic-tunnel relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-sm border border-[var(--border)] bg-[linear-gradient(180deg,var(--holive-black)_0%,#1a003d_55%,var(--holive-black)_100%)] px-4 py-16 md:min-h-[26rem]"
        style={{ ["--tunnel-p" as string]: "0" }}
      >
        {lines.map((line, i) => {
          const depth = i + 1;
          return (
            <p
              key={i}
              className="font-display pointer-events-none absolute left-1/2 w-[90%] max-w-3xl -translate-x-1/2 text-center font-semibold tracking-tight text-[var(--holive-white)]"
              style={{
                top: `${18 + i * 14}%`,
                fontSize: `clamp(${1.1 - i * 0.05}rem, ${4.2 - i * 0.45}vw, ${2.8 - i * 0.28}rem)`,
                opacity: reduced
                  ? 0.85 - i * 0.12
                  : `calc(0.25 + var(--tunnel-p) * ${0.75 - i * 0.08})`,
                transform: reduced
                  ? `translate(-50%, 0) scale(${1 - i * 0.06})`
                  : `translate(-50%, calc(var(--tunnel-p) * ${-12 * depth}px)) scale(calc(${1.15 - i * 0.08} + var(--tunnel-p) * ${0.2 - i * 0.02}))`,
                color:
                  i % 2 === 0
                    ? "color-mix(in srgb, #C9A84C 80%, white)"
                    : "color-mix(in srgb, #5a2a9e 70%, white)",
                textShadow: "0 0 40px rgba(51,0,114,0.45)",
                transition: reduced ? undefined : "transform 0.05s linear",
              }}
            >
              {line}
            </p>
          );
        })}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(16,24,32,0.85)_100%)]"
        />
      </div>
    </ExperienceBand>
  );
}
