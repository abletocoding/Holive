"use client";

import type { ChartNote } from "@/lib/game/freestyleSongs";

type Props = {
  notes: ChartNote[];
  beatMs: number;
  elapsedMs: number;
  padCount: number;
  padColors: string[];
  reduced: boolean;
};

/**
 * Mobile-friendly approaching cues — glowing rings rise toward a hit line.
 */
export function SongHighway({
  notes,
  beatMs,
  elapsedMs,
  padCount,
  padColors,
  reduced,
}: Props) {
  const lookAheadMs = beatMs * 4;
  const upcoming = notes.filter((note) => {
    const t = note.beat * beatMs;
    return t >= elapsedMs - 40 && t <= elapsedMs + lookAheadMs;
  });

  return (
    <div
      className="pointer-events-none relative mx-auto h-16 w-full max-w-md overflow-hidden sm:h-20"
      aria-hidden
    >
      <div className="absolute inset-x-3 bottom-2 h-px bg-[var(--holive-gold)]/50" />
      <div
        className="absolute inset-x-0 bottom-0 top-0 grid gap-1 px-2"
        style={{ gridTemplateColumns: `repeat(${padCount}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: padCount }, (_, lane) => (
          <div key={lane} className="relative">
            {upcoming
              .filter((note) => note.pad === lane)
              .map((note) => {
                const target = note.beat * beatMs;
                const progress = 1 - (target - elapsedMs) / lookAheadMs;
                const y = Math.min(1, Math.max(0, progress));
                const near = Math.abs(target - elapsedMs) < 120;
                return (
                  <span
                    key={`${note.beat}-${note.pad}`}
                    className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 sm:h-3.5 sm:w-3.5 ${
                      near && !reduced ? "animate-pulse" : ""
                    }`}
                    style={{
                      bottom: `${y * 85}%`,
                      borderColor: padColors[lane] ?? "var(--holive-gold)",
                      background: near
                        ? (padColors[lane] ?? "var(--holive-gold)")
                        : "transparent",
                      boxShadow: near
                        ? `0 0 14px ${padColors[lane] ?? "var(--holive-gold)"}`
                        : undefined,
                      opacity: 0.35 + y * 0.65,
                    }}
                  />
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
