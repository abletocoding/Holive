"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperimentFile } from "@/components/experiments/ExperimentFile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** EXP-011 — Liquid brief: metaball ink that follows the cursor. */
export function ExpLiquidBrief() {
  const t = useTranslations("Experiments.files.liquid");
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
    let my = 0.55;
    const blobs = Array.from({ length: reduced ? 4 : 7 }, (_, i) => ({
      x: 0.3 + (i % 3) * 0.2,
      y: 0.4 + (i % 2) * 0.15,
      r: 38 + i * 8,
      ox: Math.random() * Math.PI * 2,
    }));

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

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = (e.clientX - r.left) / Math.max(1, r.width);
      my = (e.clientY - r.top) / Math.max(1, r.height);
    };

    const t0 = performance.now();
    const tick = (now: number) => {
      const time = (now - t0) / 1000;
      ctx.fillStyle = "#0a0810";
      ctx.fillRect(0, 0, w, h);
      const img = ctx.createImageData(Math.floor(w / 2), Math.floor(h / 2));
      const data = img.data;
      const iw = img.width;
      const ih = img.height;
      for (let y = 0; y < ih; y++) {
        for (let x = 0; x < iw; x++) {
          let sum = 0;
          const px = (x / iw) * w;
          const py = (y / ih) * h;
          for (let i = 0; i < blobs.length; i++) {
            const b = blobs[i];
            const bx =
              (b.x + Math.sin(time * 0.7 + b.ox) * 0.04 + (mx - 0.5) * (0.12 + i * 0.01)) * w;
            const by =
              (b.y + Math.cos(time * 0.6 + b.ox) * 0.03 + (my - 0.5) * (0.1 + i * 0.01)) * h;
            const dx = px - bx;
            const dy = py - by;
            sum += (b.r * b.r) / (dx * dx + dy * dy + 1);
          }
          const idx = (y * iw + x) * 4;
          if (sum > 1.15) {
            const gold = sum > 1.55;
            data[idx] = gold ? 201 : 51;
            data[idx + 1] = gold ? 168 : 0;
            data[idx + 2] = gold ? 76 : 114;
            data[idx + 3] = 230;
          }
        }
      }
      const tmp = document.createElement("canvas");
      tmp.width = iw;
      tmp.height = ih;
      tmp.getContext("2d")!.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(tmp, 0, 0, w, h);
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
      id="exp-liquid"
      code="EXP-014"
      status={t("status")}
      title={t("title")}
      summary={t("summary")}
      refran={t("refran")}
    >
      <div
        ref={wrapRef}
        className="relative aspect-[16/10] overflow-hidden rounded-sm border border-[var(--border)]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <p className="pointer-events-none absolute bottom-3 left-3 font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[var(--holive-gold)]">
          {t("hint")}
        </p>
      </div>
    </ExperimentFile>
  );
}
