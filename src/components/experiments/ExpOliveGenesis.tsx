"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";

/** EXP-003 — Olive genesis: tap to grow the sacred plant. */
export function ExpOliveGenesis() {
  const t = useTranslations("Experiments.files.seed");
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const max = 3;

  return (
    <ExperimentFile
      id="exp-seed"
      code="EXP-003"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div className="flex flex-col items-center gap-5 rounded-sm border border-[var(--border)] bg-[radial-gradient(circle_at_50%_80%,#1a003d,#0a0810)] px-4 py-8">
        <motion.div
          key={stage}
          className="relative flex h-40 w-40 items-end justify-center"
          initial={reduce ? false : { scale: 0.7, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
          <div className="absolute bottom-0 h-2 w-24 rounded-full bg-[color-mix(in_srgb,var(--holive-gold)_35%,#101820)]" />
          {stage >= 1 && (
            <div className="absolute bottom-2 h-16 w-1.5 rounded-full bg-[var(--holive-gold)]" />
          )}
          {stage >= 2 && (
            <>
              <div className="absolute bottom-14 left-[38%] h-8 w-10 -rotate-25 rounded-[40%] bg-[var(--holive-purple-bright)]/70" />
              <div className="absolute bottom-14 right-[38%] h-8 w-10 rotate-25 rounded-[40%] bg-[var(--holive-purple-bright)]/70" />
            </>
          )}
          {stage >= 3 && (
            <div className="absolute bottom-20 h-14 w-10 rounded-[45%] border-2 border-[var(--holive-gold)] bg-[var(--holive-purple)] shadow-[0_0_24px_rgba(201,168,76,0.35)]" />
          )}
          {stage === 0 && (
            <div className="absolute bottom-3 h-4 w-3 rounded-full bg-[var(--holive-gold)]" />
          )}
        </motion.div>
        <p className="font-display text-lg text-[var(--holive-gold-bright)]">
          {t(`stages.${stage}`)}
        </p>
        <button
          type="button"
          className="focus-ring rounded border border-[var(--holive-gold)] bg-[var(--holive-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--holive-black)]"
          onClick={() => setStage((s) => (s >= max ? 0 : s + 1))}
        >
          {stage >= max ? t("again") : t("plant")}
        </button>
      </div>
    </ExperimentFile>
  );
}
