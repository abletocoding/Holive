"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import type {
  FreestyleHealerBed,
  FreestyleKit,
  FreestyleMood,
  FreestylePad,
  FreestylePadCount,
  FreestyleSessionPhase,
  FreestyleTheme,
} from "@/lib/game/freestyleKit";
import {
  HEALER_BEDS,
  PATTERN_PRESETS,
  applyPatternPreset,
  emptyPattern,
  fitPadDiameterPx,
  kitWithLayout,
  themePadColors,
} from "@/lib/game/freestyleKit";
import {
  FREESTYLE_SONGS,
  applySongResult,
  beatMs as songBeatMs,
  dailySongId,
  getSong,
  judgeHit,
  loadFreestyleProgress,
  saveFreestyleProgress,
  scoreSong,
  type ChartJudgement,
  type FreestylePlayProgress,
  type FreestyleSong,
  type SongResult,
} from "@/lib/game/freestyleSongs";
import { SongHighway } from "@/components/holi/neural/SongHighway";

type Props = {
  kit: FreestyleKit;
  activePad: string | null;
  hits: number;
  sessionSeconds: number;
  reduced: boolean;
  seqPlaying: boolean;
  seqStep: number;
  sessionPhase: FreestyleSessionPhase;
  breathOpen: boolean;
  holiReaction: string | null;
  immersive: boolean;
  onImmersiveChange: (value: boolean) => void;
  labels: {
    title: string;
    subtitle: string;
    hits: string;
    session: string;
    tempo: string;
    metronome: string;
    metronomeOn: string;
    metronomeOff: string;
    theme: string;
    layout: string;
    pitch: string;
    lower: string;
    higher: string;
    pad: string;
    kit: string;
    close: string;
    beds: string;
    bed: Record<FreestyleHealerBed, string>;
    sequencer: string;
    play: string;
    stop: string;
    record: string;
    clear: string;
    steps: string;
    presets: string;
    presetPulse: string;
    presetBreath: string;
    presetSpiral: string;
    presetHeart: string;
    harmonic: string;
    harmonicOn: string;
    harmonicOff: string;
    breath: string;
    breathOn: string;
    breathOff: string;
    intention: string;
    warm: string;
    flow: string;
    cool: string;
    startIntention: string;
    stopIntention: string;
    mood: string;
    moods: Record<FreestyleMood, string>;
    jamStreak: string;
    coachEmpty: string;
    immersive: string;
    immersiveOn: string;
    peek: string;
    songs: string;
    songMode: string;
    daily: string;
    playSong: string;
    replay: string;
    jamKit: string;
    perfect: string;
    good: string;
    miss: string;
    stars: string;
    unlocks: string;
    backJam: string;
    chartReady: string;
  };
  songLabels: Record<string, string>;
  songMoods: Record<string, string>;
  onHit: (pad: FreestylePad, index: number) => void;
  onKitChange: (kit: FreestyleKit) => void;
  onSeqToggle: () => void;
  onIntentionToggle: () => void;
  onMood: (mood: FreestyleMood) => void;
  onBedChange: (bed: FreestyleHealerBed) => void;
  onSongResult?: (result: SongResult) => void;
  onChartJudgement?: (judgement: ChartJudgement) => void;
};

const THEMES: FreestyleTheme[] = ["heal", "pulse", "gold", "night"];
const PAD_COUNTS: FreestylePadCount[] = [4, 6, 8];
const MOODS: FreestyleMood[] = ["calm", "open", "bright", "grounded", "flowing"];

type SurfaceMode = "jam" | "songs" | "chart" | "results";

function killTextFocus() {
  const el = document.activeElement;
  if (el instanceof HTMLElement) el.blur();
  window.getSelection()?.removeAllRanges();
}

