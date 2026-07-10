"use client";

import { useEffect, useState } from "react";
import { NODE_COLORS, type LevelDef } from "@/lib/game/levels";

type Props = {
  level: LevelDef;
  lit: number | null;
  distractor: number | null;
  phase: string;
  reduced: boolean;
  streak: number;
  onNode: (idx: number) => void;
  disabled: boolean;
  nodeLabel: (n: number) => string;
};

type Pos = { x: number; y: number };

function baseLayout(count: number): Pos[] {
  if (count <= 4) {
    return [
      { x: 28, y: 28 },
      { x: 72, y: 28 },
      { x: 28, y: 72 },
      { x: 72, y: 72 },
    ];
  }
  if (count === 5) {
    return [
      { x: 50, y: 18 },
      { x: 78, y: 42 },
      { x: 68, y: 78 },
      { x: 32, y: 78 },
      { x: 22, y: 42 },
    ];
  }
  return [
    { x: 50, y: 14 },
    { x: 82, y: 36 },
    { x: 82, y: 70 },
    { x: 50, y: 88 },
    { x: 18, y: 70 },
    { x: 18, y: 36 },
  ];
}

/**
 * Dynamic neural node board — drift, orbit, pulse rings, trails.
 */
export function NeuralBoard({
  level,
  lit,
  distractor,
  phase,
  reduced,
  streak,
  onNode,
  disabled,
  nodeLabel,
}: Props) {
  const [t, setT] = useState(0);
  const [trails, setTrails] = useState<{ id: number; idx: number; x: number; y: number }[]>(
    [],
  );
  const trailId = useState(() => ({ n: 0 }))[0];

  useEffect(() => {
    if (reduced || (!level.drift && !level.orbit && !level.moving)) return;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const mobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const frameBudget = mobile ? 33 : 16;
    const tick = (now: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (now - last >= frameBudget) {
        last = now;
        setT((now - start) / 1000);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [level.drift, level.orbit, level.moving, reduced]);

  useEffect(() => {
    if (lit == null || reduced || !level.trails) return;
    const base = baseLayout(level.nodes);
    const p = positionFor(base[lit]!, lit, level, t, reduced);
    trailId.n += 1;
    const id = trailId.n;
    setTrails((prev) => [...prev.slice(-10), { id, idx: lit, x: p.x, y: p.y }]);
    const timer = window.setTimeout(() => {
      setTrails((prev) => prev.filter((tr) => tr.id !== id));
    }, 520);
    return () => window.clearTimeout(timer);
  }, [lit]); // eslint-disable-line react-hooks/exhaustive-deps

  const base = baseLayout(level.nodes);

  return (
    <div className="relative mx-auto my-auto aspect-square w-full max-w-[min(88vw,26rem)] shrink-0 landscape:max-w-[min(62vh,28rem)]">
      {/* soft orbit guide */}
      {level.orbit && !reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_srgb,var(--holive-gold)_18%,transparent)] opacity-40"
        />
      )}

      {trails.map((tr) => (
        <span
          key={tr.id}
          aria-hidden
          className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[6px] animate-[fadeIn_0.4s_ease]"
          style={{
            left: `${tr.x}%`,
            top: `${tr.y}%`,
            background: NODE_COLORS[tr.idx % NODE_COLORS.length],
          }}
        />
      ))}

      {base.slice(0, level.nodes).map((pos, i) => {
        const p = positionFor(pos, i, level, t, reduced);
        const isLit = lit === i;
        const isFake = distractor === i;
        const active = isLit || isFake;
        const color = NODE_COLORS[i % NODE_COLORS.length]!;

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            aria-label={nodeLabel(i + 1)}
            onClick={() => onNode(i)}
            className="focus-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition active:scale-[0.97] disabled:cursor-default"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: level.nodes >= 6 ? "22%" : level.nodes === 5 ? "24%" : "36%",
              aspectRatio: "1",
              background: active
                ? color
                : "color-mix(in srgb, #1a003d 80%, black)",
              borderColor: active
                ? "rgba(255,255,255,0.55)"
                : "rgba(201,168,76,0.28)",
              boxShadow: active
                ? `0 0 36px ${color}, inset 0 0 24px rgba(255,255,255,0.15)`
                : reduced
                  ? "inset 0 0 18px rgba(90,42,158,0.25)"
                  : "inset 0 0 22px rgba(90,42,158,0.3), 0 0 24px rgba(90,42,158,0.12)",
              transform: `translate(-50%, -50%) scale(${active && !reduced ? 1.06 : 1})`,
              zIndex: active ? 2 : 1,
            }}
          >
            {level.pulseRings && active && !reduced && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[-18%] rounded-full border border-white/40 neural-pulse-ring"
              />
            )}
            <span
              className="mx-auto block h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
              style={{
                background: active
                  ? "rgba(255,255,255,0.9)"
                  : streak >= 3
                    ? "rgba(201,168,76,0.55)"
                    : "rgba(201,168,76,0.35)",
              }}
            />
          </button>
        );
      })}

      {phase === "watch" && level.distractors && !reduced && (
        <span className="sr-only">Distractors active</span>
      )}
    </div>
  );
}

function positionFor(
  base: Pos,
  i: number,
  level: LevelDef,
  t: number,
  reduced: boolean,
): Pos {
  if (reduced) return base;

  let { x, y } = base;

  if (level.orbit) {
    const angle = (i / level.nodes) * Math.PI * 2 + t * 0.35;
    const radius = 34;
    x = 50 + Math.cos(angle) * radius;
    y = 50 + Math.sin(angle) * radius;
  } else if (level.drift) {
    x += Math.sin(t * 0.7 + i * 1.3) * 2.2;
    y += Math.cos(t * 0.55 + i * 0.9) * 2.2;
  }

  if (level.moving) {
    x += Math.sin(t * 1.1 + i * 2.1) * 3.5;
    y += Math.cos(t * 0.95 + i * 1.7) * 3.5;
  }

  return {
    x: Math.min(88, Math.max(12, x)),
    y: Math.min(88, Math.max(12, y)),
  };
}
