"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

const GLYPHS =
  "HOLIVE·SEMBRAR·COSECHAR·PUREZA·LEALTAD·CÓDIGO·01アイウエオアカサタナハマヤラワ01#@$%&*+=<>/\\|";

/**
 * Character-cascade watching eye — matrix glyphs form an iris that tracks
 * pointer / touch / scroll face. Desktop denser; mobile lighter 2D.
 */
export function GlyphEye() {
  const t = useTranslations("Experience.glyphEye");
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.75);
    const look = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const cols: { y: number; speed: number; chars: string[] }[] = [];
    const cell = coarse ? 14 : 11;
    const t0 = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth || 640;
      h = parent?.clientHeight || 420;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.ceil(w / cell) + 2;
      cols.length = 0;
      for (let i = 0; i < n; i++) {
        const len = 8 + Math.floor(Math.random() * 14);
        const chars: string[] = [];
        for (let j = 0; j < len; j++) {
          chars.push(GLYPHS[(Math.random() * GLYPHS.length) | 0]!);
        }
        cols.push({
          y: Math.random() * h,
          speed: 0.35 + Math.random() * (coarse ? 0.9 : 1.4),
          chars,
        });
      }
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      look.tx = (e.clientX - rect.left) / rect.width;
      look.ty = (e.clientY - rect.top) / rect.height;
    };

    const onScroll = () => {
      const rect = canvas.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const face = 0.5 + (window.innerHeight / 2 - mid) / window.innerHeight;
      look.ty = Math.min(0.85, Math.max(0.15, face));
    };

    const draw = (now: number) => {
      const tSec = (now - t0) / 1000;
      look.x += (look.tx - look.x) * 0.08;
      look.y += (look.ty - look.y) * 0.08;

      ctx.fillStyle = "#101820";
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.52;
      const eyeRx = Math.min(w, h) * 0.38;
      const eyeRy = Math.min(w, h) * 0.28;
      const pupilMax = eyeRx * 0.22;
      const px = cx + (look.x - 0.5) * eyeRx * 0.55;
      const py = cy + (look.y - 0.5) * eyeRy * 0.55;

      // Cascade behind / through eye
      ctx.font = `${cell - 2}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i]!;
        if (!reduced) col.y += col.speed;
        if (col.y > h + col.chars.length * cell) {
          col.y = -col.chars.length * cell;
          for (let j = 0; j < col.chars.length; j++) {
            col.chars[j] = GLYPHS[(Math.random() * GLYPHS.length) | 0]!;
          }
        }
        const x = i * cell;
        for (let j = 0; j < col.chars.length; j++) {
          const y = col.y + j * cell;
          const dx = x - px;
          const dy = y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const inIris = dist < pupilMax * 2.4;
          const inWhite =
            ((x - cx) / eyeRx) ** 2 + ((y - cy) / eyeRy) ** 2 < 1;

          if (inIris) {
            ctx.fillStyle =
              j === col.chars.length - 1 ? "#C9A84C" : "#330072";
          } else if (inWhite) {
            ctx.fillStyle =
              j === col.chars.length - 1
                ? "rgba(201,168,76,0.85)"
                : "rgba(90,42,158,0.55)";
          } else {
            ctx.fillStyle =
              j === col.chars.length - 1
                ? "rgba(0,255,65,0.35)"
                : "rgba(51,0,114,0.22)";
          }
          if ((now / 180 + i + j) % 17 < 1) {
            col.chars[j] = GLYPHS[(Math.random() * GLYPHS.length) | 0]!;
          }
          ctx.fillText(col.chars[j]!, x, y);
        }
      }

      // Eye outline (crayon)
      ctx.beginPath();
      ctx.ellipse(cx, cy, eyeRx, eyeRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(201,168,76,0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pupil void
      const pulse = reduced ? 1 : 1 + Math.sin(tSec * 2.2) * 0.04;
      ctx.beginPath();
      ctx.ellipse(px, py, pupilMax * pulse, pupilMax * 1.1 * pulse, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#101820";
      ctx.fill();
      ctx.strokeStyle = "#C9A84C";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Gold glint
      ctx.beginPath();
      ctx.arc(px + pupilMax * 0.35, py - pupilMax * 0.3, pupilMax * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201,168,76,0.9)";
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, coarse]);

  return (
    <ExperienceBand
      id="ojo-glifo"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
      dark
    >
      <div className="relative mx-auto aspect-[16/10] max-h-[28rem] w-full overflow-hidden border border-[color-mix(in_srgb,#C9A84C_35%,transparent)] bg-[#101820] md:max-h-[32rem]">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        />
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono-code text-[0.65rem] tracking-[0.2em] text-[color-mix(in_srgb,#C9A84C_70%,white)]">
          {t("hint")}
        </p>
      </div>
    </ExperienceBand>
  );
}
