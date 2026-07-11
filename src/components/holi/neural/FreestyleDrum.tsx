"use client";

import { useMemo, useState } from "react";
import type {
  FreestyleKit,
  FreestylePad,
  FreestylePadCount,
  FreestyleTheme,
} from "@/lib/game/freestyleKit";
import { kitWithLayout, themePadColors } from "@/lib/game/freestyleKit";

type Props = {
  kit: FreestyleKit;
  activePad: string | null;
  hits: number;
  sessionSeconds: number;
  reduced: boolean;
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
  };
  onHit: (pad: FreestylePad, index: number) => void;
  onKitChange: (kit: FreestyleKit) => void;
};

const THEMES: FreestyleTheme[] = ["heal", "pulse", "gold", "night"];
const PAD_COUNTS: FreestylePadCount[] = [4, 6, 8];

export function FreestyleDrum({
  kit,
  activePad,
  hits,
  sessionSeconds,
  reduced,
  labels,
  onHit,
  onKitChange,
}: Props) {
  const laidOut = kitWithLayout(kit);
  const [selectedPadId, setSelectedPadId] = useState(laidOut.pads[0]?.id ?? "root");
  const selectedIndex = Math.max(
    0,
    laidOut.pads.findIndex((pad) => pad.id === (activePad ?? selectedPadId)),
  );
  const selectedPad = laidOut.pads[selectedIndex] ?? laidOut.pads[0]!;
  const pitchMin = Math.max(80, Math.round(selectedPad.tone * 0.5));
  const pitchMax = Math.min(1200, Math.round(selectedPad.tone * 1.8));

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
    onKitChange(kitWithLayout({ ...kit, padCount }));
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

  const dust = useMemo(() => [0, 1, 2, 3, 4], []);
  const padWidth =
    laidOut.padCount >= 8
      ? "clamp(2.75rem, 14vmin, 5.5rem)"
      : laidOut.padCount >= 6
        ? "clamp(3.1rem, 15.5vmin, 6.25rem)"
        : "clamp(3.5rem, 18vmin, 7rem)";

  return (
    <div className="relative z-20 grid h-full min-h-0 w-full max-w-5xl grid-rows-[minmax(0,1fr)_auto] gap-2 overflow-x-clip overflow-y-auto overscroll-contain sm:gap-3 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:grid-rows-1 lg:gap-4 lg:overflow-y-hidden">
      <section className="relative mx-auto aspect-square w-full max-h-[min(48svh,22rem)] max-w-[min(92vw,26rem)] shrink-0 overflow-hidden border border-[var(--holive-gold)]/20 touch-manipulation bg-[radial-gradient(ellipse_at_center,rgba(90,42,158,0.25),rgba(0,0,0,0.38)_58%,rgba(201,168,76,0.08))] sm:max-h-[min(56svh,26rem)] lg:max-h-none lg:max-w-none lg:h-full lg:aspect-auto">
        <div className="pointer-events-none absolute inset-x-3 top-2 z-10 max-w-[70%] sm:left-4 sm:top-4 sm:max-w-xs">
          <p className="font-display text-lg text-[var(--holive-gold)] sm:text-2xl">
            {labels.title}
          </p>
          <p className="mt-0.5 hidden text-xs leading-relaxed text-white/55 sm:mt-1 sm:block">
            {labels.subtitle}
          </p>
        </div>

        <div
          aria-hidden
          className={`absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--holive-gold)]/15 sm:h-[68%] sm:w-[68%] ${
            reduced ? "" : "animate-[spin_18s_linear_infinite]"
          }`}
        />

        {laidOut.pads.map((pad, i) => {
          const active = activePad === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              aria-label={`${labels.pad} ${i + 1}: ${pad.label}`}
              onClick={() => {
                setSelectedPadId(pad.id);
                onHit(pad, i);
              }}
              className="neural-touch focus-ring absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 transition active:scale-95"
              style={{
                left: `${pad.x}%`,
                top: `${pad.y}%`,
                width: padWidth,
                aspectRatio: "1",
                background: active
                  ? pad.color
                  : "color-mix(in srgb, #16002f 78%, black)",
                borderColor: active ? "rgba(255,255,255,0.65)" : "rgba(201,168,76,0.32)",
                boxShadow: active
                  ? `0 0 28px ${pad.color}, inset 0 0 18px rgba(255,255,255,0.18)`
                  : reduced
                    ? `inset 0 0 14px rgba(90,42,158,0.28)`
                    : `0 0 18px color-mix(in srgb, ${pad.color} 22%, transparent), inset 0 0 14px rgba(90,42,158,0.3)`,
              }}
            >
              {active && !reduced && (
                <>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-[-14%] rounded-full border border-white/35 neural-pulse-ring"
                  />
                  {dust.slice(0, 3).map((dot) => (
                    <span
                      key={dot}
                      aria-hidden
                      className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[var(--holive-gold)] shadow-[0_0_10px_var(--holive-gold)] animate-ping"
                      style={{
                        left: `${22 + dot * 18}%`,
                        top: `${18 + ((dot * 23) % 58)}%`,
                        animationDelay: `${dot * 55}ms`,
                      }}
                    />
                  ))}
                </>
              )}
              <span className="font-display text-[0.7rem] text-white drop-shadow sm:text-sm">
                {pad.label}
              </span>
              <span className="font-mono-code mt-0.5 text-[0.5rem] tracking-[0.14em] text-white/65 sm:mt-1 sm:text-[0.55rem] sm:tracking-[0.16em]">
                {Math.round(pad.tone)}Hz
              </span>
            </button>
          );
        })}
      </section>

      <aside className="shrink-0 border border-white/10 bg-black/35 p-3 backdrop-blur-sm sm:p-4 lg:overflow-y-auto lg:overscroll-contain">
        <div className="grid grid-cols-2 gap-2">
          <Stat label={labels.hits} value={String(hits)} />
          <Stat label={labels.session} value={formatTime(sessionSeconds)} />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4">
          <label className="block">
            <span className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
              {labels.tempo}
            </span>
            <input
              type="range"
              min={40}
              max={140}
              step={1}
              value={kit.tempo}
              onChange={(e) =>
                onKitChange(kitWithLayout({ ...kit, tempo: Number(e.target.value) }))
              }
              className="mt-2 h-8 w-full accent-[var(--holive-gold)] sm:mt-3"
            />
            <span className="font-mono-code mt-1 block text-xs text-[var(--holive-gold)]">
              {kit.tempo} BPM
            </span>
          </label>

          <button
            type="button"
            onClick={() =>
              onKitChange(kitWithLayout({ ...kit, metronome: !kit.metronome }))
            }
            className="focus-ring min-h-11 w-full border border-white/15 px-3 text-xs text-white/80 hover:border-[var(--holive-gold)]/50"
          >
            {labels.metronome}: {kit.metronome ? labels.metronomeOn : labels.metronomeOff}
          </button>

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
                    laidOut.padCount === count
                      ? "border-[var(--holive-gold)] bg-[var(--holive-gold)] text-[var(--holive-black)]"
                      : "border-white/15 text-white/75"
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
                      : "border-white/15 text-white/75"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
              {labels.pitch}: {selectedPad.label}
            </span>
            <input
              type="range"
              min={pitchMin}
              max={pitchMax}
              step={1}
              value={Math.round(selectedPad.tone)}
              onChange={(e) => updateSelectedPitch(Number(e.target.value))}
              className="mt-2 h-8 w-full accent-[var(--holive-gold)] sm:mt-3"
            />
            <div className="mt-1 flex justify-between font-mono-code text-[0.58rem] text-white/45">
              <span>{labels.lower}</span>
              <span className="text-[var(--holive-gold)]">{Math.round(selectedPad.tone)}Hz</span>
              <span>{labels.higher}</span>
            </div>
          </label>
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
      <p className="mt-1 font-display text-base text-[var(--holive-gold)] sm:text-lg">{value}</p>
    </div>
  );
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.max(0, Math.floor(seconds % 60));
  return `${min}:${String(sec).padStart(2, "0")}`;
}
