"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Speck = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  gold: boolean;
};

type Props = {
  /** Fire when this becomes true */
  trigger?: boolean;
  /** Origin as % of viewport (default center-ish CTA) */
  origin?: { x: number; y: number };
};

/** Gold/purple dust burst — CTA success celebration. */
export function GoldDust({ trigger = false, origin }: Props) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (trigger) setBurstKey((k) => k + 1);
  }, [trigger]);

  const burst = useCallback(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ox = origin?.x ?? w * 0.5;
    const oy = origin?.y ?? h * 0.55;
    const specks: Speck[] = Array.from({ length: 72 }, () => {
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 7;
      return {
        x: ox,
        y: oy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 2,
        life: 1,
        r: 1.2 + Math.random() * 2.8,
        gold: Math.random() > 0.35,
      };
    });

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const s of specks) {
        if (s.life <= 0) continue;
        alive++;
        s.life -= 0.016;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12;
        s.vx *= 0.99;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(241,181,0,${0.9 * s.life})`
          : `rgba(107,61,184,${0.75 * s.life})`;
        ctx.fill();
      }
      if (alive > 0) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [origin?.x, origin?.y, reduced]);

  useEffect(() => {
    if (burstKey === 0) return;
    return burst();
  }, [burstKey, burst]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--z-overlay-burst)]"
    />
  );
}

/** Imperative helper for forms — dispatch a custom event. */
export function fireGoldDust(x?: number, y?: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("holive:golddust", {
      detail: { x, y },
    }),
  );
}

/** Listens for holive:golddust and renders bursts. */
export function GoldDustHost() {
  const [trigger, setTrigger] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | undefined>();

  useEffect(() => {
    const onBurst = (e: Event) => {
      const ce = e as CustomEvent<{ x?: number; y?: number }>;
      setOrigin(
        ce.detail?.x != null && ce.detail?.y != null
          ? { x: ce.detail.x, y: ce.detail.y }
          : undefined,
      );
      setTrigger(false);
      requestAnimationFrame(() => setTrigger(true));
      window.setTimeout(() => setTrigger(false), 50);
    };
    window.addEventListener("holive:golddust", onBurst);
    return () => window.removeEventListener("holive:golddust", onBurst);
  }, []);

  return <GoldDust trigger={trigger} origin={origin} />;
}
