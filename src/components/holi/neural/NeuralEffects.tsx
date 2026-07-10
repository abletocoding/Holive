"use client";

import { useEffect, useRef } from "react";

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
};

export function NeuralEffects({
  reduced,
  pulse,
  goldBurst,
  shake,
  ambient = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partsRef = useRef<Particle[]>([]);
  const burstRef = useRef(0);

  useEffect(() => {
    if (reduced || goldBurst <= burstRef.current) return;
    burstRef.current = goldBurst;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    for (let i = 0; i < 28; i++) {
      partsRef.current.push({
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.4,
        y: h * 0.45 + (Math.random() - 0.5) * h * 0.2,
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let ambientTick = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (ambient) {
        ambientTick += dt;
        if (ambientTick > 18) {
          ambientTick = 0;
          partsRef.current.push({
            x: Math.random() * w,
            y: h + 4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.35 - Math.random() * 0.5,
            life: 0,
            max: 90 + Math.random() * 60,
            r: 0.8 + Math.random() * 1.4,
            gold: Math.random() > 0.55,
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
      partsRef.current = next.slice(-120);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
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
      {pulse > 0.02 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            background: `radial-gradient(ellipse at center, rgba(201,168,76,${0.18 * pulse}), transparent 55%)`,
            opacity: pulse,
            transition: "opacity 120ms ease-out",
          }}
        />
      )}
      {shake > 0.01 && (
        <style>{`
          .neural-shaking {
            animation: neuralShake ${0.35 + shake * 0.2}s ease-out;
          }
          @keyframes neuralShake {
            0%, 100% { transform: translate(0,0); }
            20% { transform: translate(-${shakePx}px, ${2 + shake * 2}px); }
            40% { transform: translate(${5 + shake * 5}px, -${2 + shake * 3}px); }
            60% { transform: translate(-${3 + shake * 4}px, ${1 + shake * 2}px); }
            80% { transform: translate(${2 + shake * 3}px, 0); }
          }
        `}</style>
      )}
    </>
  );
}
