"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/** Honest weekly-slot pulse — scarcity without fake countdown theater. */
export function SlotsPulse() {
  const t = useTranslations("Consulta.surprise");
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_45%,transparent)] bg-[color-mix(in_srgb,var(--holive-gold)_12%,white)] px-3 py-1.5"
      animate={reduce ? undefined : { boxShadow: ["0 0 0 0 rgba(201,168,76,0)", "0 0 0 8px rgba(201,168,76,0.15)", "0 0 0 0 rgba(201,168,76,0)"] }}
      transition={{ duration: 2.4, repeat: Infinity }}
    >
      <span className="h-2 w-2 rounded-full bg-[var(--holive-gold)]" />
      <span className="font-mono-code text-[0.65rem] uppercase tracking-[0.2em] text-[var(--holive-purple)]">
        {t("slots", { n: 3 })}
      </span>
    </motion.div>
  );
}

/** Interactive: how many hours/day you're the bottleneck → hours Holive frees. */
export function BottleneckMeter() {
  const t = useTranslations("Consulta.surprise");
  const [hours, setHours] = useState(4);
  const freed = Math.round(hours * 0.55 * 5);

  return (
    <div className="rounded-sm border border-[var(--border)] bg-white/80 p-5 shadow-[0_12px_40px_rgba(51,0,114,0.06)] backdrop-blur-sm">
      <p className="font-display text-lg text-[var(--holive-purple)]">{t("meterTitle")}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{t("meterHelp")}</p>
      <div className="mt-6 flex items-center gap-4">
        <input
          type="range"
          min={1}
          max={10}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="h-2 w-full accent-[var(--holive-purple)]"
          aria-label={t("meterTitle")}
        />
        <span className="font-display w-16 shrink-0 text-2xl text-[var(--holive-gold)]">
          {hours}h
        </span>
      </div>
      <motion.p
        key={freed}
        className="font-display mt-5 text-2xl text-[var(--holive-black)] md:text-3xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("meterResult", { n: freed })}
      </motion.p>
    </div>
  );
}

type ResultKey = "r1" | "r2" | "r3";

/** Before → after result flips (industry examples, no confidential names). */
export function ResultFlipCards() {
  const t = useTranslations("Consulta.results");
  const keys: ResultKey[] = ["r1", "r2", "r3"];
  const [open, setOpen] = useState<ResultKey | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {keys.map((k) => {
        const flipped = open === k;
        return (
          <button
            key={k}
            type="button"
            onClick={() => setOpen(flipped ? null : k)}
            className="focus-ring group relative min-h-[11rem] overflow-hidden rounded-sm border border-[var(--border)] bg-white text-left shadow-[0_10px_30px_rgba(51,0,114,0.05)] transition hover:border-[var(--holive-gold)]"
          >
            <div
              className={`absolute inset-0 p-5 transition duration-500 ${flipped ? "pointer-events-none opacity-0" : "opacity-100"}`}
            >
              <p className="font-mono-code text-[0.6rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                {t(`${k}.industry`)}
              </p>
              <p className="font-display mt-3 text-lg text-[var(--holive-purple)]">{t(`${k}.before`)}</p>
              <p className="mt-4 text-xs text-[var(--holive-gold)]">{t("tap")}</p>
            </div>
            <div
              className={`absolute inset-0 bg-[linear-gradient(160deg,#330072,#1a003d)] p-5 text-[var(--holive-white)] transition duration-500 ${flipped ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <p className="font-mono-code text-[0.6rem] uppercase tracking-[0.24em] text-[var(--holive-gold)]">
                {t("after")}
              </p>
              <p className="font-display mt-3 text-2xl text-[var(--holive-gold-bright)]">
                {t(`${k}.metric`)}
              </p>
              <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--holive-white)_85%,transparent)]">
                {t(`${k}.after`)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Cursor-following gold spark near hero CTA. */
export function HeroSparkField({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState({ x: 50, y: 40 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl transition-transform duration-300"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.55), rgba(51,0,114,0.15), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
