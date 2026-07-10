"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type PulseRow = {
  key: "systems" | "courses" | "signals" | "loyalty";
  base: number;
  unit?: string;
};

const ROWS: PulseRow[] = [
  { key: "systems", base: 12 },
  { key: "courses", base: 3 },
  { key: "signals", base: 847 },
  { key: "loyalty", base: 98, unit: "%" },
];

/** Live-feeling status strip — fictional demo metrics with soft pulse. */
export function LivePulse() {
  const t = useTranslations("Widgets.pulse");
  const reduced = usePrefersReducedMotion();
  const [values, setValues] = useState(() =>
    Object.fromEntries(ROWS.map((r) => [r.key, r.base])) as Record<
      PulseRow["key"],
      number
    >,
  );
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setOnline(true);
      setValues((prev) => {
        const next = { ...prev };
        next.signals = prev.signals + (Math.random() > 0.4 ? 1 : 0);
        next.systems = 11 + Math.floor(Math.random() * 3);
        return next;
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2.5">
        <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
          {t("eyebrow")}
        </p>
        <span className="font-mono-code flex items-center gap-1.5 text-[0.65rem]">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              online ? "bg-[var(--matrix-green)]" : "bg-[var(--muted)]"
            }`}
            style={
              online && !reduced
                ? { boxShadow: "0 0 8px rgba(0,255,65,0.55)" }
                : undefined
            }
          />
          {t("status")}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-4">
        {ROWS.map((row) => (
          <li
            key={row.key}
            className="bg-[var(--surface)] px-4 py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--holive-purple)_8%,var(--surface))]"
          >
            <p className="font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--foreground)_45%,transparent)]">
              {t(`rows.${row.key}.label`)}
            </p>
            <p className="font-display mt-2 text-2xl font-semibold tabular-nums text-[var(--holive-purple-bright)] md:text-3xl">
              {values[row.key]}
              {row.unit ?? ""}
            </p>
            <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--foreground)_60%,transparent)]">
              {t(`rows.${row.key}.hint`)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
