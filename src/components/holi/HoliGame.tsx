"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { createBrowserClient } from "@/lib/supabase/client";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFullscreen } from "@/hooks/useFullscreen";
import {
  BINAURAL_META,
  NeuralAmbient,
} from "@/lib/audio/neuralAmbient";

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
 * Neural Pulse — Simon-like pattern memory in an immersive arena.
 * Holi is coach/avatar only; mechanic is purple/gold neural nodes.
 * Audio: 220/226 Hz binaural (6 Hz theta) + zen pad — starts on gesture.
 */
export function HoliGame() {
  const t = useTranslations("HoliGame");
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();

  const [arena, setArena] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [coach, setCoach] = useState<"idle" | "cheer" | "oops">("idle");
  const [audioOn, setAudioOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [fsDenied, setFsDenied] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<NeuralAmbient | null>(null);
  const sequenceRef = useRef<number[]>([]);
  const inputIdxRef = useRef(0);
  const busyRef = useRef(false);
  const submittedRef = useRef(false);

  const { active: isFs, supported: fsSupported, toggle: toggleFs, exit: exitFs } =
    useFullscreen(stageRef);

  useEffect(() => {
    setHighScore(loadHighScore());
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  // Lock body scroll while arena is open (non-native fullscreen)
  useEffect(() => {
    if (!arena) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [arena]);

  const ensureAudio = useCallback(async () => {
    if (!audioRef.current) audioRef.current = new NeuralAmbient();
    await audioRef.current.start({ volume });
    audioRef.current.setMuted(muted);
    setAudioOn(true);
  }, [muted, volume]);

  const stopAudio = useCallback(() => {
    audioRef.current?.stop();
    audioRef.current = null;
    setAudioOn(false);
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

  const start = useCallback(async () => {
    sequenceRef.current = [];
    inputIdxRef.current = 0;
    submittedRef.current = false;
    setScore(0);
    setLevel(0);
    setCoach("idle");
    try {
      await ensureAudio();
    } catch {
      /* autoplay / AudioContext denied — game still playable */
    }
    startRound(1, []);
  }, [ensureAudio, startRound]);

  const endGame = useCallback(
    (finalScore: number) => {
      setPhase("wrong");
      setCoach("oops");
      const best = Math.max(loadHighScore(), finalScore);
      saveHighScore(best);
      setHighScore(best);
      stopAudio();

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
    [locale, stopAudio],
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

  const enterArena = useCallback(() => {
    setArena(true);
    setFsDenied(false);
  }, []);

  const leaveArena = useCallback(async () => {
    await exitFs();
    stopAudio();
    setArena(false);
    setPhase("idle");
    setLit(null);
    setCoach("idle");
    busyRef.current = false;
    sequenceRef.current = [];
  }, [exitFs, stopAudio]);

  const onToggleFs = useCallback(async () => {
    const ok = await toggleFs();
    if (!ok) setFsDenied(true);
    else setFsDenied(false);
  }, [toggleFs]);

  const onToggleMute = useCallback(async () => {
    if (!audioRef.current || !audioOn) {
      try {
        await ensureAudio();
        setMuted(false);
      } catch {
        /* ignore */
      }
      return;
    }
    const next = audioRef.current.toggleMute();
    setMuted(next);
  }, [audioOn, ensureAudio]);

  const onVolume = useCallback((v: number) => {
    setVolume(v);
    audioRef.current?.setVolume(v);
    if (v > 0 && muted) {
      setMuted(false);
      audioRef.current?.setMuted(false);
    }
  }, [muted]);

  // Esc closes arena when not in native fullscreen (browser handles FS exit)
  useEffect(() => {
    if (!arena) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isFs) {
        void leaveArena();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [arena, isFs, leaveArena]);

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

  const playing = phase === "watch" || phase === "input" || phase === "levelup";

  /* —— Footer teaser (not in arena) —— */
  if (!arena) {
    return (
      <div className="relative w-full overflow-hidden rounded-none border border-[color-mix(in_srgb,var(--holive-purple)_35%,transparent)] bg-[linear-gradient(165deg,#0c0618_0%,#07060a_55%,#12081f_100%)]">
        <NeuralBackdrop reduced={reduced} soft />
        <div className="relative z-10 flex flex-col items-center gap-4 px-5 py-10 text-center sm:px-8 sm:py-12">
          <HoliMascot className="h-14 w-11 opacity-90" />
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-wide text-[var(--holive-gold)] sm:text-3xl">
              {t("title")}
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/65">{t("teaser")}</p>
            <p className="font-mono-code mt-3 text-[0.65rem] tracking-[0.2em] text-[var(--holive-gold)]/80">
              {t("highScore")}: {highScore}
            </p>
          </div>
          <button
            type="button"
            className="focus-ring mt-1 min-h-12 bg-[var(--holive-gold)] px-8 py-3 text-sm font-semibold text-[var(--holive-black)]"
            onClick={enterArena}
          >
            {t("enterArena")}
          </button>
          {reduced && (
            <p className="max-w-sm text-xs text-white/45">{t("reduced")}</p>
          )}
        </div>
      </div>
    );
  }

  /* —— Immersive arena (fixed full viewport) —— */
  return (
    <div
      ref={stageRef}
      role="application"
      aria-label={t("title")}
      className="fixed inset-0 z-[80] flex min-h-[100dvh] w-full flex-col bg-[#05030a] text-[var(--holive-white)] select-none"
    >
      <NeuralBackdrop reduced={reduced} />

      {/* Top bar */}
      <header className="relative z-20 flex shrink-0 items-start justify-between gap-3 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <HoliMascot
            className={`h-9 w-7 shrink-0 transition-transform sm:h-11 sm:w-9 ${
              coach === "cheer"
                ? "scale-110"
                : coach === "oops"
                  ? "opacity-70"
                  : ""
            }`}
          />
          <div className="min-w-0">
            <h2 className="font-display truncate text-lg font-semibold sm:text-xl">
              {t("title")}
            </h2>
            <p className="truncate text-[0.65rem] text-white/50 sm:text-xs">
              {t("coach")}
            </p>
          </div>
        </div>

        <div className="font-mono-code shrink-0 text-right text-[0.65rem] tracking-wide sm:text-[0.7rem]">
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
      </header>

      {/* Controls row */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 px-3 pb-2 sm:gap-3 sm:px-5">
        <ControlBtn onClick={() => void onToggleFs()} label={isFs ? t("exitFullscreen") : t("fullscreen")} />
        <ControlBtn
          onClick={() => void onToggleMute()}
          label={muted || !audioOn ? t("unmute") : t("mute")}
        />
        <label className="flex items-center gap-2 rounded border border-white/15 bg-black/35 px-2 py-1.5 text-[0.65rem] text-white/70">
          <span className="sr-only">{t("volume")}</span>
          <span aria-hidden className="opacity-60">
            ♪
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            className="h-1.5 w-20 accent-[var(--holive-gold)] sm:w-28"
            aria-label={t("volume")}
          />
        </label>
        <ControlBtn onClick={() => void leaveArena()} label={t("exitArena")} />
      </div>

      {(fsDenied || !fsSupported) && (
        <p className="relative z-20 px-4 text-center text-[0.65rem] text-white/40">
          {t("fullscreenDenied")}
        </p>
      )}

      <p className="font-mono-code relative z-20 px-4 py-1 text-center text-[0.7rem] tracking-[0.22em] text-[color-mix(in_srgb,var(--holive-gold)_75%,white)] sm:text-xs">
        {statusLabel}
      </p>

      {audioOn && !muted && (
        <p className="relative z-20 px-4 pb-1 text-center text-[0.6rem] tracking-wide text-white/35">
          {t("binauralHint", {
            beat: BINAURAL_META.beatHz,
            carrier: BINAURAL_META.carrierHz,
          })}
        </p>
      )}

      {/* Play field — large touch targets */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-8">
        <div
          className={`relative grid w-full max-w-[min(92vw,28rem)] grid-cols-2 gap-4 sm:gap-6 ${
            // Landscape phones: wider, shorter nodes
            "landscape:max-w-[min(70vh,32rem)] landscape:gap-3"
          }`}
        >
          {Array.from({ length: NODE_COUNT }, (_, i) => {
            const isLit = lit === i;
            return (
              <button
                key={i}
                type="button"
                disabled={phase !== "input"}
                aria-label={t("node", { n: i + 1 })}
                onClick={() => void onNode(i)}
                className="focus-ring aspect-square min-h-[22vw] max-h-[38vh] w-full rounded-full border-2 transition active:scale-[0.98] disabled:cursor-default landscape:min-h-[18vh] landscape:max-h-[36vh] sm:min-h-0"
                style={{
                  background: isLit
                    ? NODE_COLORS[i]
                    : "color-mix(in srgb, #1a003d 80%, black)",
                  borderColor: isLit
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(201,168,76,0.28)",
                  boxShadow: isLit
                    ? `0 0 36px ${NODE_COLORS[i]}, inset 0 0 24px rgba(255,255,255,0.15)`
                    : reduced
                      ? "inset 0 0 18px rgba(90,42,158,0.25)"
                      : "inset 0 0 22px rgba(90,42,158,0.3), 0 0 24px rgba(90,42,158,0.12)",
                  transform: isLit && !reduced ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span
                  className="mx-auto block h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
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
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/55 px-5 text-center backdrop-blur-[2px]">
            <HoliMascot className="mb-3 h-12 w-10 opacity-90" />
            <p className="font-display text-2xl text-[var(--holive-gold)] sm:text-3xl">
              {phase === "wrong" ? t("gameOver") : t("title")}
            </p>
            <p className="mt-3 max-w-sm text-sm text-white/70">{t("tap")}</p>
            <p className="mt-2 max-w-xs text-xs text-white/45">{t("audioNote")}</p>
            <button
              type="button"
              className="focus-ring mt-6 min-h-12 min-w-[10rem] bg-[var(--holive-gold)] px-8 py-3 text-sm font-semibold text-[var(--holive-black)]"
              onClick={() => void start()}
            >
              {phase === "wrong" ? t("restart") : t("start")}
            </button>
          </div>
        )}
      </div>

      {playing && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-3 z-20 opacity-50 sm:bottom-5 sm:left-5"
        >
          <HoliMascot className="h-8 w-6 sm:h-10 sm:w-8" />
        </div>
      )}
    </div>
  );
}

function ControlBtn({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring min-h-10 rounded border border-white/20 bg-black/40 px-3 py-2 text-[0.65rem] font-medium tracking-wide text-white/85 backdrop-blur-sm hover:border-[var(--holive-gold)]/50 hover:text-[var(--holive-gold)] sm:text-xs"
    >
      {label}
    </button>
  );
}

function NeuralBackdrop({
  reduced,
  soft = false,
}: {
  reduced: boolean;
  soft?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: soft
            ? "radial-gradient(ellipse at 30% 20%, rgba(90,42,158,0.35), transparent 50%), radial-gradient(ellipse at 75% 80%, rgba(201,168,76,0.12), transparent 45%), #07060a"
            : "radial-gradient(ellipse at 25% 15%, rgba(90,42,158,0.45), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(201,168,76,0.14), transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(51,0,114,0.35), transparent 40%), #05030a",
        }}
      />
      {!reduced && (
        <>
          <div className="neural-wave absolute -left-1/4 top-[10%] h-[40%] w-[150%] opacity-30" />
          <div className="neural-wave neural-wave--delay absolute -left-1/4 top-[45%] h-[35%] w-[150%] opacity-20" />
          <div className="neural-code absolute inset-0 opacity-[0.07]" />
        </>
      )}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,65,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
