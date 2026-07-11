"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { NeuralBoard } from "@/components/holi/neural/NeuralBoard";
import { TrainHub } from "@/components/holi/neural/TrainHub";
import { FreestyleDrum } from "@/components/holi/neural/FreestyleDrum";
import { NeuralEffects } from "@/components/holi/neural/NeuralEffects";
import { LeadCapture } from "@/components/holi/neural/LeadCapture";
import { CelebrateOverlay } from "@/components/holi/neural/CelebrateOverlay";
import { createBrowserClient } from "@/lib/supabase/client";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFullscreen } from "@/hooks/useFullscreen";
import { NeuralAmbient, bedMeta } from "@/lib/audio/neuralAmbient";
import { BUSINESS_MANTRAS, mantraForLocale } from "@/lib/game/mantras";
import {
  FINAL_LEVEL_ID,
  LEVELS,
  getLevel,
  randomNode,
  type LevelDef,
} from "@/lib/game/levels";
import { insightForLevel, insightText } from "@/lib/game/insights";
import {
  mintReward,
  shareableCertificate,
  type Reward,
} from "@/lib/game/rewards";
import {
  addReward,
  loadProgress,
  markRunComplete,
  recordScore,
  saveProgress,
  unlockLevel,
  type PulseProgress,
} from "@/lib/game/progress";
import { themeForLevel } from "@/lib/game/levelThemes";
import {
  loadFreestyleKit,
  saveFreestyleKit,
  type FreestyleKit,
  type FreestylePad,
} from "@/lib/game/freestyleKit";
import {
  loadDailyMissions,
  recordMissionEvent,
  type Mission,
} from "@/lib/game/missions";

type Phase =
  | "train"
  | "hub"
  | "freestyle"
  | "idle"
  | "watch"
  | "input"
  | "wrong"
  | "levelup"
  | "cleared"
  | "victory"
  | "paused";

/**
 * Neural Pulse — multi-level pattern memory arena.
 * Holi coaches; purple/gold nodes; binaural beds + singing bowl.
 */
