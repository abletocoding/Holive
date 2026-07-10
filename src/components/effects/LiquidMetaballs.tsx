"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  className?: string;
};

/**
 * Liquid metaball field — Holive purple/gold blobs via canvas blur composite.
 * Performance-capped blob count; CSS gradient fallback for reduced-motion.
 */
export function LiquidMetaballs({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const n = isMobile ? 4 : 6;

    type Blob = { x: number; y: number; r: number; vx: number; vy: number; gold: boolean };
    const blobs: Blob[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth || 600;
      h = parent?.clientHeight || 360;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      blobs.length = 0;
      for (let i = 0; i < n; i++) {
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 48 + Math.random() * (isMobile ? 40 : 70),
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          gold: i % 2 === 0,
        });
      }
    };

    resize();
    seed();

    const off = document.createElement("canvas");
    const octx = off.getContext("2d")!;

    const tick = () => {
      off.width = canvas.width;
      off.height = canvas.height;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, w, h);

      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;

        const g = octx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        if (b.gold) {
          g.addColorStop(0, "rgba(241,181,0,0.95)");
          g.addColorStop(0.45, "rgba(201,168,76,0.55)");
          g.addColorStop(1, "rgba(201,168,76,0)");
        } else {
          g.addColorStop(0, "rgba(122,58,196,0.95)");
          g.addColorStop(0.45, "rgba(51,0,114,0.55)");
          g.addColorStop(1, "rgba(51,0,114,0)");
        }
        octx.fillStyle = g;
        octx.beginPath();
        octx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        octx.fill();
      }

      ctx.clearRect(0, 0, w, h);
      ctx.filter = "contrast(1.35) brightness(1.05)";
      ctx.drawImage(off, 0, 0, w, h);
      ctx.filter = "none";
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className={`absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(90,42,158,0.45), transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(201,168,76,0.28), transparent 50%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-80 ${className}`}
    />
  );
}
