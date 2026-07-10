"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

type Particle = { x: number; y: number; life: number; gold: boolean };

/** Desktop magnetic cursor trail — purple/gold dust following the pointer. */
export function BrandCursor() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced || coarse) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    let hoveringInteractive = false;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      setActive(true);
      const t = e.target as HTMLElement | null;
      hoveringInteractive = Boolean(
        t?.closest("a, button, input, textarea, select, [role='button']"),
      );
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          life: 1,
          gold: Math.random() > 0.45,
        });
      }
      if (particles.length > 80) particles.splice(0, particles.length - 80);
    };

    const onLeave = () => setActive(false);

    const tick = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.28;
      mouse.y += (mouse.ty - mouse.y) * 0.28;
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life -= 0.028;
        p.y -= 0.35;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4 + p.life * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${0.55 * p.life})`
          : `rgba(107,61,184,${0.5 * p.life})`;
        ctx.fill();
      }

      if (active) {
        const r = hoveringInteractive ? 18 : 10;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = hoveringInteractive
          ? "rgba(201,168,76,0.85)"
          : "rgba(201,168,76,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(51,0,114,0.9)";
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.classList.add("has-brand-cursor");
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-brand-cursor");
    };
  }, [reduced, coarse, active]);

  if (reduced || coarse) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--z-overlay-cursor)] mix-blend-screen"
    />
  );
}
