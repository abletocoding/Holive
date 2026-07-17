"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-014 — Golden vortex: harvest spiral of intention. */
export function ExpGoldenVortex() {
  const t = useTranslations("Experiments.files.vortex");
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;
    let angle = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = () => {
      if (!reduced) angle += 0.012;
      ctx.fillStyle = "rgba(10,8,16,0.22)";
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const arms = 5;
      const points = reduced ? 80 : 160;
      for (let a = 0; a < arms; a++) {
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const t = i / points;
          const r = t * Math.min(w, h) * 0.42;
          const theta = angle + a * ((Math.PI * 2) / arms) + t * Math.PI * 4;
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          a % 2 === 0 ? `rgba(201,168,76,${0.35 + (a % 3) * 0.1})` : `rgba(107,61,184,${0.4})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#C9A84C";
      ctx.fill();
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <ExperimentFile
      id="exp-vortex"
      code="EXP-017"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={wrapRef}
        className="relative aspect-square max-h-[28rem] w-full overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_30%,transparent)] bg-[#0a0810]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono-code text-[0.6rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
          {t("hint")}
        </p>
      </div>
    </ExperimentFile>
  );
}