/** Pointer-only value control — never mounts a focusable form control. */
function PointerStepper({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (next: number) => void;
}) {
  return (
    <div className="block">
      <span className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
        {label}
      </span>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          tabIndex={-1}
          className="focus-ring min-h-11 min-w-11 border border-white/15 text-lg text-white/80"
          onPointerDown={(e) => {
            e.preventDefault();
            killTextFocus();
            onChange(Math.max(min, value - step));
          }}
          aria-label={`${label} −`}
        >
          −
        </button>
        <span className="min-w-[4.5rem] flex-1 text-center font-mono-code text-sm text-[var(--holive-gold)]">
          {Math.round(value)}
          {suffix}
        </span>
        <button
          type="button"
          tabIndex={-1}
          className="focus-ring min-h-11 min-w-11 border border-white/15 text-lg text-white/80"
          onPointerDown={(e) => {
            e.preventDefault();
            killTextFocus();
            onChange(Math.min(max, value + step));
          }}
          aria-label={`${label} +`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function FreestyleDrum({
  kit,
  activePad,
  hits,
  sessionSeconds,
  reduced,
  seqPlaying,
  seqStep,
  sessionPhase,
  breathOpen,
  holiReaction,
  immersive,
  onImmersiveChange,
  labels,
  songLabels,
  songMoods,
  onHit,
  onKitChange,
  onSeqToggle,
  onIntentionToggle,
  onMood,
  onBedChange,
  onSongResult,
  onChartJudgement,
}: Props) {
  const layout = kitWithLayout(kit);
  const [selectedPadId, setSelectedPadId] = useState(
    layout.pads[0]?.id ?? "root",
  );
  const [drawer, setDrawer] = useState<"kit" | "seq" | null>(null);
  const [mode, setMode] = useState<SurfaceMode>("jam");
  const [selectedSongId, setSelectedSongId] = useState(dailySongId());
  const [progress, setProgress] = useState<FreestylePlayProgress>(() =>
    loadFreestyleProgress(),
  );
  const [recording, setRecording] = useState(false);
  const [chartElapsed, setChartElapsed] = useState(0);
  const [chartStats, setChartStats] = useState({
    perfect: 0,
    good: 0,
    miss: 0,
    streak: 0,
    maxStreak: 0,
  });
  const [lastJudgement, setLastJudgement] = useState<ChartJudgement | null>(
    null,
  );
  const [result, setResult] = useState<SongResult | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ w: 280, h: 280 });
  const chartStartRef = useRef(0);
  const chartNotesHitRef = useRef<Set<string>>(new Set());
  const chartRafRef = useRef(0);
  const chartSongRef = useRef<FreestyleSong | null>(null);
  const chartStatsRef = useRef(chartStats);
  const touchStartY = useRef<number | null>(null);

  const selectedIndex = Math.max(
    0,
    layout.pads.findIndex(
      (pad) => pad.id === (activePad ?? selectedPadId),
    ),
  );
  const selectedPad = layout.pads[selectedIndex] ?? layout.pads[0]!;
  const pitchMin = Math.max(80, Math.round(selectedPad.tone * 0.5));
  const pitchMax = Math.min(1200, Math.round(selectedPad.tone * 1.8));
  const dailyId = dailySongId();
  const activeSong = getSong(selectedSongId) ?? FREESTYLE_SONGS[0]!;

  useEffect(() => {
    chartStatsRef.current = chartStats;
  }, [chartStats]);

  useEffect(() => {
    killTextFocus();
    const t = window.setTimeout(killTextFocus, 40);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (immersive || mode === "chart") setDrawer(null);
  }, [immersive, mode]);

  useEffect(() => {
    const node = boardRef.current;
    if (!node) return;
    const measure = () => {
      const r = node.getBoundingClientRect();
      setBoardSize({
        w: Math.max(120, Math.floor(r.width)),
        h: Math.max(120, Math.floor(r.height)),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", measure);
    };
  }, [layout.padCount, drawer, immersive, mode]);

  const preferredRatio =
    layout.padCount >= 8 ? 0.24 : layout.padCount >= 6 ? 0.28 : 0.32;
  const padDiameter = fitPadDiameterPx(
    boardSize.w,
    boardSize.h,
    layout.pads,
    preferredRatio,
  );

  const updateTheme = (theme: FreestyleTheme) => {
    const colors = themePadColors(theme);
    onKitChange(
      kitWithLayout({
        ...kit,
        theme,
        pads: kit.pads.map((pad, i) => ({
          ...pad,
          color: colors[i % colors.length]!,
        })),
      }),
    );
  };

  const updatePadCount = (padCount: FreestylePadCount) => {
    onKitChange(
      kitWithLayout({
        ...kit,
        padCount,
        pattern: {
          steps: kit.seqSteps,
          tracks: emptyPattern(kit.seqSteps, padCount).tracks.map(
            (row, ti) =>
              row.map((_, si) => Boolean(kit.pattern.tracks[ti]?.[si])),
          ),
        },
      }),
    );
  };

  const updateSelectedPitch = (tone: number) => {
    onKitChange(
      kitWithLayout({
        ...kit,
        pads: kit.pads.map((pad) =>
          pad.id === selectedPad.id ? { ...pad, tone } : pad,
        ),
      }),
    );
  };

  const toggleStep = (track: number, step: number) => {
    const tracks = kit.pattern.tracks.map((row, ti) =>
      row.map((on, si) => (ti === track && si === step ? !on : on)),
    );
    onKitChange(
      kitWithLayout({
        ...kit,
        pattern: { steps: kit.seqSteps, tracks },
      }),
    );
  };

  const clearPattern = () => {
    onKitChange(
      kitWithLayout({
        ...kit,
        pattern: emptyPattern(kit.seqSteps, kit.padCount),
      }),
    );
  };

  const setSteps = (steps: 8 | 16) => {
    onKitChange(
      kitWithLayout({
        ...kit,
        seqSteps: steps,
        pattern: {
          steps,
          tracks: emptyPattern(steps, kit.padCount).tracks.map((row, t) =>
            row.map((_, s) => Boolean(kit.pattern.tracks[t]?.[s])),
          ),
        },
      }),
    );
  };

  const applySongKit = useCallback(
    (song: FreestyleSong) => {
      onKitChange(
        kitWithLayout({
          ...kit,
          tempo: song.tempo,
          healerBed: song.healerBed,
          theme: song.theme,
          padCount: song.padCount,
          harmonicMode: true,
          metronome: false,
        }),
      );
      onBedChange(song.healerBed);
    },
    [kit, onBedChange, onKitChange],
  );

  const finishChart = useCallback(
    (song: FreestyleSong) => {
      const stats = chartStatsRef.current;
      const remaining = song.notes.filter(
        (n) => !chartNotesHitRef.current.has(`${n.beat}:${n.pad}`),
      ).length;
      const miss = stats.miss + remaining;
      const scored = scoreSong({
        songId: song.id,
        perfect: stats.perfect,
        good: stats.good,
        miss,
        maxStreak: stats.maxStreak,
        totalNotes: song.notes.length,
      });
      setResult(scored);
      setMode("results");
      const next = applySongResult(progress, scored);
      setProgress(next);
      saveFreestyleProgress(next);
      onSongResult?.(scored);
    },
    [onSongResult, progress],
  );

  const stopChart = useCallback(() => {
    if (chartRafRef.current) cancelAnimationFrame(chartRafRef.current);
    chartRafRef.current = 0;
    chartSongRef.current = null;
  }, []);

  const startChart = useCallback(
    (song: FreestyleSong) => {
      stopChart();
      applySongKit(song);
      setSelectedSongId(song.id);
      setMode("chart");
      onImmersiveChange(true);
      setDrawer(null);
      setChartStats({ perfect: 0, good: 0, miss: 0, streak: 0, maxStreak: 0 });
      setLastJudgement(null);
      setResult(null);
      chartNotesHitRef.current = new Set();
      chartSongRef.current = song;
      chartStartRef.current = performance.now();
      setChartElapsed(0);
      killTextFocus();

      const tick = (now: number) => {
        const elapsed = now - chartStartRef.current;
        setChartElapsed(elapsed);
        const ms = songBeatMs(song.tempo);
        const songEnd = song.durationBeats * ms + 400;
        // Auto-miss notes that passed the window
        for (const n of song.notes) {
          const key = `${n.beat}:${n.pad}`;
          if (chartNotesHitRef.current.has(key)) continue;
          const target = n.beat * ms;
          if (elapsed > target + 170) {
            chartNotesHitRef.current.add(key);
            setChartStats((s) => {
              const next = {
                ...s,
                miss: s.miss + 1,
                streak: 0,
              };
              chartStatsRef.current = next;
              return next;
            });
            setLastJudgement("miss");
            onChartJudgement?.("miss");
          }
        }
        if (elapsed >= songEnd) {
          finishChart(song);
          return;
        }
        chartRafRef.current = requestAnimationFrame(tick);
      };
      chartRafRef.current = requestAnimationFrame(tick);
    },
    [
      applySongKit,
      finishChart,
      onChartJudgement,
      onImmersiveChange,
      stopChart,
    ],
  );

  useEffect(() => () => stopChart(), [stopChart]);

  const hitPad = useCallback(
    (pad: FreestylePad, index: number) => {
      killTextFocus();
      setSelectedPadId(pad.id);

      const song = chartSongRef.current;
      if (mode === "chart" && song) {
        const elapsed = performance.now() - chartStartRef.current;
        const ms = songBeatMs(song.tempo);
        let best: { noteKey: string; judgement: ChartJudgement; delta: number } | null =
          null;
        for (const n of song.notes) {
          if (n.pad !== index) continue;
          const key = `${n.beat}:${n.pad}`;
          if (chartNotesHitRef.current.has(key)) continue;
          const target = n.beat * ms;
          const judgement = judgeHit(target, elapsed);
          if (judgement === "miss") continue;
          const delta = Math.abs(target - elapsed);
          if (!best || delta < best.delta) {
            best = { noteKey: key, judgement, delta };
          }
        }
        if (best) {
          chartNotesHitRef.current.add(best.noteKey);
          setLastJudgement(best.judgement);
          onChartJudgement?.(best.judgement);
          setChartStats((s) => {
            const streak =
              best!.judgement === "miss" ? 0 : s.streak + 1;
            const next = {
              perfect: s.perfect + (best!.judgement === "perfect" ? 1 : 0),
              good: s.good + (best!.judgement === "good" ? 1 : 0),
              miss: s.miss,
              streak,
              maxStreak: Math.max(s.maxStreak, streak),
            };
            chartStatsRef.current = next;
            return next;
          });
        }
      }

      if (kit.breathGate && !breathOpen) return;
      onHit(pad, index);
      if (recording && !seqPlaying) {
        const step =
          ((seqStep % kit.seqSteps) + kit.seqSteps) % kit.seqSteps;
        const tracks = kit.pattern.tracks.map((row, ti) =>
          row.map((on, si) => (ti === index && si === step ? true : on)),
        );
        onKitChange(
          kitWithLayout({
            ...kit,
            pattern: { steps: kit.seqSteps, tracks },
          }),
        );
      }
    },
    [
      breathOpen,
      kit,
      mode,
      onChartJudgement,
      onHit,
      onKitChange,
      recording,
      seqPlaying,
      seqStep,
    ],
  );

  const onPadPointerDown = (
    e: ReactPointerEvent<HTMLButtonElement>,
    pad: FreestylePad,
    index: number,
  ) => {
    if (e.pointerType === "touch") e.preventDefault();
    killTextFocus();
    hitPad(pad, index);
  };

  const onPadTouchStart = (e: ReactTouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    killTextFocus();
  };

  const showChrome = !immersive && mode !== "chart";
  const padColors = layout.pads.map((p) => p.color);

  const kitPanel = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat label={labels.hits} value={String(hits)} />
        <Stat label={labels.session} value={formatTime(sessionSeconds)} />
      </div>

      <PointerStepper
        label={labels.tempo}
        value={kit.tempo}
        min={48}
        max={140}
        step={1}
        suffix=" BPM"
        onChange={(tempo) =>
          onKitChange(kitWithLayout({ ...kit, tempo }))
        }
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          tabIndex={-1}
          onClick={() =>
            onKitChange(
              kitWithLayout({ ...kit, metronome: !kit.metronome }),
            )
          }
          className="focus-ring min-h-11 border border-white/15 px-3 text-xs text-white/80 hover:border-[var(--holive-gold)]/50"
        >
          {labels.metronome}:{" "}
          {kit.metronome ? labels.metronomeOn : labels.metronomeOff}
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={() =>
            onKitChange(
              kitWithLayout({
                ...kit,
                harmonicMode: !kit.harmonicMode,
              }),
            )
          }
          className="focus-ring min-h-11 border border-white/15 px-3 text-xs text-white/80 hover:border-[var(--holive-gold)]/50"
        >
          {labels.harmonic}:{" "}
          {kit.harmonicMode ? labels.harmonicOn : labels.harmonicOff}
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={() =>
            onKitChange(
              kitWithLayout({ ...kit, breathGate: !kit.breathGate }),
            )
          }
          className="focus-ring min-h-11 border border-white/15 px-3 text-xs text-white/80 hover:border-[var(--holive-gold)]/50"
        >
          {labels.breath}:{" "}
          {kit.breathGate ? labels.breathOn : labels.breathOff}
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={onIntentionToggle}
          className="focus-ring min-h-11 border border-white/15 px-3 text-xs text-white/80 hover:border-[var(--holive-gold)]/50"
        >
          {sessionPhase === "idle"
            ? labels.startIntention
            : labels.stopIntention}
        </button>
      </div>

      <div>
        <p className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
          {labels.beds}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {HEALER_BEDS.map((bed) => (
            <button
              key={bed}
              type="button"
              tabIndex={-1}
              onClick={() => onBedChange(bed)}
              className={`focus-ring min-h-11 border px-2 text-[0.7rem] capitalize ${
                kit.healerBed === bed
                  ? "border-[var(--holive-gold)] bg-[var(--holive-gold)] text-[var(--holive-black)]"
                  : "border-white/15 text-white/70"
              }`}
            >
              {labels.bed[bed]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
          {labels.layout}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PAD_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              tabIndex={-1}
              onClick={() => updatePadCount(count)}
              className={`focus-ring min-h-11 border px-3 text-xs ${
                layout.padCount === count
                  ? "border-[var(--holive-gold)] bg-[var(--holive-gold)] text-[var(--holive-black)]"
                  : "border-white/15 text-white/70"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
          {labels.theme}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              tabIndex={-1}
              onClick={() => updateTheme(theme)}
              className={`focus-ring min-h-11 border px-3 text-xs capitalize ${
                kit.theme === theme
                  ? "border-[var(--holive-gold)] bg-[var(--holive-gold)] text-[var(--holive-black)]"
                  : "border-white/15 text-white/70"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {kit.harmonicMode && (
        <PointerStepper
          label={`${labels.pitch}: ${selectedPad.label}`}
          value={Math.round(selectedPad.tone)}
          min={pitchMin}
          max={pitchMax}
          step={1}
          suffix="Hz"
          onChange={updateSelectedPitch}
        />
      )}

      <div>
        <p className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
          {labels.mood}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood}
              type="button"
              tabIndex={-1}
              onClick={() => onMood(mood)}
              className={`focus-ring min-h-10 border px-3 text-[0.7rem] ${
                kit.lastMood === mood
                  ? "border-[var(--holive-gold)] text-[var(--holive-gold)]"
                  : "border-white/15 text-white/70"
              }`}
            >
              {labels.moods[mood]}
            </button>
          ))}
        </div>
      </div>

      <p className="font-mono-code text-[0.65rem] tracking-[0.14em] text-white/45 uppercase">
        {labels.jamStreak}: {kit.jamStreak}
      </p>
    </div>
  );

  const seqPanel = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          tabIndex={-1}
          onClick={onSeqToggle}
          className="focus-ring min-h-11 border border-[var(--holive-gold)]/40 bg-[var(--holive-gold)]/15 px-4 text-xs text-[var(--holive-gold)]"
        >
          {seqPlaying ? labels.stop : labels.play}
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setRecording((r) => !r)}
          className={`focus-ring min-h-11 border px-4 text-xs ${
            recording
              ? "border-rose-300/60 text-rose-200"
              : "border-white/15 text-white/70"
          }`}
        >
          {labels.record}
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={clearPattern}
          className="focus-ring min-h-11 border border-white/15 px-4 text-xs text-white/70"
        >
          {labels.clear}
        </button>
        {([8, 16] as const).map((n) => (
          <button
            key={n}
            type="button"
            tabIndex={-1}
            onClick={() => setSteps(n)}
            className={`focus-ring min-h-11 border px-3 text-xs ${
              kit.seqSteps === n
                ? "border-[var(--holive-gold)] text-[var(--holive-gold)]"
                : "border-white/15 text-white/70"
            }`}
          >
            {n} {labels.steps}
          </button>
        ))}
      </div>

      <div>
        <p className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
          {labels.presets}
        </p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {PATTERN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              tabIndex={-1}
              onClick={() =>
                onKitChange(applyPatternPreset(kit, preset.id))
              }
              className="focus-ring shrink-0 min-h-10 border border-white/15 px-3 text-[0.7rem] text-white/70"
            >
              {labels[preset.labelKey as "presetPulse"]}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1">
        <div
          className="inline-grid gap-1"
          style={{
            gridTemplateColumns: `minmax(2.5rem,auto) repeat(${kit.seqSteps}, minmax(1.65rem, 1.85rem))`,
          }}
        >
          <div />
          {Array.from({ length: kit.seqSteps }, (_, s) => (
            <div
              key={`h-${s}`}
              className={`text-center font-mono-code text-[0.55rem] ${
                seqPlaying && seqStep === s
                  ? "text-[var(--holive-gold)]"
                  : "text-white/35"
              }`}
            >
              {s + 1}
            </div>
          ))}
          {layout.pads.map((pad, ti) => (
            <div key={pad.id} className="contents">
              <div className="flex items-center pr-1 font-display text-[0.65rem] text-white/70">
                {pad.label.slice(0, 4)}
              </div>
              {Array.from({ length: kit.seqSteps }, (_, s) => {
                const on = Boolean(kit.pattern.tracks[ti]?.[s]);
                const now = seqPlaying && seqStep === s;
                return (
                  <button
                    key={`${pad.id}-${s}`}
                    type="button"
                    tabIndex={-1}
                    aria-label={`${pad.label} step ${s + 1}`}
                    onClick={() => toggleStep(ti, s)}
                    className={`h-8 min-w-[1.65rem] border transition ${
                      on
                        ? "border-transparent"
                        : "border-white/10 bg-black/30"
                    } ${now ? "ring-1 ring-[var(--holive-gold)]" : ""}`}
                    style={{
                      background: on ? pad.color : undefined,
                      opacity: on ? 0.92 : 1,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const songsPanel = (
    <div className="space-y-3">
      <p className="font-mono-code text-[0.6rem] tracking-[0.2em] text-[var(--holive-gold)]/80 uppercase">
        {labels.daily}:{" "}
        {songLabels[getSong(dailyId)?.labelKey ?? ""] ?? dailyId}
      </p>
      <div className="space-y-2">
        {FREESTYLE_SONGS.map((song) => {
          const stars = progress.bestStars[song.id] ?? 0;
          const isDaily = song.id === dailyId;
          return (
            <button
              key={song.id}
              type="button"
              tabIndex={-1}
              onClick={() => {
                setSelectedSongId(song.id);
                applySongKit(song);
              }}
              className={`focus-ring w-full border px-3 py-3 text-left ${
                selectedSongId === song.id
                  ? "border-[var(--holive-gold)]/60 bg-[var(--holive-gold)]/10"
                  : "border-white/10 bg-black/25"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-sm text-[var(--holive-gold)]">
                    {songLabels[song.labelKey] ?? song.id}
                    {isDaily ? ` · ${labels.daily}` : ""}
                  </p>
                  <p className="mt-1 text-[0.7rem] leading-snug text-white/55">
                    {songMoods[song.moodKey] ?? ""}
                  </p>
                </div>
                <span className="shrink-0 font-mono-code text-[0.65rem] text-[var(--holive-gold)]">
                  {"★".repeat(stars)}
                  {"☆".repeat(3 - stars)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        tabIndex={-1}
        onClick={() => startChart(activeSong)}
        className="focus-ring min-h-12 w-full bg-[var(--holive-gold)] px-4 text-sm font-semibold text-[var(--holive-black)]"
      >
        {labels.playSong}
      </button>
      <button
        type="button"
        tabIndex={-1}
        onClick={() => {
          applySongKit(activeSong);
          setMode("jam");
          onImmersiveChange(false);
        }}
        className="focus-ring min-h-11 w-full border border-white/15 px-4 text-xs text-white/75"
      >
        {labels.jamKit}
      </button>
    </div>
  );

  return (
    <div
      className="relative z-10 flex h-full min-h-0 w-full max-w-5xl flex-col gap-2 overflow-hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.85fr)] lg:gap-4 lg:overflow-hidden"
      style={{
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        caretColor: "transparent",
      }}
      onPointerDownCapture={() => killTextFocus()}
    >
      <section
        ref={boardRef}
        className="relative mx-auto aspect-square w-full max-h-[min(52svh,24rem)] max-w-[min(92vw,26rem)] shrink-0 touch-manipulation overflow-hidden border border-[var(--holive-gold)]/20 bg-[radial-gradient(ellipse_at_center,rgba(90,42,158,0.22),transparent_65%),radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),rgb(201,168,76,0.08))] sm:max-h-[min(58svh,28rem)] lg:max-h-none lg:h-full lg:max-w-none lg:aspect-auto"
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
          caretColor: "transparent",
        }}
        onTouchStart={(e) => {
          touchStartY.current = e.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(e) => {
          if (!immersive || touchStartY.current == null) return;
          const y = e.changedTouches[0]?.clientY;
          if (y != null && touchStartY.current - y > 48) {
            onImmersiveChange(false);
            if (mode === "chart") {
              /* keep chart; just peek chrome */
            }
          }
          touchStartY.current = null;
        }}
      >
        {!immersive && mode === "jam" && (
          <div className="pointer-events-none absolute inset-x-3 top-2 z-10 max-w-[70%] sm:left-4 sm:top-3 sm:max-w-xs">
            <p className="font-display text-base text-[var(--holive-gold)] sm:text-lg">
              {labels.title}
            </p>
            <p className="mt-0.5 hidden text-xs leading-relaxed text-white/55 sm:mt-1 sm:block">
              {labels.subtitle}
            </p>
          </div>
        )}

        {mode === "chart" && (
          <div className="absolute inset-x-2 top-2 z-10 sm:inset-x-3 sm:top-3">
            <SongHighway
              notes={activeSong.notes}
              beatMs={songBeatMs(activeSong.tempo)}
              elapsedMs={chartElapsed}
              padCount={activeSong.padCount}
              padColors={padColors}
              reduced={reduced}
            />
            <div className="mt-1 flex items-center justify-between px-1 font-mono-code text-[0.6rem] text-white/55">
              <span>
                {songLabels[activeSong.labelKey] ?? activeSong.id}
              </span>
              <span className="text-[var(--holive-gold)]">
                {lastJudgement
                  ? labels[lastJudgement]
                  : labels.chartReady}
                {chartStats.streak > 1 ? ` · ×${chartStats.streak}` : ""}
              </span>
            </div>
          </div>
        )}

        {sessionPhase !== "idle" && showChrome && (
          <div className="pointer-events-none absolute right-2 top-2 z-10 border border-[var(--holive-gold)]/30 bg-black/50 px-2 py-1 font-mono-code text-[0.55rem] tracking-[0.14em] text-[var(--holive-gold)] uppercase sm:right-3 sm:top-4">
            {sessionPhase === "warm"
              ? labels.warm
              : sessionPhase === "flow"
                ? labels.flow
                : labels.cool}
          </div>
        )}

        {kit.breathGate && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--holive-gold)]/20 sm:h-[62%] sm:w-[62%]"
            style={{
              opacity: breathOpen ? 0.55 : 0.18,
              transform: `translate(-50%, -50%) scale(${breathOpen ? 1.05 : 0.92})`,
              transition: reduced
                ? undefined
                : "opacity 0.8s ease, transform 1.2s ease",
            }}
          />
        )}

        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--holive-gold)]/15 ${
            reduced ? "" : "animate-[spin_18s_linear_infinite]"
          } sm:h-[60%] sm:w-[60%]`}
        />

        {layout.pads.map((pad, i) => {
          const active = activePad === pad.id;
          const gated = kit.breathGate && !breathOpen;
          return (
            <button
              key={pad.id}
              type="button"
              tabIndex={-1}
              aria-label={`${labels.pad} ${i + 1}: ${pad.label}`}
              onPointerDown={(e) => onPadPointerDown(e, pad, i)}
              onTouchStart={onPadTouchStart}
              onClick={(e) => {
                if (e.detail === 0) hitPad(pad, i);
              }}
              className="neural-touch focus-ring absolute flex min-h-0 min-w-0 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border-2 transition active:scale-95"
              style={{
                left: `${pad.x}%`,
                top: `${pad.y}%`,
                width: padDiameter,
                height: padDiameter,
                background: active
                  ? pad.color
                  : "color-mix(in srgb, #10620f 78%, black)",
                borderColor: active
                  ? "rgba(255,255,255,0.65)"
                  : "rgba(201,168,76,0.35)",
                boxShadow: active
                  ? `0 0 22px ${pad.color}, inset 0 0 14px rgba(255,255,255,0.15)`
                  : reduced
                    ? "inset 0 0 18px rgba(90,42,158,0.2)"
                    : `0 0 16px color-mix(in srgb, ${pad.color} 28%, transparent), inset 0 0 18px rgba(90,42,158,0.2)`,
                opacity: gated ? 0.55 : 1,
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
                caretColor: "transparent",
              }}
            >
              {active && !reduced && (
                <>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-[-12%] rounded-full border border-white/30 neural-pulse-ring"
                  />
                </>
              )}
              {!immersive && (
                <span className="pointer-events-none font-display text-[clamp(0.65rem,2vw,0.95rem)] text-white drop-shadow sm:text-sm">
                  {pad.label}
                </span>
              )}
            </button>
          );
        })}

        {holiReaction && (
          <div className="pointer-events-none absolute inset-x-3 bottom-14 z-20 text-center font-display text-sm text-[var(--holive-gold)] sm:bottom-16 sm:text-base">
            {holiReaction}
          </div>
        )}

        {!hits && mode === "jam" && (
          <p className="pointer-events-none absolute inset-x-6 bottom-16 text-center font-display text-sm text-white/45 sm:bottom-20">
            {labels.coachEmpty}
          </p>
        )}

        {immersive && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={labels.peek}
            onClick={() => onImmersiveChange(false)}
            className="absolute inset-x-[35%] bottom-1 z-30 h-2 rounded-full bg-white/25"
          />
        )}
      </section>

      {mode === "results" && result && (
        <div className="mx-auto w-full max-w-md border border-[var(--holive-gold)]/30 bg-black/70 p-4 text-center backdrop-blur-md">
          <p className="font-display text-xl text-[var(--holive-gold)]">
            {songLabels[activeSong.labelKey] ?? activeSong.id}
          </p>
          <p className="mt-2 font-mono-code text-lg tracking-widest text-[var(--holive-gold)]">
            {"★".repeat(result.stars)}
            {"☆".repeat(3 - result.stars)}
          </p>
          <p className="mt-2 font-mono-code text-xs text-white/60">
            {labels.perfect} {result.perfect} · {labels.good} {result.good} ·{" "}
            {labels.miss} {result.miss}
          </p>
          <p className="mt-1 font-display text-sm text-white/80">
            {result.score} · {labels.stars}
          </p>
          {progress.unlockedDances.length > 1 && (
            <p className="mt-2 text-[0.65rem] text-white/45">
              {labels.unlocks}: {progress.unlockedDances.join(" · ")}
            </p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 bg-[var(--holive-gold)] px-4 text-xs font-semibold text-[var(--holive-black)]"
              onClick={() => startChart(activeSong)}
            >
              {labels.replay}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 border border-white/20 px-4 text-xs text-white/80"
              onClick={() => {
                applySongKit(activeSong);
                setMode("jam");
                onImmersiveChange(false);
                stopChart();
              }}
            >
              {labels.jamKit}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 border border-white/20 px-4 text-xs text-white/80"
              onClick={() => {
                setMode("songs");
                onImmersiveChange(false);
                stopChart();
              }}
            >
              {labels.songs}
            </button>
          </div>
        </div>
      )}

      {showChrome && (
        <div className="flex shrink-0 items-center justify-between gap-2 border border-white/10 bg-black/45 px-3 py-2 lg:hidden">
          <div className="min-w-0 font-mono-code text-[0.65rem] text-white/70">
            <span className="text-[var(--holive-gold)]">{hits}</span>{" "}
            {labels.hits}
            <span className="mx-2 text-white/20">·</span>
            {formatTime(sessionSeconds)}
            {recording && (
              <span className="ml-2 text-rose-300">{labels.record}</span>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 shrink-0 border border-white/20 px-3 text-xs text-white/85"
              onClick={() => {
                killTextFocus();
                setMode("songs");
                setDrawer(null);
              }}
            >
              {labels.songs}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 shrink-0 border border-white/20 px-3 text-xs text-white/85"
              onClick={() => {
                killTextFocus();
                setDrawer((d) => (d === "seq" ? null : "seq"));
              }}
              aria-expanded={drawer === "seq"}
            >
              {labels.sequencer}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 shrink-0 border border-white/20 px-3 text-xs text-white/85"
              onClick={() => {
                killTextFocus();
                setDrawer((d) => (d === "kit" ? null : "kit"));
              }}
              aria-expanded={drawer === "kit"}
            >
              {drawer === "kit" ? "▾" : labels.kit}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 shrink-0 border border-[var(--holive-gold)]/40 px-3 text-xs text-[var(--holive-gold)]"
              onClick={() => {
                killTextFocus();
                onImmersiveChange(true);
              }}
            >
              {labels.immersive}
            </button>
          </div>
        </div>
      )}

      {showChrome && drawer && (
        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[min(58svh,26rem)] overflow-y-auto overscroll-contain border-t border-[var(--holive-gold)]/30 bg-[#0a0614]/96 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-display text-lg text-[var(--holive-gold)]">
              {drawer === "kit" ? labels.kit : labels.sequencer}
            </p>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 border border-white/20 px-3 text-xs text-white/80"
              onClick={() => setDrawer(null)}
            >
              {labels.close}
            </button>
          </div>
          {drawer === "kit" ? kitPanel : seqPanel}
        </div>
      )}

      {showChrome && (
        <aside className="hidden min-h-0 overflow-y-auto overscroll-contain border border-white/10 bg-[linear-gradient(165deg,rgba(201,0,40,0.08),rgba(0,0,0,0.55))] p-4 backdrop-blur-sm lg:block">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              tabIndex={-1}
              className={`focus-ring min-h-10 border px-3 text-xs ${
                mode === "jam"
                  ? "border-[var(--holive-gold)] text-[var(--holive-gold)]"
                  : "border-white/15 text-white/70"
              }`}
              onClick={() => setMode("jam")}
            >
              {labels.backJam}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className={`focus-ring min-h-10 border px-3 text-xs ${
                mode === "songs"
                  ? "border-[var(--holive-gold)] text-[var(--holive-gold)]"
                  : "border-white/15 text-white/70"
              }`}
              onClick={() => setMode("songs")}
            >
              {labels.songMode}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-10 border border-[var(--holive-gold)]/40 px-3 text-xs text-[var(--holive-gold)]"
              onClick={() => onImmersiveChange(true)}
            >
              {labels.immersiveOn}
            </button>
          </div>
          {mode === "songs" ? (
            songsPanel
          ) : (
            <>
              <p className="font-display text-lg text-[var(--holive-gold)]">
                {labels.kit}
              </p>
              <div className="mt-3">{kitPanel}</div>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-display text-lg text-[var(--holive-gold)]">
                  {labels.sequencer}
                </p>
                <div className="mt-3">{seqPanel}</div>
              </div>
            </>
          )}
        </aside>
      )}

      {showChrome && mode === "songs" && (
        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[min(70svh,32rem)] overflow-y-auto overscroll-contain border-t border-[var(--holive-gold)]/30 bg-[#0a0614]/96 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-display text-lg text-[var(--holive-gold)]">
              {labels.songMode}
            </p>
            <button
              type="button"
              tabIndex={-1}
              className="focus-ring min-h-11 border border-white/20 px-3 text-xs text-white/80"
              onClick={() => setMode("jam")}
            >
              {labels.close}
            </button>
          </div>
          {songsPanel}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/30 px-3 py-2.5 text-center sm:py-3">
      <p className="font-mono-code text-[0.55rem] tracking-[0.2em] text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-base text-[var(--holive-gold)] sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.max(0, Math.floor(seconds % 60));
  return `${min}:${String(sec).padStart(2, "0")}`;
}
