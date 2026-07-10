"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  className?: string;
};

/**
 * Touch/pointer-reactive aurora — lightweight canvas 2D (no WebGL).
 * Premium mobile fallback that still feels branded and alive.
 */
export function TouchAurora({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const pointer = { x: 0.55, y: 0.4, tx: 0.55, ty: 0.4 };
    const t0 = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth || window.innerWidth;
      h = parent?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / Math.max(1, rect.width);
      pointer.ty = (e.clientY - rect.top) / Math.max(1, rect.height);
    };

    const draw = (now: number) => {
      const t = (now - t0) * 0.001;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      // Deep void base
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "rgba(26,0,61,0.55)");
      base.addColorStop(0.5, "rgba(16,24,32,0.35)");
      base.addColorStop(1, "rgba(16,24,32,0.6)");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      if (!reduced) {
        const blobs = [
          {
            x: pointer.x * w,
            y: pointer.y * h,
            r: Math.min(w, h) * 0.42,
            c0: "rgba(107,61,184,0.45)",
            c1: "rgba(107,61,184,0)",
          },
          {
            x: (1 - pointer.x) * w * 0.85 + Math.sin(t * 0.4) * 40,
            y: pointer.y * h * 0.7 + Math.cos(t * 0.35) * 30,
            r: Math.min(w, h) * 0.32,
            c0: "rgba(201,168,76,0.28)",
            c1: "rgba(201,168,76,0)",
          },
          {
            x: w * 0.2 + Math.cos(t * 0.25) * 50,
            y: h * 0.75,
            r: Math.min(w, h) * 0.28,
            c0: "rgba(51,0,114,0.4)",
            c1: "rgba(51,0,114,0)",
          },
        ];

        for (const b of blobs) {
          const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g.addColorStop(0, b.c0);
          g.addColorStop(1, b.c1);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