export function HoliGame() {
  const t = useTranslations("HoliGame");
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();

  const [arena, setArena] = useState(false);
  const [progress, setProgress] = useState<PulseProgress>(() => ({
    unlockedLevel: 1,
    highScore: 0,
    levelBest: {},
    rewards: [],
    completedRun: false,
    deepProgress: false,
  }));
  const [levelId, setLevelId] = useState(1);
  const [score, setScore] = useState(0);
  const [seqLen, setSeqLen] = useState(0);
  const [phase, setPhase] = useState<Phase>("train");
  const [lit, setLit] = useState<number | null>(null);
  const [distractor, setDistractor] = useState<number | null>(null);
  const [coach, setCoach] = useState<"idle" | "cheer" | "oops">("idle");
  const [audioOn, setAudioOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [fsDenied, setFsDenied] = useState(false);
  const [mantraIdx, setMantraIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [goldBurst, setGoldBurst] = useState(0);
  const [shake, setShake] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showLead, setShowLead] = useState(false);
  const [copied, setCopied] = useState(false);
  const [missions, setMissions] = useState<Mission[]>(() => loadDailyMissions());
  const [freestyleKit, setFreestyleKit] = useState<FreestyleKit>(() =>
    loadFreestyleKit(),
  );
  const [freestyleHits, setFreestyleHits] = useState(0);
  const [freestyleSeconds, setFreestyleSeconds] = useState(0);
  const [activePad, setActivePad] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<NeuralAmbient | null>(null);
  const sequenceRef = useRef<number[]>([]);
  const inputIdxRef = useRef(0);
  const busyRef = useRef(false);
  const submittedRef = useRef(false);
  const pausePhaseRef = useRef<Phase>("idle");
  const scoreRef = useRef(0);
  const abortWatchRef = useRef(false);
  const freestyleSecondsRef = useRef(0);
  const freestyleSavedSecondsRef = useRef(0);
  const metronomeBeatRef = useRef(0);

  const level: LevelDef = getLevel(levelId);
  const theme = themeForLevel(levelId);
  const { active: isFs, supported: fsSupported, toggle: toggleFs, exit: exitFs } =
    useFullscreen(stageRef);

  useEffect(() => {
    setProgress(loadProgress());
    setMissions(loadDailyMissions());
    setFreestyleKit(loadFreestyleKit());
  }, []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    saveFreestyleKit(freestyleKit);
  }, [freestyleKit]);

  useEffect(() => {
    freestyleSecondsRef.current = freestyleSeconds;
  }, [freestyleSeconds]);

  useEffect(() => {
    if (!arena || phase !== "freestyle") return;
    const id = window.setInterval(() => {
      setFreestyleSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [arena, phase]);

  useEffect(() => {
    if (!arena || phase !== "freestyle" || !freestyleKit.metronome) return;
    const beatMs = Math.max(320, Math.round(60000 / freestyleKit.tempo));
    const id = window.setInterval(() => {
      audioRef.current?.playMetronomeClick(metronomeBeatRef.current % 4 === 0);
      metronomeBeatRef.current += 1;
    }, beatMs);
    return () => window.clearInterval(id);
  }, [arena, freestyleKit.metronome, freestyleKit.tempo, phase]);

  useEffect(() => {
    if (!arena) return;
    const id = window.setInterval(() => {
      setMantraIdx((i) => (i + 1) % BUSINESS_MANTRAS.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [arena]);

  useEffect(() => {
    if (!arena) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [arena]);

  const ensureAudio = useCallback(
    async (bed = level.audioBed) => {
      if (!audioRef.current) audioRef.current = new NeuralAmbient();
      await audioRef.current.start({ volume, bed });
      audioRef.current.setMuted(muted);
      setAudioOn(true);
    },
    [level.audioBed, muted, volume],
  );

  const stopAudio = useCallback(() => {
    audioRef.current?.stop();
    audioRef.current = null;
    setAudioOn(false);
  }, []);

  const bowlHit = useCallback((idx: number) => {
    audioRef.current?.playBowlHit(idx);
  }, []);

  const recordClassicScore = useCallback((finalScore: number) => {
    if (finalScore <= 0) return;
    setMissions(recordMissionEvent({ type: "classicScore", score: finalScore }));
  }, []);

  const finishFreestyleSession = useCallback(() => {
    const seconds = freestyleSecondsRef.current;
    const unsaved = seconds - freestyleSavedSecondsRef.current;
    if (unsaved <= 0) return;
    freestyleSavedSecondsRef.current = seconds;
    setMissions(recordMissionEvent({ type: "freestyleSession", seconds: unsaved }));
  }, []);

  const enterTrain = useCallback(() => {
    abortWatchRef.current = true;
    finishFreestyleSession();
    stopAudio();
    setPhase("train");
    setLit(null);
    setDistractor(null);
    setCoach("idle");
    busyRef.current = false;
  }, [finishFreestyleSession, stopAudio]);

  const enterClassicHub = useCallback(() => {
    abortWatchRef.current = true;
    finishFreestyleSession();
    stopAudio();
    setPhase("hub");
    setLit(null);
    setDistractor(null);
    setCoach("idle");
    busyRef.current = false;
  }, [finishFreestyleSession, stopAudio]);

  const enterFreestyle = useCallback(async () => {
    abortWatchRef.current = true;
    setPhase("freestyle");
    setScore(0);
    setSeqLen(0);
    setStreak(0);
    setReward(null);
    setShowLead(false);
    setCoach("cheer");
    setActivePad(null);
    setFreestyleHits(0);
    setFreestyleSeconds(0);
    freestyleSecondsRef.current = 0;
    freestyleSavedSecondsRef.current = 0;
    metronomeBeatRef.current = 0;
    try {
      await ensureAudio("heal");
      await audioRef.current?.setBed("heal");
    } catch {
      /* autoplay denied */
    }
  }, [ensureAudio]);

  const onFreestylePad = useCallback(
    async (pad: FreestylePad, index: number) => {
      if (!audioRef.current || !audioOn) {
        try {
          await ensureAudio("heal");
        } catch {
          /* autoplay denied */
        }
      }
      audioRef.current?.playFreestyleHit(index, pad.tone);
      setActivePad(pad.id);
      window.setTimeout(() => setActivePad((current) => (current === pad.id ? null : current)), 180);
      setFreestyleHits((hits) => hits + 1);
      setMissions(recordMissionEvent({ type: "freestyleHit" }));
      setPulse(0.55);
      window.setTimeout(() => setPulse(0), 150);
    },
    [audioOn, ensureAudio],
  );

  const flashFx = useCallback((intensity = 0.7) => {
    setPulse(intensity);
    window.setTimeout(() => setPulse(0), 180);
  }, []);

  const flashNode = useCallback(
    async (idx: number, ms: number, gap: number) => {
      if (abortWatchRef.current) return;
      setLit(idx);
      bowlHit(idx);
      flashFx(0.55);
      await new Promise((r) => setTimeout(r, ms));
      setLit(null);
      await new Promise((r) => setTimeout(r, gap));
    },
    [bowlHit, flashFx],
  );

  const playSequence = useCallback(
    async (seq: number[], def: LevelDef) => {
      busyRef.current = true;
      abortWatchRef.current = false;
      setPhase("watch");
      setCoach("idle");
      await new Promise((r) => setTimeout(r, 320));
      for (let i = 0; i < seq.length; i++) {
        if (abortWatchRef.current) {
          busyRef.current = false;
          return;
        }
        const n = seq[i]!;
        await flashNode(n, def.flashMs, def.gapMs);
        if (def.distractors && Math.random() < 0.35) {
          let fake = randomNode(def.nodes);
          while (fake === n) fake = randomNode(def.nodes);
          setDistractor(fake);
          await new Promise((r) => setTimeout(r, Math.max(80, def.flashMs * 0.35)));
          setDistractor(null);
        }
      }
      if (abortWatchRef.current) {
        busyRef.current = false;
        return;
      }
      inputIdxRef.current = 0;
      setPhase("input");
      busyRef.current = false;
    },
    [flashNode],
  );

  const startRound = useCallback(
    (def: LevelDef, nextLen: number, baseSeq?: number[]) => {
      const seq = [...(baseSeq ?? sequenceRef.current)];
      while (seq.length < nextLen) {
        seq.push(randomNode(def.nodes));
      }
      // trim if restarting shorter
      if (seq.length > nextLen) seq.length = nextLen;
      sequenceRef.current = seq;
      setSeqLen(seq.length);
      setMantraIdx((i) => (i + 1) % BUSINESS_MANTRAS.length);
      void playSequence(seq, def);
    },
    [playSequence],
  );

  const startLevel = useCallback(
    async (id: number) => {
      const def = getLevel(id);
      sequenceRef.current = [];
      inputIdxRef.current = 0;
      submittedRef.current = false;
      abortWatchRef.current = false;
      setLevelId(id);
      setScore(0);
      setStreak(0);
      setReward(null);
      setShowLead(false);
      setCopied(false);
      setCoach("idle");
      setMantraIdx(Math.floor(Math.random() * BUSINESS_MANTRAS.length));
      try {
        await ensureAudio(def.audioBed);
        await audioRef.current?.setBed(def.audioBed);
      } catch {
        /* autoplay denied */
      }
      setPhase("idle");
      // brief beat then auto-start
      window.setTimeout(() => {
        startRound(def, def.startLen, []);
      }, 80);
    },
    [ensureAudio, startRound],
  );

  const onMiss = useCallback(
    (finalScore: number) => {
      setPhase("wrong");
      setCoach("oops");
      setStreak(0);
      setShake(0.85);
      window.setTimeout(() => setShake(0), 400);
      const next = recordScore(progress, levelId, finalScore);
      recordClassicScore(finalScore);
      setProgress(next);
      if (!submittedRef.current && finalScore > 0) {
        submittedRef.current = true;
        const supabase = createBrowserClient();
        if (supabase) {
          void supabase.from("game_scores").insert({
            score: finalScore,
            locale,
            player_name: `Neural-L${levelId}`,
          });
        }
      }
    },
    [locale, levelId, progress, recordClassicScore],
  );

  const onLevelCleared = useCallback(
    (finalScore: number) => {
      audioRef.current?.playCelebrate();
      setGoldBurst((n) => n + 1);
      setPulse(1);
      window.setTimeout(() => setPulse(0), 400);
      setCoach("cheer");
      setPhase("cleared");

      let next = unlockLevel(progress, levelId + 1);
      next = recordScore(next, levelId, finalScore);
      recordClassicScore(finalScore);
      setMissions(recordMissionEvent({ type: "classicClear" }));

      const minted = mintReward({
        level: levelId,
        score: finalScore,
        clearedAll: levelId >= FINAL_LEVEL_ID,
      });
      if (minted) {
        next = addReward(next, minted);
        setReward(minted);
      }

      if (levelId >= FINAL_LEVEL_ID) {
        next = markRunComplete(next);
        setPhase("victory");
        setShowLead(true);
      } else if (next.deepProgress && levelId >= 4) {
        setShowLead(true);
      }

      setProgress(next);
      saveProgress(next);
    },
    [levelId, progress, recordClassicScore],
  );

  const onNode = useCallback(
    async (idx: number) => {
      if (busyRef.current || phase !== "input") return;
      busyRef.current = true;
      const def = getLevel(levelId);
      await flashNode(idx, Math.max(160, def.flashMs * 0.55), def.gapMs * 0.5);

      const expected = sequenceRef.current[inputIdxRef.current];
      if (idx !== expected) {
        busyRef.current = false;
        onMiss(scoreRef.current);
        return;
      }

      inputIdxRef.current += 1;
      if (inputIdxRef.current >= sequenceRef.current.length) {
        const gained = Math.round(
          sequenceRef.current.length * 10 * def.scoreMult,
        );
        const nextScore = scoreRef.current + gained;
        setScore(nextScore);
        scoreRef.current = nextScore;
        setStreak((s) => {
          const n = s + 1;
          if (n >= 2) setGoldBurst((g) => g + 1);
          return n;
        });

        if (sequenceRef.current.length >= def.clearLen) {
          busyRef.current = false;
          onLevelCleared(nextScore);
          return;
        }

        setPhase("levelup");
        setCoach("cheer");
        await new Promise((r) => setTimeout(r, 480));
        busyRef.current = false;
        startRound(def, sequenceRef.current.length + 1);
        return;
      }

      busyRef.current = false;
    },
    [flashNode, levelId, onLevelCleared, onMiss, phase, startRound],
  );

  const enterArena = useCallback(() => {
    setArena(true);
    setFsDenied(false);
    setPhase("train");
    setMantraIdx(Math.floor(Math.random() * BUSINESS_MANTRAS.length));
  }, []);

  const leaveArena = useCallback(async () => {
    abortWatchRef.current = true;
    finishFreestyleSession();
    await exitFs();
    stopAudio();
    setArena(false);
    setPhase("train");
    setLit(null);
    setDistractor(null);
    setCoach("idle");
    busyRef.current = false;
    sequenceRef.current = [];
  }, [exitFs, finishFreestyleSession, stopAudio]);

  const pause = useCallback(() => {
    if (phase === "watch" || phase === "input" || phase === "levelup") {
      pausePhaseRef.current = phase;
      abortWatchRef.current = true;
      setPhase("paused");
      busyRef.current = false;
      setLit(null);
      setDistractor(null);
    }
  }, [phase]);

  const resume = useCallback(() => {
    if (phase !== "paused") return;
    const def = getLevel(levelId);
    void playSequence(sequenceRef.current, def);
  }, [levelId, phase, playSequence]);

  const onToggleFs = useCallback(async () => {
    const ok = await toggleFs();
    if (!ok) setFsDenied(true);
    else setFsDenied(false);
  }, [toggleFs]);

  const onToggleMute = useCallback(async () => {
    if (!audioRef.current || !audioOn) {
      try {
        await ensureAudio(phase === "freestyle" ? "heal" : level.audioBed);
        setMuted(false);
        audioRef.current?.setMuted(false);
      } catch {
        /* ignore */
      }
      return;
    }
    const next = audioRef.current.toggleMute();
    setMuted(next);
  }, [audioOn, ensureAudio, level.audioBed, phase]);

  const onVolume = useCallback(
    (v: number) => {
      setVolume(v);
      audioRef.current?.setVolume(v);
      if (v > 0 && muted) {
        setMuted(false);
        audioRef.current?.setMuted(false);
      }
    },
    [muted],
  );

  useEffect(() => {
    if (!arena) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isFs) {
        if (phase === "paused") resume();
        else if (phase === "watch" || phase === "input") pause();
        else void leaveArena();
      }
      if (e.key === "p" || e.key === "P") {
        if (phase === "paused") resume();
        else pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [arena, isFs, leaveArena, pause, phase, resume]);

  const currentMeta =
    audioOn && audioRef.current
      ? audioRef.current.bedMeta
      : bedMeta(phase === "freestyle" ? "heal" : level.audioBed);
  const mantra = mantraForLocale(BUSINESS_MANTRAS[mantraIdx]!, locale);
  const insight = insightText(insightForLevel(levelId), locale);

  const statusLabel =
    phase === "watch"
      ? t("watch")
      : phase === "input"
        ? t("yourTurn")
        : phase === "wrong"
          ? t("gameOver")
          : phase === "levelup"
            ? t("levelUp")
            : phase === "cleared"
              ? t("levelCleared")
              : phase === "victory"
                ? t("victory")
                : phase === "paused"
                  ? t("paused")
                  : phase === "freestyle"
                    ? t("freestyle.status")
                    : phase === "hub"
                      ? t("selectLevel")
                      : phase === "train"
                        ? t("train.status")
                        : t("subtitle");

  const playing =
    phase === "watch" || phase === "input" || phase === "levelup";

  if (!arena) {
    return (
      <div className="relative w-full overflow-hidden rounded-none border border-[color-mix(in_srgb,var(--holive-purple)_35%,transparent)] bg-[linear-gradient(165deg,#0c0618_0%,#07060a_55%,#12081f_100%)]">
        <NeuralBackdrop reduced={reduced} soft theme={themeForLevel(1)} />
        <div className="relative z-10 flex flex-col items-center gap-4 px-5 py-10 text-center sm:px-8 sm:py-12">
          <HoliMascot pose="guide" className="h-16 w-12 opacity-90" />
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-wide text-[var(--holive-gold)] sm:text-3xl">
              {t("title")}
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/65">{t("teaser")}</p>
            <p className="font-mono-code mt-3 text-[0.65rem] tracking-[0.2em] text-[var(--holive-gold)]/80">
              {t("highScore")}: {progress.highScore} · {t("unlocked")}:{" "}
              {progress.unlockedLevel}/{LEVELS.length}
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

  return (
    <div
      ref={stageRef}
      role="application"
      aria-label={t("title")}
      className={`neural-shake-target fixed inset-0 z-[var(--z-overlay-game)] grid min-h-[100dvh] w-full grid-rows-[auto_auto_minmax(0,1fr)] bg-[#05030a] text-[var(--holive-white)] select-none ${shake > 0 ? "neural-shaking" : ""}`}
    >
      <NeuralBackdrop
        reduced={reduced}
        parallax={!reduced}
        theme={theme}
        levelId={phase === "hub" || phase === "train" || phase === "freestyle" ? 0 : levelId}
      />
      <NeuralEffects
        reduced={reduced}
        pulse={pulse}
        goldBurst={goldBurst}
        shake={shake}
        theme={theme}
        celebrate={phase === "cleared" || phase === "victory"}
        ambient={phase !== "hub" && phase !== "train" && phase !== "paused"}
      />

      <div className="relative z-20 flex flex-col gap-1.5 px-3 pt-[max(0.65rem,env(safe-area-inset-top))] sm:px-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <HoliMascot
            pose={
              coach === "cheer"
                ? "celebrate"
                : coach === "oops"
                  ? "think"
                  : phase === "hub" || phase === "train"
                    ? "wave"
                    : "guide"
            }
            className={`h-10 w-8 shrink-0 transition-transform sm:h-12 sm:w-9 ${
              coach === "cheer" && !reduced
                ? "scale-110 holi-bob"
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
              {phase === "train"
                ? t("train.coach")
                : phase === "hub"
                  ? t("hub.coach")
                  : phase === "freestyle"
                    ? t("freestyle.coach")
                    : t(`levels.${level.key}.name` as "levels.seed.name")}
            </p>
          </div>
        </div>

        <div className="font-mono-code shrink-0 text-right text-[0.65rem] tracking-wide sm:text-[0.7rem]">
          <div>
            {phase === "freestyle" ? t("freestyle.hits") : t("score")}:{" "}
            {phase === "freestyle" ? freestyleHits : score}
          </div>
          <div>
            {phase === "freestyle"
              ? `${t("freestyle.session")}: ${Math.floor(freestyleSeconds / 60)}:${String(
                  freestyleSeconds % 60,
                ).padStart(2, "0")}`
              : `${t("level")}: ${levelId}${seqLen > 0 ? ` · ${seqLen}/${level.clearLen}` : ""}`}
          </div>
          <div className="text-[var(--holive-gold)]">
            {t("highScore")}: {progress.highScore}
          </div>
          {streak >= 2 && (
            <div className="text-[var(--holive-gold-bright)]">
              {t("streak")}: {streak}
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-1.5 pb-1 sm:gap-2">
        <ControlBtn
          onClick={() => void onToggleFs()}
          label={isFs ? t("exitFullscreen") : t("fullscreen")}
        />
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
        {playing && <ControlBtn onClick={pause} label={t("pause")} />}
        {phase === "paused" && <ControlBtn onClick={resume} label={t("resume")} />}
        {(playing || phase === "paused" || phase === "wrong") && (
          <ControlBtn
            onClick={() => {
              abortWatchRef.current = true;
              void startLevel(levelId);
            }}
            label={t("restart")}
          />
        )}
        {phase !== "train" && <ControlBtn onClick={enterTrain} label={t("levelsBtn")} />}
        <ControlBtn onClick={() => void leaveArena()} label={t("exitArena")} />
      </div>
      </div>

      <div className="relative z-20 flex flex-col items-center gap-1 px-3">
      {(fsDenied || !fsSupported) && (
        <p className="px-2 text-center text-[0.65rem] text-white/40">
          {t("fullscreenDenied")}
        </p>
      )}

      <p className="font-mono-code px-2 py-0.5 text-center text-[0.7rem] tracking-[0.22em] text-[color-mix(in_srgb,var(--holive-gold)_75%,white)] sm:text-xs">
        {statusLabel}
      </p>

      {phase !== "hub" && phase !== "train" && (
        <div
          key={mantraIdx}
          className="mx-auto max-w-lg px-3 pb-1 text-center animate-[fadeIn_0.6s_ease]"
          aria-live="polite"
        >
          <p className="font-mono-code text-[0.55rem] tracking-[0.28em] text-white/35 uppercase">
            {t("mantraLabel")}
          </p>
          <p className="mt-1 text-sm leading-snug text-[color-mix(in_srgb,var(--holive-gold)_85%,white)] sm:text-base">
            “{mantra}”
          </p>
        </div>
      )}

      {audioOn && !muted && phase !== "hub" && phase !== "train" && (
        <p className="px-2 pb-0.5 text-center text-[0.6rem] tracking-wide text-white/35">
          {t("binauralHint", {
            beat: currentMeta.beatHz,
            carrier: currentMeta.carrierHz,
          })}
        </p>
      )}
      </div>

      <div className="relative z-10 flex min-h-0 items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1 sm:px-8">
        {phase === "train" ? (
          <TrainHub
            highScore={progress.highScore}
            unlockedLevel={progress.unlockedLevel}
            totalLevels={LEVELS.length}
            missions={missions}
            labels={{
              eyebrow: t("train.eyebrow"),
              title: t("train.title"),
              subtitle: t("train.subtitle"),
              classicTitle: t("train.classicTitle"),
              classicBody: t("train.classicBody"),
              classicCta: t("train.classicCta"),
              freestyleTitle: t("train.freestyleTitle"),
              freestyleBody: t("train.freestyleBody"),
              freestyleCta: t("train.freestyleCta"),
              missionsTitle: t("missions.title"),
              completed: t("missions.completed"),
              highScore: t("highScore"),
              unlocked: t("unlocked"),
              mission: {
                classicClears: t("missions.classicClears"),
                classicScore: t("missions.classicScore"),
                freestyleHits: t("missions.freestyleHits"),
                freestyleSeconds: t("missions.freestyleSeconds"),
              },
            }}
            onClassic={enterClassicHub}
            onFreestyle={() => void enterFreestyle()}
          />
        ) : phase === "hub" ? (
          <LevelSelect
            progress={progress}
            onPick={(id) => void startLevel(id)}
            t={t}
            onTrain={enterTrain}
          />
        ) : phase === "freestyle" ? (
          <FreestyleDrum
            kit={freestyleKit}
            activePad={activePad}
            hits={freestyleHits}
            sessionSeconds={freestyleSeconds}
            reduced={reduced}
            labels={{
              title: t("freestyle.title"),
              subtitle: t("freestyle.subtitle"),
              hits: t("freestyle.hits"),
              session: t("freestyle.session"),
              tempo: t("freestyle.tempo"),
              metronome: t("freestyle.metronome"),
              metronomeOn: t("freestyle.metronomeOn"),
              metronomeOff: t("freestyle.metronomeOff"),
              theme: t("freestyle.theme"),
              pad: t("freestyle.pad"),
            }}
            onPad={(pad, index) => void onFreestylePad(pad, index)}
            onKitChange={setFreestyleKit}
          />
        ) : (
          <NeuralBoard
            level={level}
            lit={lit}
            distractor={distractor}
            phase={phase}
            reduced={reduced}
            streak={streak}
            onNode={(i) => void onNode(i)}
            disabled={phase !== "input"}
            nodeLabel={(n) => t("node", { n })}
          />
        )}

        {(phase === "wrong" ||
          phase === "cleared" ||
          phase === "victory" ||
          phase === "paused") && (
          <CelebrateOverlay
            phase={phase as "wrong" | "cleared" | "victory" | "paused"}
            reduced={reduced}
            insight={insight}
            reward={reward}
            score={score}
            levelId={levelId}
            locale={locale}
            copied={copied}
            showLead={
              !!(
                showLead &&
                (phase === "cleared" || phase === "victory") &&
                (progress.deepProgress || progress.completedRun)
              )
            }
            leadSlot={
              <LeadCapture
                score={score}
                level={levelId}
                onDone={() => setShowLead(false)}
                onSkip={() => setShowLead(false)}
              />
            }
            labels={{
              gameOver: t("gameOver"),
              paused: t("paused"),
              victory: t("victory"),
              levelCleared: t("levelCleared"),
              insightLabel: t("insightLabel"),
              rewardTitle: reward
                ? t(`rewards.${reward.key}.title` as "rewards.certificate.title")
                : "",
              rewardBlurb: reward
                ? t(`rewards.${reward.key}.blurb` as "rewards.certificate.blurb")
                : "",
              copyCert: t("copyCert"),
              copied: t("copied"),
              tap: t("tap"),
              resume: t("resume"),
              restart: t("restart"),
              nextLevel: t("nextLevel"),
              levelsBtn: t("levelsBtn"),
              celebrateHint: t("celebrateHint"),
              certEyebrow: t("certEyebrow"),
            }}
            canNext={levelId < FINAL_LEVEL_ID}
            onResume={resume}
            onRestart={() => void startLevel(levelId)}
            onNext={() => void startLevel(levelId + 1)}
            onHub={() => {
              enterTrain();
              setShowLead(false);
            }}
            onCopyCert={async () => {
              if (!reward) return;
              const text = shareableCertificate({
                code: reward.code,
                score,
                level: levelId,
                locale,
              });
              try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
              } catch {
                /* ignore */
              }
            }}
          />
        )}
      </div>

      {playing && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-3 z-20 opacity-50 sm:bottom-5 sm:left-5"
        >
          <HoliMascot
            pose="celebrate"
            className={`h-10 w-8 sm:h-12 sm:w-9 ${reduced ? "" : "holi-bob"}`}
          />
        </div>
      )}
    </div>
  );
}

function LevelSelect({
  progress,
  onPick,
  onTrain,
  t,
}: {
  progress: PulseProgress;
  onPick: (id: number) => void;
  onTrain: () => void;
  t: ReturnType<typeof useTranslations<"HoliGame">>;
}) {
  return (
    <div className="relative z-20 w-full max-w-lg px-1">
      <button
        type="button"
        onClick={onTrain}
        className="focus-ring mx-auto mb-3 block min-h-10 border border-white/20 bg-black/35 px-4 text-xs text-white/75 hover:border-[var(--holive-gold)]/50"
      >
        {t("hub.backToTrain")}
      </button>
      <p className="mb-4 text-center text-sm text-white/65">{t("selectBlurb")}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LEVELS.map((lv) => {
          const locked = lv.id > progress.unlockedLevel;
          const best = progress.levelBest[String(lv.id)];
          return (
            <button
              key={lv.id}
              type="button"
              disabled={locked}
              onClick={() => onPick(lv.id)}
              className="focus-ring flex min-h-[5.5rem] flex-col items-center justify-center gap-1 border border-white/15 bg-black/45 px-2 py-3 text-center transition enabled:hover:border-[var(--holive-gold)]/50 disabled:opacity-35"
            >
              <span className="font-mono-code text-[0.6rem] tracking-[0.2em] text-white/40">
                {String(lv.id).padStart(2, "0")}
              </span>
              <span className="font-display text-sm text-[var(--holive-gold)]">
                {t(`levels.${lv.key}.name` as "levels.seed.name")}
              </span>
              <span className="text-[0.6rem] text-white/45">
                {locked
                  ? t("locked")
                  : best != null
                    ? `${t("best")}: ${best}`
                    : t(`levels.${lv.key}.tag` as "levels.seed.tag")}
              </span>
            </button>
          );
        })}
      </div>
      {progress.rewards.length > 0 && (
        <p className="mt-4 text-center font-mono-code text-[0.6rem] text-[var(--holive-gold)]/70">
          {t("rewardsOwned")}: {progress.rewards.length}
        </p>
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
  parallax = false,
  theme,
  levelId = 0,
}: {
  reduced: boolean;
  soft?: boolean;
  parallax?: boolean;
  theme?: ReturnType<typeof themeForLevel>;
  levelId?: number;
}) {
  const [off, setOff] = useState({ x: 0, y: 0 });
  const t = theme ?? themeForLevel(Math.max(1, levelId || 1));

  useEffect(() => {
    if (!parallax || reduced) return;
    let raf = 0;
    let latest = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      latest = {
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 8,
      };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setOff(latest);
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [parallax, reduced]);

  const motif = levelId > 0 ? t.motif : "seed";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-[-8%] will-change-transform"
        style={{
          transform:
            parallax && !reduced
              ? `translate3d(${off.x}px, ${off.y}px, 0)`
              : undefined,
          transition: "transform 0.45s ease-out, background 0.8s ease",
          background: soft ? t.softGradient : t.gradient,
        }}
      />
      {!reduced && (
        <>
          <div
            className="neural-wave absolute -left-1/4 top-[10%] h-[40%] w-[150%] opacity-30"
            style={{
              background: `radial-gradient(ellipse at center, ${t.waveA} 0%, transparent 70%)`,
              transform: parallax
                ? `translate3d(${off.x * 0.35}px, ${off.y * 0.25}px, 0)`
                : undefined,
            }}
          />
          <div
            className="neural-wave neural-wave--delay absolute -left-1/4 top-[45%] h-[35%] w-[150%] opacity-20"
            style={{
              background: `radial-gradient(ellipse at center, ${t.waveB} 0%, transparent 70%)`,
            }}
          />
          <div
            className={`neural-code absolute inset-0 neural-motif-${motif}`}
            style={{ opacity: t.codeOpacity }}
          />
        </>
      )}
      <div
        className="absolute inset-0"
        style={{
          opacity: t.gridOpacity,
          backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
          backgroundSize: motif === "orbit" ? "56px 56px" : motif === "mesh" ? "36px 36px" : "48px 48px",
          transform:
            parallax && !reduced
              ? `translate3d(${off.x * -0.2}px, ${off.y * -0.15}px, 0)`
              : undefined,
          willChange: parallax ? "transform" : undefined,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${t.vignette} 100%)`,
        }}
      />
    </div>
  );
}
