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
  FreestyleStepCount,
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
  };
  onHit: (pad: FreestylePad, index: number) => void;
  onKitChange: (kit: FreestyleKit) => void;
  onSeqToggle: () => void;
  onIntentionToggle: () => void;
  onMood: (mood: FreestyleMood) => void;
  onBedChange: (bed: FreestyleHealerBed) => void;
};

const THEMES: FreestyleTheme[] = ["heal", "pulse", "gold", "night"];
const PAD_COUNTS: FreestylePadCount[] = [4, 6, 8];
const MOODS: FreestyleMood[] = ["calm", "open", "bright", "grounded", "flowing"];

function blurActive() {
  const el = document.activeElement;
  if (el instanceof HTMLElement) el.blur();
}

function blurRange(el: HTMLInputElement) {
  // iOS: range focus can keep text-entry chrome active in fullscreen
  requestAnimationFrame(() => {
    el.blur();
    blurActive();
  });
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
  labels,
  onHit,
  onKitChange,
  onSeqToggle,
  onIntentionToggle,
  onMood,
  onBedChange,
}: Props) {
  const layout = kitWithLayout(kit);
  const [selectedPadId, setSelectedPadId] = useState(
    layout.pads[0]?.id ?? "root",
  );
  const [drawer, setDrawer] = useState<"kit" | "seq" | null>(null);
  const [recording, setRecording] = useState(false);
  const boardRef = useRef<HTMLElement>(null);
  const [boardSize, setBoardSize] = useState({ w: 280, h: 280 });

  const selectedIndex = Math.max(
    0,
    layout.pads.findIndex(
      (pad) => pad.id === (activePad ?? selectedPadId),
    ),
  );
  const selectedPad = layout.pads[selectedIndex] ?? layout.pads[0]!;
  const pitchMin = Math.max(80, Math.round(selectedPad.tone * 0.5));
  const pitchMax = Math.min(1200, Math.round(selectedPad.tone * 1.8));

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
  }, [layout.padCount, drawer]);

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

  const setSteps = (steps: FreestyleStepCount) => {
    onKitChange(
      kitWithLayout({
        ...kit,
        seqSteps: steps,
        pattern: {
          steps,
          tracks: emptyPattern(steps, kit.padCount).tracks.map((row, ti) =>
            row.map((_, si) => Boolean(kit.pattern.tracks[ti]?.[si])),
          ),
        },
      }),
    );
  };

  const hitPad = useCallback(
    (pad: FreestylePad, index: number) => {
      blurActive();
      setSelectedPadId(pad.id);
      if (kit.breathGate && !breathOpen) return;
      onHit(pad, index);
      if (recording && !seqPlaying) {
        const step = ((seqStep % kit.seqSteps) + kit.seqSteps) % kit.seqSteps;
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
    // Prevent iOS from treating pad surface as text selection / focus target
    if (e.pointerType === "touch") {
      e.preventDefault();
    }
    hitPad(pad, index);
  };

  const onPadTouchStart = (e: ReactTouchEvent<HTMLButtonElement>) => {
    // Keep audio unlock (gesture) but stop scroll/focus chrome
    e.preventDefault();
  };

  const kitPanel = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat label={labels.hits} value={String(hits)} />
        <Stat label={labels.session} value={formatTime(sessionSeconds)} />
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
            {labels.tempo}
          </span>
          <input
            type="range"
            min={40}
            max={140}
            step={1}
            inputMode="none"
            value={kit.tempo}
            onChange={(e) => {
              onKitChange(
                kitWithLayout({
                  ...kit,
                  tempo: Number(e.target.value),
                }),
              );
              blurRange(e.target);
            }}
            onPointerUp={(e) => blurRange(e.currentTarget)}
            onTouchEnd={(e) => blurRange(e.currentTarget)}
            className="mt-2 h-8 w-full accent-[var(--holive-gold)] sm:mt-3"
          />
          <span className="mt-1 block font-mono-code text-xs text-[var(--holive-gold)]">
            {kit.tempo} BPM
          </span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
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
                onClick={() => onBedChange(bed)}
                className={`focus-ring min-h-11 border px-2 text-[0.7rem] capitalize ${
                  kit.healerBed === bed
                    ? "border-[var(--holive-gold)] bg-[var(--holive-gold)] text-[var(--holive-black)]"
                    : "border-white/15 text-white/75"
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

        {!kit.harmonicMode && (
          <label className="block">
            <span className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
              {labels.pitch}: {selectedPad.label}
            </span>
            <input
              type="range"
              min={pitchMin}
              max={pitchMax}
              step={1}
              inputMode="none"
              value={Math.round(selectedPad.tone)}
              onChange={(e) => {
                updateSelectedPitch(Number(e.target.value));
                blurRange(e.target);
              }}
              onPointerUp={(e) => blurRange(e.currentTarget)}
              onTouchEnd={(e) => blurRange(e.currentTarget)}
              className="mt-2 h-8 w-full accent-[var(--holive-gold)] sm:mt-3"
            />
            <div className="mt-1 flex justify-between font-mono-code text-[0.65rem] text-white/45">
              <span>{labels.lower}</span>
              <span className="text-[var(--holive-gold)]">
                {Math.round(selectedPad.tone)}Hz
              </span>
              <span>{labels.higher}</span>
            </div>
          </label>
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

        <p className="font-mono-code text-[0.65rem] tracking-[0.14em] text-white/40 uppercase">
          {labels.jamStreak}: {kit.jamStreak}
        </p>
      </div>
    </div>
  );

  const seqPanel = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSeqToggle}
          className="focus-ring min-h-11 border border-[var(--holive-gold)]/40 bg-[var(--holive-gold)]/15 px-4 text-xs text-[var(--holive-gold)]"
        >
          {seqPlaying ? labels.stop : labels.play}
        </button>
        <button
          type="button"
          onClick={() => setRecording((r) => !r)}
          className={`focus-ring min-h-11 border px-4 text-xs ${
            recording
              ? "border-rose-300/60 text-rose-200"
              : "border-white/15 text-white/75"
          }`}
        >
          {labels.record}
        </button>
        <button
          type="button"
          onClick={clearPattern}
          className="focus-ring min-h-11 border border-white/15 px-4 text-xs text-white/70"
        >
          {labels.clear}
        </button>
        {([8, 16] as FreestyleStepCount[]).map((n) => (
          <button
            key={n}
            type="button"
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
              onClick={() =>
                onKitChange(applyPatternPreset(kit, preset.id))
              }
              className="focus-ring shrink-0 min-h-10 border border-white/15 px-3 text-[0.7rem] text-white/75"
            >
              {labels[preset.labelKey as "presetPulse"]}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-2">
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
                    aria-label={`${pad.label} step ${s + 1}`}
                    onClick={() => toggleStep(ti, s)}
                    className={`h-8 min-w-[1.65rem] border transition ${
                      on
                        ? "border-transparent"
                        : "border-white/10 bg-black/30"
                    } ${now ? "ring-1 ring-[var(--holive-gold)]" : ""}`}
                    style={{
                      background: on
                        ? pad.color
                        : undefined,
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

  return (
    <div className="relative z-20 flex h-full min-h-0 w-full max-w-5xl flex-col gap-2 overflow-hidden lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.85fr)] lg:gap-4 lg:overflow-hidden">
      <section
        ref={boardRef}
        className="relative mx-auto aspect-square w-full max-h-[min(52svh,24rem)] max-w-[min(92vw,26rem)] shrink-0 touch-manipulation overflow-hidden border border-[var(--holive-gold)]/20 bg-[radial-gradient(ellipse_at_center,rgba(90,42,158,0.22),transparent_58%),radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.08),rgba(201,168,76,0.08))] sm:max-h-[min(56svh,26rem)] lg:max-h-none lg:h-full lg:max-w-none lg:aspect-auto"
        style={{ WebkitUserSelect: "none", userSelect: "none" }}
      >
        <div className="pointer-events-none absolute inset-x-3 top-2 z-10 max-w-[70%] sm:left-4 sm:top-4 sm:max-w-xs">
          <p className="font-display text-base text-[var(--holive-gold)] sm:text-2xl">
            {labels.title}
          </p>
          <p className="mt-0.5 hidden text-xs leading-relaxed text-white/55 sm:mt-1 sm:block">
            {labels.subtitle}
          </p>
        </div>

        {sessionPhase !== "idle" && (
          <div className="pointer-events-none absolute right-2 top-2 z-10 border border-[var(--holive-gold)]/30 bg-black/50 px-2 py-1 font-mono-code text-[0.55rem] tracking-[0.18em] text-[var(--holive-gold)] uppercase sm:right-4 sm:top-4">
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
              transition: reduced ? undefined : "opacity 0.8s ease, transform 1.6s ease",
            }}
          />
        )}

        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--holive-gold)]/15 ${
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
              tabIndex={0}
              aria-label={`${labels.pad} ${i + 1}: ${pad.label}`}
              onPointerDown={(e) => onPadPointerDown(e, pad, i)}
              onTouchStart={onPadTouchStart}
              onClick={(e) => {
                // click fallback for keyboard / non-pointer
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
                  : "color-mix(in srgb, #10602f 78%, black)",
                borderColor: active
                  ? "rgba(255,255,255,0.65)"
                  : "rgba(201,168,76,0.35)",
                boxShadow: active
                  ? `0 0 22px ${pad.color}, inset 0 0 14px rgba(255,255,255,0.15)`
                  : reduced
                    ? "inset 0 0 12px rgba(90,42,158,0.2)"
                    : `0 0 16px color-mix(in srgb, ${pad.color} 28%, transparent), inset 0 0 12px rgba(90,42,158,0.25)`,
                opacity: gated ? 0.55 : 1,
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
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
              <span className="pointer-events-none font-display text-[clamp(0.65rem,2.8vw,0.95rem)] text-white drop-shadow sm:text-sm">
                {pad.label}
              </span>
              <span className="pointer-events-none absolute bottom-[12%] font-mono-code text-[clamp(0.45rem,1.8vw,0.6rem)] tracking-[0.12em] text-white/60 sm:bottom-auto sm:mt-8 sm:static">
                {Math.round(pad.tone)}Hz
              </span>
            </button>
          );
        })}

        {holiReaction && (
          <div className="pointer-events-none absolute inset-x-4 bottom-14 z-20 text-center font-display text-sm text-[var(--holive-gold)] sm:bottom-16 sm:text-base">
            {holiReaction}
          </div>
        )}

        {!hits && (
          <p className="pointer-events-none absolute inset-x-6 bottom-16 text-center font-display text-sm text-white/45 sm:bottom-20">
            {labels.coachEmpty}
          </p>
        )}
      </section>

      <div className="flex shrink-0 items-center justify-between gap-2 border border-white/10 bg-black/45 px-3 py-2 lg:hidden">
        <div className="min-w-0 font-mono-code text-[0.65rem] text-white/70">
          <span className="text-[var(--holive-gold)]">{hits}</span>{" "}
          {labels.hits}
          <span className="mx-2 text-white/25">·</span>
          {formatTime(sessionSeconds)}
          {recording && (
            <span className="ml-2 text-rose-300">● {labels.record}</span>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className="focus-ring min-h-11 shrink-0 border border-white/20 px-3 text-xs text-white/85"
            onClick={() => {
              blurActive();
              setDrawer((d) => (d === "seq" ? null : "seq"));
            }}
            aria-expanded={drawer === "seq"}
          >
            {labels.sequencer}
          </button>
          <button
            type="button"
            className="focus-ring min-h-11 shrink-0 border border-white/20 px-3 text-xs text-white/85"
            onClick={() => {
              blurActive();
              setDrawer((d) => (d === "kit" ? null : "kit"));
            }}
            aria-expanded={drawer === "kit"}
          >
            {drawer === "kit" ? "✕" : labels.kit}
          </button>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[min(58svh,28rem)] overflow-y-auto overscroll-contain border-t border-[var(--holive-gold)]/30 bg-[#0a0614]/96 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-display text-lg text-[var(--holive-gold)]">
              {drawer === "kit" ? labels.kit : labels.sequencer}
            </p>
            <button
              type="button"
              className="focus-ring min-h-11 border border-white/20 px-3 text-xs text-white/80"
              onClick={() => setDrawer(null)}
            >
              {labels.close}
            </button>
          </div>
          {drawer === "kit" ? kitPanel : seqPanel}
        </div>
      )}

      <aside className="hidden min-h-0 overflow-y-auto overscroll-contain border border-white/10 bg-[linear-gradient(165deg,rgba(20,10,40,0.85),rgba(0,0,0,0.55))] p-4 backdrop-blur-sm lg:block">
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
      </aside>
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
