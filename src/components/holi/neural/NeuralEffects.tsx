"use client";

import { useEffect, useRef } from "react";
import type { LevelTheme } from "@/lib/game/levelThemes";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  gold: boolean;
};

type Props = {
  reduced: boolean;
  pulse: number;
  goldBurst: number;
  shake: number;
  ambient?: boolean;
  celebrate?: boolean;
  theme?: LevelTheme;
  density?: number;
};

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

/**
 * Particle FX — capped on mobile, rAF-throttled, paused when hidden.
 * Celebrate mode adds CSS gold dust (cheap) + short canvas burst.
 */
export function NeuralEffects({
  reduced,
  pulse,
  goldBurst,
  shake,
  ambient = true,
  celebrate = false,
  theme,
  density,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partsRef = useRef<Particle[]>([]);
  const burstRef = useRef(0);
  const densityRef = useRef(1);
  const goldBiasRef = useRef(0.35);
  const celebrateRef = useRef(false);

  densityRef.current =
    (density ?? theme?.particleDensity ?? 1) * (isMobile() ? 0.45 : 1);
  goldBiasRef.current = theme?.goldBias ?? 0.35;
  celebrateRef.current = celebrate;

  useEffect(() => {
    if (reduced || goldBurst <= burstRef.current) return;
    burstRef.current = goldBurst;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const count = Math.round((isMobile() ? 12 : 22) * densityRef.current);
    for (let i = 0; i < count; i++) {
      partsRef.current.push({
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.35,
        y: h * 0.42 + (Math.random() - 0.5) * h * 0.15,
        vx: (Math.random() - 0.5) * 3.2,
        vy: -1.2 - Math.random() * 2.4,
        life: 0,
        max: 40 + Math.random() * 35,
        r: 1.2 + Math.random() * 2.4,
        gold: true,
      });
    }
  }, [goldBurst, reduced]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let ambientTick = 0;
    let running = true;
    const mobile = isMobile();
    const frameMs = mobile ? 33 : 16.7;
    const maxParts = mobile ? 48 : 110;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onVis = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const loop = (now: number) => {
      if (!running) return;
      const elapsed = now - last;
      if (elapsed < frameMs) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(3, elapsed / 16.67);
      last = now;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (ambient && !celebrateRef.current) {
        ambientTick += dt;
        const spawnEvery = mobile ? 2.4 : 1.1;
        if (ambientTick > spawnEvery / Math.max(0.35, densityRef.current)) {
          ambientTick = 0;
          if (partsRef.current.length < maxParts) {
            partsRef.current.push({
              x: Math.random() * w,
              y: h + 4,
              vx: (Math.random() - 0.5) * 0.4,
              vy: -0.35 - Math.random() * 0.5,
              life: 0,
              max: 90 + Math.random() * 60,
              r: 0.6 + Math.random() * 1.4,
              gold: Math.random() < goldBiasRef.current,
            });
          }
        }
      }

      if (celebrateRef.current && partsRef.current.length < maxParts * 0.6) {
        ambientTick += dt;
        if (ambientTick > (mobile ? 1.6 : 0.7)) {
          ambientTick = 0;
          partsRef.current.push({
            x: w * 0.5 + (Math.random() - 0.5) * w * 0.7,
            y: h * 0.55 + Math.random() * h * 0.2,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -0.8 - Math.random() * 1.6,
            life: 0,
            max: 50 + Math.random() * 40,
            r: 1 + Math.random() * 2,
            gold: Math.random() < 0.85,
          });
        }
      }

      const next: Particle[] = [];
      for (const p of partsRef.current) {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life >= p.max) continue;
        const a = 1 - p.life / p.max;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${0.55 * a})`
          : `rgba(155,109,255,${0.4 * a})`;
        ctx.fill();
        next.push(p);
      }
      partsRef.current = next.slice(-maxParts);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ambient, reduced]);

  if (reduced) return null;

  const shakePx = 4 + shake * 6;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      />
      {celebrate && (
        <div
          aria-hidden
          className="neural-gold-dust pointer-events-none absolute inset-0 z-[6]"
        />
      )}
      {pulse > 0.02 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            background: `radial-gradient(ellipse at center, rgba(201,168,76,${0.18 * pulse}), transparent 55%)`,
            opacity: pulse,
            transition: "opacity 120ms ease-out",
            willChange: "opacity",
          }}
        />
      )}
      {shake > 0.01 && (
        <style>{`
          .neural-shaking {
            animation: neuralShake ${0.35 + shake * 0.2}s ease-out;
          }
          @keyframes neuralShake {
            0%, 100% { transform: translate(0, 0); }
            20% { transform: translate(-${shakePx}px, ${2 + shake * 2}px); }
            40% { transform: translate(${5 + shake * 5}px, -${2 + shake * 2}px); }
            60% { transform: translate(-${3 + shake * 4}px, ${1 + shake * 2}px); }
            80% { transform: translate(${2 + shake * 3}px, 0); }
          }
        `}</style>
      )}
    </>
  );
}
