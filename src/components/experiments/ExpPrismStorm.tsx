"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-005 — Prism of attention (particle storm). */
export function ExpPrismStorm() {
  const t = useTranslations("Experiments.files.prism");
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
    let mx = 0.5;
    let my = 0.5;
    const ps = Array.from({ length: reduced ? 20 : 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      gold: Math.random() > 0.5,
    }));

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.6);
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = (e.clientX - r.left) / Math.max(1, r.width);
      my = (e.clientY - r.top) / Math.max(1, r.height);
    };

    const tick = () => {
      ctx.fillStyle = "rgba(10,8,16,0.25)";
      ctx.fillRect(0, 0, w, h);
      const cx = mx * w;
      const cy = my * h;
      for (const p of ps) {
        if (!reduced) {
          p.x += p.vx + (mx - 0.5) * 0.0012 * p.z;
          p.y += p.vy + (my - 0.5) * 0.0012 * p.z;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
          p.x = Math.min(1, Math.max(0, p.x));
          p.y = Math.min(1, Math.max(0, p.y));
        }
        const x = p.x * w;
        const y = p.y * h;
        const dist = Math.hypot(x - cx, y - cy);
        const glow = Math.max(0, 1 - dist / (w * 0.4));
        ctx.beginPath();
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${0.3 + glow * 0.7})`
          : `rgba(107,61,184,${0.3 + glow * 0.7})`;
        ctx.arc(x, y, 1.2 + p.z * 3.5 + glow * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.16);
      g.addColorStop(0, "rgba(241,181,0,0.4)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.16, 0, Math.PI * 2);
      ctx.fill();
      raf = requestAnimationFrame(tick);
    };

    resize();
    wrap.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <ExperimentFile
      id="exp-prism"
      code="EXP-005"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={wrapRef}
        className="relative aspect-[16/10] overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_30%,transparent)]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <p className="pointer-events-none absolute bottom-3 left-3 font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[var(--holive-gold)]">
          {t("hint")}
        </p>
      </div>
    </ExperimentFile>
  );
}
