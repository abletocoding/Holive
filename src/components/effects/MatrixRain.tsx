"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const GLYPHS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンHOLIVE";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 14;

    function resize() {
      const parent = canvas!.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(w / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * -40),
      );
    }

    function draw() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.fillStyle = "rgba(7, 6, 10, 0.08)";
      ctx!.fillRect(0, 0, w, h);
      ctx!.font = `${fontSize}px ui-monospace, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
        const x = i * fontSize;
        const y = drops[i]! * fontSize;
        const head = Math.random() > 0.96;
        ctx!.fillStyle = head
          ? "rgba(224, 195, 90, 0.85)"
          : "rgba(155, 109, 255, 0.55)";
        ctx!.fillText(ch, x, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]! += 1;
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(155,109,255,0.25),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(224,195,90,0.12),transparent_50%),#07060a]"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}
