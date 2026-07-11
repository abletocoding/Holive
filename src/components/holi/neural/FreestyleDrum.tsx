"use client";

import type {
  FreestyleKit,
  FreestylePad,
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
    pad: string;
  };
  onPad: (pad: FreestylePad, index: number) => void;
  onKitChange: (kit: FreestyleKit) => void;
};

const THEMES: FreestyleTheme[] = ["heal", "pulse", "gold", "night"];

export function FreestyleDrum({
  kit,
  activePad,
  hits,
  sessionSeconds,
  reduced,
  labels,
  onPad,
  onKitChange,
}: Props) {
  const laidOut = kitWithLayout(kit);

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

  return (
    <div className="relative z-20 grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="relative min-h-[26rem] overflow-hidden border border-[var(--holive-gold)]/20 bg-[radial-gradient(ellipse_at_center,rgba(90,42,158,0.25),rgba(0,0,0,0.38)_58%,rgba(201,168,76,0.08))]">
        <div className="absolute left-4 top-4 z-10 max-w-xs">
          <p className="font-display text-2xl text-[var(--holive-gold)]">{labels.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/55">{labels.subtitle}</p>
        </div>

        <div
          aria-hidden
          className={`absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--holive-gold)]/15 ${
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
              onClick={() => onPad(pad, i)}
              className="focus-ring absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 transition active:scale-95"
              style={{
                left: `${pad.x}%`,
                top: `${pad.y}%`,
                width: "clamp(4.75rem, 18vw, 7rem)",
                aspectRatio: "1",
                background: active
                  ? pad.color
                  : "color-mix(in srgb, #16002f 78%, black)",
                borderColor: active ? "rgba(255,255,255,0.65)" : "rgba(201,168,76,0.32)",
                boxShadow: active
                  ? `0 0 42px ${pad.color}, inset 0 0 26px rgba(255,255,255,0.18)`
                  : `0 0 26px color-mix(in srgb, ${pad.color} 28%, transparent), inset 0 0 18px rgba(90,42,158,0.3)`,
              }}
            >
              {active && !reduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-[-18%] rounded-full border border-white/35 neural-pulse-ring"
                />
              )}
              <span className="font-display text-sm text-white drop-shadow">{pad.label}</span>
              <span className="font-mono-code mt-1 text-[0.55rem] tracking-[0.16em] text-white/65">
                {Math.round(pad.tone)}Hz
              </span>
            </button>
          );
        })}
      </section>

      <aside className="border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2">
          <Stat label={labels.hits} value={String(hits)} />
          <Stat label={labels.session} value={formatTime(sessionSeconds)} />
        </div>

        <label className="mt-5 block">
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
            className="mt-3 w-full accent-[var(--holive-gold)]"
          />
          <span className="font-mono-code mt-1 block text-xs text-[var(--holive-gold)]">
            {kit.tempo} BPM
          </span>
        </label>

        <button
          type="button"
          onClick={() => onKitChange(kitWithLayout({ ...kit, metronome: !kit.metronome }))}
          className="focus-ring mt-4 min-h-10 w-full border border-white/15 px-3 text-xs text-white/80 hover:border-[var(--holive-gold)]/50"
        >
          {labels.metronome}: {kit.metronome ? labels.metronomeOn : labels.metronomeOff}
        </button>

        <div className="mt-5">
          <p className="font-mono-code text-[0.6rem] tracking-[0.22em] text-white/45 uppercase">
            {labels.theme}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => updateTheme(theme)}
                className={`focus-ring min-h-10 border px-3 text-xs capitalize ${
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
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/30 px-3 py-3 text-center">
      <p className="font-mono-code text-[0.55rem] tracking-[0.2em] text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-lg text-[var(--holive-gold)]">{value}</p>
    </div>
  );
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.max(0, Math.floor(seconds % 60));
  return `${min}:${String(sec).padStart(2, "0")}`;
}
