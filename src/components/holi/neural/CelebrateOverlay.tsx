"use client";

import type { ReactNode } from "react";
import { HoliMascot } from "@/components/holi/HoliMascot";
import type { Reward } from "@/lib/game/rewards";

type Phase = "wrong" | "cleared" | "victory" | "paused";

type Props = {
  phase: Phase;
  reduced: boolean;
  insight: { title: string; body: string };
  reward: Reward | null;
  score: number;
  levelId: number;
  locale: string;
  copied: boolean;
  showLead: boolean;
  leadSlot: ReactNode;
  labels: {
    gameOver: string;
    paused: string;
    victory: string;
    levelCleared: string;
    insightLabel: string;
    rewardTitle: string;
    rewardBlurb: string;
    copyCert: string;
    copied: string;
    tap: string;
    resume: string;
    restart: string;
    nextLevel: string;
    levelsBtn: string;
    celebrateHint: string;
    certEyebrow: string;
  };
  canNext: boolean;
  onResume: () => void;
  onRestart: () => void;
  onNext: () => void;
  onHub: () => void;
  onCopyCert: () => void;
};

/**
 * Win / clear / pause overlay — certificate presentation + Holi celebrate,
 * not a flat form dump.
 */
export function CelebrateOverlay({
  phase,
  reduced,
  insight,
  reward,
  score: _score,
  levelId: _levelId,
  locale: _locale,
  copied,
  showLead,
  leadSlot,
  labels,
  canNext,
  onResume,
  onRestart,
  onNext,
  onHub,
  onCopyCert,
}: Props) {
  void _score;
  void _levelId;
  void _locale;
  const win = phase === "cleared" || phase === "victory";
  const title =
    phase === "wrong"
      ? labels.gameOver
      : phase === "paused"
        ? labels.paused
        : phase === "victory"
          ? labels.victory
          : labels.levelCleared;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto overscroll-contain bg-[radial-gradient(ellipse_at_center,rgba(20,10,40,0.72),rgba(0,0,0,0.78))] px-4 py-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center backdrop-blur-[3px]">
      <div
        className={`neural-celebrate-panel relative my-auto flex w-full max-w-md flex-col items-center ${
          win && !reduced ? "neural-celebrate-in" : "animate-[fadeIn_0.4s_ease]"
        }`}
      >
        {win && !reduced && (
          <div aria-hidden className="neural-cert-rays pointer-events-none absolute inset-[-20%] opacity-60" />
        )}

        <div
          className={`relative ${win && !reduced ? "neural-holi-pop" : ""}`}
        >
          <HoliMascot
            pose={
              phase === "wrong"
                ? "think"
                : phase === "paused"
                  ? "guide"
                  : "celebrate"
            }
            className={`mb-3 h-16 w-12 opacity-95 sm:h-[4.5rem] sm:w-14 ${
              win && !reduced ? "holi-bob" : ""
            }`}
          />
        </div>

        <p className="font-display text-2xl tracking-wide text-[var(--holive-gold)] sm:text-3xl">
          {title}
        </p>

        {win && (
          <p className="mt-1 max-w-xs text-[0.7rem] tracking-wide text-white/45">
            {labels.celebrateHint}
          </p>
        )}

        {win && (
          <div className="mt-5 w-full max-w-sm">
            <p className="font-mono-code text-[0.55rem] tracking-[0.24em] text-white/40 uppercase">
              {labels.insightLabel}
            </p>
            <p className="mt-1 text-base font-medium text-[var(--holive-gold)]">
              {insight.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {insight.body}
            </p>
          </div>
        )}

        {reward && win && (
          <div
            className={`neural-cert-card mt-5 w-full max-w-sm border border-[var(--holive-gold)]/40 bg-[linear-gradient(160deg,rgba(201,168,76,0.14),rgba(12,6,24,0.85)_45%,rgba(90,42,158,0.2))] px-5 py-4 ${
              !reduced ? "neural-cert-reveal" : ""
            }`}
          >
            <p className="font-mono-code text-[0.55rem] tracking-[0.28em] text-[var(--holive-gold)]/75 uppercase">
              {labels.certEyebrow}
            </p>
            <p className="mt-2 font-display text-lg text-[var(--holive-gold)]">
              {labels.rewardTitle}
            </p>
            <p className="mt-2 font-mono-code text-sm tracking-[0.18em] text-[var(--holive-gold-bright)]">
              {reward.code}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/55">
              {labels.rewardBlurb}
            </p>
            {reward.kind === "certificate" && (
              <button
                type="button"
                className="focus-ring mt-3 text-xs text-white/70 underline decoration-[var(--holive-gold)]/50"
                onClick={onCopyCert}
              >
                {copied ? labels.copied : labels.copyCert}
              </button>
            )}
          </div>
        )}

        {showLead && win && (
          <div className="mt-5 w-full max-w-sm border border-white/10 bg-black/35 px-4 py-3">
            {leadSlot}
          </div>
        )}

        {phase === "wrong" && (
          <p className="mt-3 max-w-sm text-sm text-white/70">{labels.tap}</p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {phase === "paused" && (
            <button
              type="button"
              className="focus-ring min-h-12 min-w-[8rem] bg-[var(--holive-gold)] px-6 py-3 text-sm font-semibold text-[var(--holive-black)]"
              onClick={onResume}
            >
              {labels.resume}
            </button>
          )}
          {phase === "wrong" && (
            <button
              type="button"
              className="focus-ring min-h-12 min-w-[8rem] bg-[var(--holive-gold)] px-6 py-3 text-sm font-semibold text-[var(--holive-black)]"
              onClick={onRestart}
            >
              {labels.restart}
            </button>
          )}
          {win && canNext && (
            <button
              type="button"
              className="focus-ring min-h-12 min-w-[8rem] bg-[var(--holive-gold)] px-6 py-3 text-sm font-semibold text-[var(--holive-black)]"
              onClick={onNext}
            >
              {labels.nextLevel}
            </button>
          )}
          <button
            type="button"
            className="focus-ring min-h-12 border border-white/25 px-5 py-3 text-sm text-white/80"
            onClick={onHub}
          >
            {labels.levelsBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
