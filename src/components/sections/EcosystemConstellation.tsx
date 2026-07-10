"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

type Node = {
  id: string;
  labelKey: "brand" | "ops" | "code" | "content" | "clients" | "core";
  x: number;
  y: number;
  homeX: number;
  homeY: number;
};

const EDGES: [string, string][] = [
  ["core", "brand"],
  ["core", "ops"],
  ["core", "code"],
  ["core", "content"],
  ["core", "clients"],
  ["brand", "content"],
  ["ops", "code"],
  ["clients", "brand"],
  ["clients", "ops"],
];

function makeNodes(): Node[] {
  const base: Omit<Node, "homeX" | "homeY">[] = [
    { id: "core", labelKey: "core", x: 50, y: 48 },
    { id: "brand", labelKey: "brand", x: 22, y: 28 },
    { id: "ops", labelKey: "ops", x: 78, y: 26 },
    { id: "code", labelKey: "code", x: 82, y: 68 },
    { id: "content", labelKey: "content", x: 18, y: 70 },
    { id: "clients", labelKey: "clients", x: 50, y: 16 },
  ];
  return base.map((n) => ({ ...n, homeX: n.x, homeY: n.y }));
}

/** Tuggable living-ecosystem constellation. */
export function EcosystemConstellation() {
  const t = useTranslations("Experience.ecosystem");
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const [nodes, setNodes] = useState(makeNodes);
  const [drag, setDrag] = useState<string | null>(null);
  const [active, setActive] = useState("core");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduced || drag) return;
    let raf = 0;
    const tick = () => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          x: n.x + (n.homeX - n.x) * 0.04,
          y: n.y + (n.homeY - n.y) * 0.04,
        })),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, drag]);

  const toSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 50, y: 50 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const onPointerDown = (id: string, e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag(id);
    setActive(id);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const { x, y } = toSvg(e.clientX, e.clientY);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === drag
          ? { ...n, x: Math.min(92, Math.max(8, x)), y: Math.min(90, Math.max(10, y)) }
          : n,
      ),
    );
  };

  const onPointerUp = () => setDrag(null);

  const map = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <ExperienceBand
      id="ecosistema"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
    >
      <div className="overflow-hidden border border-[var(--border)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--holive-purple)_14%,var(--background)),var(--background)_60%)]">
        <p className="border-b border-[var(--border)] px-4 py-2 font-mono-code text-[0.65rem] tracking-[0.2em] text-[color-mix(in_srgb,var(--foreground)_55%,transparent)]">
          {coarse ? t("hintTouch") : t("hint")}
        </p>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="h-[min(22rem,70vw)] w-full touch-none"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="img"
          aria-label={t("title")}
        >
          {EDGES.map(([a, b]) => {
            const na = map[a];
            const nb = map[b];
            if (!na || !nb) return null;
            const lit = active === a || active === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={lit ? "#C9A84C" : "color-mix(in srgb, #330072 45%, transparent)"}
                strokeWidth={lit ? 0.45 : 0.25}
              />
            );
          })}
          {nodes.map((n) => {
            const lit = active === n.id;
            return (
              <g
                key={n.id}
                onPointerDown={(e) => onPointerDown(n.id, e)}
                onPointerEnter={() => setActive(n.id)}
                style={{ cursor: "grab" }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.id === "core" ? 5.5 : 3.8}
                  fill={lit ? "#330072" : "color-mix(in srgb, #330072 70%, #101820)"}
                  stroke="#C9A84C"
                  strokeWidth={lit ? 0.55 : 0.3}
                />
                <text
                  x={n.x}
                  y={n.y + (n.id === "core" ? 9.5 : 7.5)}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="2.4"
                  className="font-mono-code"
                  style={{ pointerEvents: "none" }}
                >
                  {t(`nodes.${n.labelKey}`)}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="border-t border-[var(--border)] px-4 py-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]">
          {t(`blurbs.${map[active]?.labelKey ?? "core"}`)}
        </p>
      </div>
    </ExperienceBand>
  );
}
