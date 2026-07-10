"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Node = {
  id: string;
  x: number;
  y: number;
  labelKey: "brand" | "code" | "pulse" | "grow" | "sync" | "core";
  r: number;
};

const NODES: Node[] = [
  { id: "core", x: 50, y: 48, labelKey: "core", r: 9 },
  { id: "n1", x: 18, y: 28, labelKey: "brand", r: 5.5 },
  { id: "n2", x: 82, y: 24, labelKey: "code", r: 5.5 },
  { id: "n3", x: 14, y: 72, labelKey: "pulse", r: 5 },
  { id: "n4", x: 78, y: 70, labelKey: "grow", r: 5.5 },
  { id: "n5", x: 50, y: 14, labelKey: "sync", r: 4.5 },
];

const EDGES: [string, string][] = [
  ["core", "n1"],
  ["core", "n2"],
  ["core", "n3"],
  ["core", "n4"],
  ["core", "n5"],
  ["n1", "n5"],
  ["n2", "n5"],
  ["n1", "n3"],
  ["n2", "n4"],
];

/** Holive-flavored digital nervous system — constellation mesh, not a globe clone. */
export function NeuralMesh() {
  const t = useTranslations("Widgets.neural");
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<string | null>("core");
  const [tick, setTick] = useState(0);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (hoverRef.current) return;
      setTick((n) => n + 1);
      setActive((prev) => {
        const idx = NODES.findIndex((n) => n.id === prev);
        return NODES[(idx + 1) % NODES.length]!.id;
      });
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduced]);

  const nodeMap = useMemo(() => {
    const m = new Map<string, Node>();
    for (const n of NODES) m.set(n.id, n);
    return m;
  }, []);

  const onEnter = useCallback((id: string) => {
    hoverRef.current = true;
    setActive(id);
  }, []);

  const onLeave = useCallback(() => {
    hoverRef.current = false;
  }, []);

  const activeNode = nodeMap.get(active ?? "core") ?? NODES[0]!;

  return (
    <div className="relative overflow-hidden border border-[var(--border)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--holive-purple)_18%,var(--background)),var(--background)_55%)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2.5">
        <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
          {t("eyebrow")}
        </p>
        <span className="font-mono-code flex items-center gap-1.5 text-[0.65rem] text-[color-mix(in_srgb,var(--foreground)_55%,transparent)]">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--holive-gold)]"
            style={{
              boxShadow: reduced
                ? undefined
                : "0 0 8px rgba(201,168,76,0.8)",
              animation: reduced ? undefined : "pulseDot 1.6s ease-in-out infinite",
            }}
          />
          {t("live")}
        </span>
      </div>

      <div className="relative aspect-[16/10] w-full md:aspect-[2/1]">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <radialGradient id="holive-mesh-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(201,168,76,0.35)" />
              <stop offset="100%" stopColor="rgba(201,168,76,0)" />
            </radialGradient>
          </defs>

          {EDGES.map(([a, b]) => {
            const na = nodeMap.get(a)!;
            const nb = nodeMap.get(b)!;
            const lit = active === a || active === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={
                  lit
                    ? "rgba(201,168,76,0.75)"
                    : "rgba(90,42,158,0.35)"
                }
                strokeWidth={lit ? 0.55 : 0.28}
                strokeDasharray={lit && !reduced ? "2 1.5" : undefined}
                style={
                  lit && !reduced
                    ? { strokeDashoffset: -(tick % 20) }
                    : undefined
                }
              />
            );
          })}

          {!reduced && (
            <circle
              cx={activeNode.x}
              cy={activeNode.y}
              r={18}
              fill="url(#holive-mesh-glow)"
              opacity={0.85}
            />
          )}

          {NODES.map((n) => {
            const isActive = n.id === active;
            const isCore = n.id === "core";
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer outline-none"
                onMouseEnter={() => onEnter(n.id)}
                onMouseLeave={onLeave}
                onFocus={() => onEnter(n.id)}
                onBlur={onLeave}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onEnter(n.id);
                  }
                }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isActive ? n.r + 1.2 : n.r}
                  fill={
                    isCore
                      ? "var(--holive-purple)"
                      : isActive
                        ? "var(--holive-gold)"
                        : "color-mix(in srgb, var(--holive-purple) 70%, #1a003d)"
                  }
                  stroke={
                    isActive
                      ? "var(--holive-gold-bright)"
                      : "rgba(201,168,76,0.35)"
                  }
                  strokeWidth={isActive ? 0.7 : 0.35}
                  style={
                    isActive && !reduced
                      ? {
                          filter:
                            "drop-shadow(0 0 6px rgba(201,168,76,0.55))",
                        }
                      : undefined
                  }
                />
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)] via-[color-mix(in_srgb,var(--background)_70%,transparent)] to-transparent px-4 pb-4 pt-10">
          <p className="font-display text-lg font-semibold text-[var(--holive-gold)] md:text-xl">
            {t(`nodes.${activeNode.labelKey}.title`)}
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
            {t(`nodes.${activeNode.labelKey}.text`)}
          </p>
          <p className="font-mono-code mt-2 text-[0.6rem] tracking-[0.2em] text-[color-mix(in_srgb,var(--foreground)_40%,transparent)]">
            {t("hint")}
          </p>
        </div>
      </div>
    </div>
  );
}
