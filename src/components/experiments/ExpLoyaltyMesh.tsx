"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Node = { id: string; x: number; y: number; homeX: number; homeY: number };

/** EXP-004 — Loyalty mesh constellation (drag nodes). */
export function ExpLoyaltyMesh() {
  const t = useTranslations("Experiments.files.mesh");
  const reduced = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([
    { id: "core", x: 50, y: 48, homeX: 50, homeY: 48 },
    { id: "brand", x: 22, y: 28, homeX: 22, homeY: 28 },
    { id: "ops", x: 78, y: 26, homeX: 78, homeY: 26 },
    { id: "code", x: 18, y: 70, homeX: 18, homeY: 70 },
    { id: "clients", x: 82, y: 72, homeX: 82, homeY: 72 },
  ]);
  const drag = useRef<string | null>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      setNodes((prev) =>
        prev.map((n) => {
          if (drag.current === n.id) return n;
          return {
            ...n,
            x: n.x + (n.homeX - n.x) * 0.06,
            y: n.y + (n.homeY - n.y) * 0.06,
          };
        }),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const move = (clientX: number, clientY: number) => {
    if (!drag.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    const y = ((clientY - r.top) / r.height) * 100;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === drag.current
          ? { ...n, x: Math.min(92, Math.max(8, x)), y: Math.min(88, Math.max(12, y)) }
          : n,
      ),
    );
  };

  const edges: [string, string][] = [
    ["core", "brand"],
    ["core", "ops"],
    ["core", "code"],
    ["core", "clients"],
    ["brand", "ops"],
    ["code", "clients"],
  ];

  return (
    <ExperimentFile
      id="exp-mesh"
      code="EXP-004"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="aspect-[16/10] w-full touch-none rounded-sm border border-[var(--border)] bg-[#0a0810]"
        onPointerMove={(e) => move(e.clientX, e.clientY)}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      >
        {edges.map(([a, b]) => {
          const na = nodes.find((n) => n.id === a)!;
          const nb = nodes.find((n) => n.id === b)!;
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="0.4"
            />
          );
        })}
        {nodes.map((n) => (
          <g
            key={n.id}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = n.id;
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={n.id === "core" ? 4.2 : 3.2}
              fill={n.id === "core" ? "#C9A84C" : "#6B3DB8"}
              stroke="#FAFAF8"
              strokeWidth="0.35"
            />
            <text
              x={n.x}
              y={n.y + 7}
              textAnchor="middle"
              fill="#C9A84C"
              fontSize="2.6"
              className="font-mono-code"
            >
              {t(`nodes.${n.id}`)}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-2 font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[var(--holive-gold)]">
        {t("hint")}
      </p>
    </ExperimentFile>
  );
}
