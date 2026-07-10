"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const LINES_ES = [
  "> holive init --mode=sacred",
  "> linking brand ↔ systems…",
  "  purity.ok  loyalty.ok  code.ok",
  "> deploy neural.pulse --env=live",
  "  signal sync ████████░░ 82%",
  "> listen --channel=client",
  "  awaiting next move_",
];

const LINES_EN = [
  "> holive init --mode=sacred",
  "> linking brand ↔ systems…",
  "  purity.ok  loyalty.ok  code.ok",
  "> deploy neural.pulse --env=live",
  "  signal sync ████████░░ 82%",
  "> listen --channel=client",
  "  awaiting next move_",
];

type Props = {
  locale?: string;
};

/** Terminal / code-rain moment — Holive brand mono, not a product CLI clone. */
export function TerminalMoment({ locale = "es" }: Props) {
  const t = useTranslations("Widgets.terminal");
  const reduced = usePrefersReducedMotion();
  const source = locale === "en" ? LINES_EN : LINES_ES;
  const [visible, setVisible] = useState(reduced ? source.length : 1);

  useEffect(() => {
    if (reduced) {
      setVisible(source.length);
      return;
    }
    setVisible(1);
    let i = 1;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(Math.min(i, source.length));
      if (i >= source.length) window.clearInterval(id);
    }, 520);
    return () => window.clearInterval(id);
  }, [reduced, source.length]);

  return (
    <div className="overflow-hidden border border-[var(--border)] bg-[#0a0810] text-[var(--holive-white)] shadow-[var(--glow-purple)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[var(--holive-purple)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--holive-gold)]" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <p className="font-mono-code ml-2 text-[0.6rem] tracking-[0.2em] text-white/45">
          {t("title")}
        </p>
      </div>
      <pre className="font-mono-code min-h-[9.5rem] overflow-x-auto p-4 text-[0.72rem] leading-relaxed md:text-[0.8rem]">
        {source.slice(0, visible).map((line, idx) => (
          <div
            key={`${idx}-${line}`}
            className={
              line.startsWith(">")
                ? "text-[var(--holive-gold)]"
                : line.includes("ok")
                  ? "text-[color-mix(in_srgb,#00ff41_75%,white)]"
                  : "text-white/70"
            }
          >
            {line}
            {!reduced && idx === visible - 1 && visible < source.length ? (
              <span className="ml-0.5 inline-block animate-pulse">▌</span>
            ) : null}
            {!reduced &&
            idx === visible - 1 &&
            visible >= source.length ? (
              <span className="ml-0.5 inline-block animate-pulse text-[var(--holive-gold)]">
                ▌
              </span>
            ) : null}
          </div>
        ))}
      </pre>
    </div>
  );
}
