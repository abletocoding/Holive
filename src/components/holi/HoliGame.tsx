"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { createBrowserClient } from "@/lib/supabase/client";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STORAGE_KEY = "holive-neural-highscore";
const NODE_COUNT = 4;
const NODE_COLORS = [
  "var(--holive-purple)",
  "var(--holive-gold)",
  "var(--holive-purple-bright)",
  "var(--holive-gold-bright)",
] as const;

type Phase = "idle" | "watch" | "input" | "wrong" | "levelup";

function loadHighScore() {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem(STORAGE_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    /* ignore */
  }
}

function randomNode() {
  return Math.floor(Math.random() * NODE_COUNT);
}

/**
 * Neural Pulse — Simon-like pattern memory.
 * Holi is coach/avatar only; mechanic is purple/gold neural nodes.
 */
export function HoliGame() {
  const t = useTranslations("HoliGame");
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [coach, setCoach] = useState<"idle" | "cheer" | "oops">("idle");

  const sequenceRef = useRef<number[]>([]);
  const inputIdxRef = useRef(0);
  const busyRef = useRef(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    setHighScore(loadHighScore());
  }, []);

  const flashNode = useCallback(async (idx: number, ms = 420) => {
    setLit(idx);
    await new Promise((r) => setTimeout(r, ms));
    setLit(null);
    await new Promise((r) => setTimeout(r, 140));
  }, []);

  const playSequence = useCallback(
    async (seq: number[]) => {
      busyRef.current = true;
      setPhase("watch");
      setCoach("idle");
      await new Promise((r) => setTimeout(r, 350));
      for (const n of seq) {
        await flashNode(n, Math.max(280, 480 - seq.length * 18));
      }
      inputIdxRef.current = 0;
      setPhase("input");
      busyRef.current = false;
    },
    [flashNode],
  );

  const startRound = useCallback(
    (nextLevel: number, baseSeq?: number[]) => {
      const seq = [...(baseSeq ?? sequenceRef.current)];
      while (seq.length < nextLevel) {
        seq.push(randomNode());
      }
      sequenceRef.current = seq;
      setLevel(nextLevel);
      void playSequence(seq);
    },
    [playSequence],
  );

  const start = useCallback(() => {
    sequenceRef.current = [];
    inputIdxRef.current = 0;
    submittedRef.current = false;
    setScore(0);
    setLevel(0);
    setCoach("idle");
    startRound(1, []);
  }, [startRound]);

  const endGame = useCallback(
    (finalScore: number) => {
      setPhase("wrong");
      setCoach("oops");
      const best = Math.max(loadHighScore(), finalScore);
      saveHighScore(best);
      setHighScore(best);

      if (!submittedRef.current && finalScore > 0) {
        submittedRef.current = true;
        const supabase = createBrowserClient();
        if (supabase) {
          void supabase.from("game_scores").insert({
            score: finalScore,
            locale,
            player_name: "Neural",
          });
        }
      }
    },
    [locale],
  );

  const onNode = useCallback(
    async (idx: number) => {
      if (busyRef.current || phase !== "input") return;
      busyRef.current = true;
      await flashNode(idx, 220);

      const expected = sequenceRef.current[inputIdxRef.current];
      if (idx !== expected) {
        busyRef.current = false;
        endGame(score);
        return;
      }

      inputIdxRef.current += 1;
      if (inputIdxRef.current >= sequenceRef.current.length) {
        const gained = sequenceRef.current.length * 10;
        const nextScore = score + gained;
        setScore(nextScore);
        setPhase("levelup");
        setCoach("cheer");
        await new Promise((r) => setTimeout(r, 500));
        busyRef.current = false;
        startRound(sequenceRef.current.length + 1);
        return;
      }

      busyRef.current = false;
    },
    [endGame, flashNode, phase, score, startRound],
  );

  if (reduced) {
    return (
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <HoliMascot className="mx-auto h-16 w-14" />
        <p className="font-display mt-3 text-lg font-semibold">{t("title")}</p>
        <p className="mt-1 text-sm opacity-70">
          {t("highScore")}: {highScore}
        </p>
        <p className="mt-2 text-xs opacity-55">{t("reduced")}</p>
      </div>
    );
  }

  const statusLabel =
    phase === "watch"
      ? t("watch")
      : phase === "input"
        ? t("yourTurn")
        : phase === "wrong"
          ? t("gameOver")
          : phase === "levelup"
            ? t("levelUp")
            : t("subtitle");

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <HoliMascot
            className={`h-12 w-10 shrink-0 transition-transform ${
              coach === "cheer"
                ? "scale-110"
                : coach === "oops"
                  ? "opacity-70"
                  : ""
            }`}
          />
          <div>
            <h3 className="font-display text-xl font-semibold">{t("title")}</h3>
            <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">
              {t("coach")}
            </p>
          </div>
        </div>
        <div className="font-mono-code text-right text-[0.7rem] tracking-wide">
          <div>
            {t("score")}: {score}
          </div>
          <div>
            {t("level")}: {Math.max(level, 1)}
          </div>
          <div className="text-[var(--holive-gold)]">
            {t("highScore")}: {highScore}
          </div>
        </div>
      </div>

      <div
        role="application"
        aria-label={t("title")}
        className="relative overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,#12081f_0%,#07060a_70%)] select-none"
      >
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(155,109,255,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(224,195,90,0.15), transparent 40%)",
            }}
          />
        </div>

        <p className="font-mono-code relative z-10 px-4 pt-3 text-center text-[0.65rem] tracking-[0.2em] text-[color-mix(in_srgb,var(--holive-white)_55%,transparent)]">
          {statusLabel}
        </p>

        <div className="relative z-10 grid grid-cols-2 gap-3 p-5 sm:gap-4 sm:p-6">
          {Array.from({ length: NODE_COUNT }, (_, i) => {
            const isLit = lit === i;
            return (
              <button
                key={i}
                type="button"
                disabled={phase !== "input"}
                aria-label={t("node", { n: i + 1 })}
                onClick={() => void onNode(i)}
                className="focus-ring aspect-square rounded-full border transition disabled:cursor-default"
                style={{
                  background: isLit
                    ? NODE_COLORS[i]
                    : "color-mix(in srgb, #1a003d 80%, black)",
                  borderColor: isLit
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(201,168,76,0.25)",
                  boxShadow: isLit
                    ? `0 0 28px ${NODE_COLORS[i]}, inset 0 0 20px rgba(255,255,255,0.15)`
                    : "inset 0 0 18px rgba(90,42,158,0.25)",
                  transform: isLit ? "scale(1.04)" : "scale(1)",
                }}
              >
                <span
                  className="mx-auto block h-2 w-2 rounded-full"
                  style={{
                    background: isLit
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(201,168,76,0.35)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {(phase === "idle" || phase === "wrong") && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 px-4 text-center">
            <p className="font-display text-lg text-[var(--holive-gold)]">
              {phase === "wrong" ? t("gameOver") : t("title")}
            </p>
            <p className="mt-2 max-w-xs text-xs text-white/70">{t("tap")}</p>
            <button
              type="button"
              className="focus-ring mt-4 bg-[var(--holive-gold)] px-4 py-2 text-xs font-semibold text-[var(--holive-black)]"
              onClick={start}
            >
              {phase === "wrong" ? t("restart") : t("start")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
