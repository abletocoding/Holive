"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

/**
 * Holive watching eye — premium CSS/SVG iris that tracks pointer / face scroll.
 * Replaces the noisy glyph-cascade with intentional brand vision.
 */
export function GlyphEye() {
  const t = useTranslations("Experience.glyphEye");
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const stageRef = useRef<HTMLDivElement>(null);
  const look = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef(0);
  const [blink, setBlink] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onPointer = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      look.current.tx = Math.max(-1, Math.min(1, nx));
      look.current.ty = Math.max(-1, Math.min(1, ny));
    };

    const onScroll = () => {
      const rect = stage.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const face = (window.innerHeight / 2 - mid) / (window.innerHeight * 0.55);
      look.current.ty = Math.max(-0.85, Math.min(0.85, face));
    };

    const tick = () => {
      const L = look.current;
      const ease = coarse ? 0.12 : 0.09;
      L.x += (L.tx - L.x) * ease;
      L.y += (L.ty - L.y) * ease;

      const iris = stage.querySelector<HTMLElement>("[data-iris]");
      const pupil = stage.querySelector<HTMLElement>("[data-pupil]");
      const glint = stage.querySelector<HTMLElement>("[data-glint]");
      const ball = stage.querySelector<HTMLElement>("[data-ball]");

      const maxX = coarse ? 18 : 26;
      const maxY = coarse ? 12 : 16;
      const ix = L.x * maxX;
      const iy = L.y * maxY;

      if (iris) iris.style.transform = `translate(${ix}px, ${iy}px)`;
      if (pupil) pupil.style.transform = `translate(${ix * 1.15}px, ${iy * 1.15}px)`;
      if (glint) {
        glint.style.transform = `translate(${ix * 0.7 - 10}px, ${iy * 0.7 - 12}px)`;
      }
      if (ball && !reduced) {
        ball.style.transform = `rotateX(${(-L.y * 8).toFixed(2)}deg) rotateY(${(L.x * 10).toFixed(2)}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    setReady(true);
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [coarse, reduced]);

  useEffect(() => {
    if (reduced) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        schedule();
      }, 3200 + Math.random() * 4200);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [reduced]);

  return (
    <ExperienceBand
      id="ojo-glifo"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
      dark
    >
      <div
        ref={stageRef}
        className={`watching-eye-stage relative mx-auto aspect-[16/10] max-h-[28rem] w-full overflow-hidden border border-[color-mix(in_srgb,#C9A84C_35%,transparent)] bg-[#0a1018] md:max-h-[32rem] ${
          ready ? "is-ready" : ""
        }`}
        style={{ perspective: "900px" }}
      >
        {/* Soft brand atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(51,0,114,0.45) 0%, transparent 62%), radial-gradient(ellipse 90% 70% at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 50%)",
          }}
        />

        {/* Crayon ring frame */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-[6%] h-[88%] w-[88%] opacity-40"
          viewBox="0 0 400 260"
        >
          <ellipse
            cx="200"
            cy="130"
            rx="168"
            ry="98"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="2.5"
            strokeDasharray="3 7"
          />
        </svg>

        <div
          data-ball
          className="watching-eye-ball absolute left-1/2 top-[48%] w-[min(72%,22rem)] -translate-x-1/2 -translate-y-1/2"
          style={{
            transformStyle: "preserve-3d",
            transition: reduced ? "none" : undefined,
          }}
        >
          {/* Sclera */}
          <div
            className="relative mx-auto aspect-[5/3] w-full overflow-hidden"
            style={{
              borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%",
              background:
                "radial-gradient(ellipse at 45% 40%, #ffffff 0%, #f4f0ea 55%, #e8e2d8 100%)",
              boxShadow:
                "inset 0 0 40px rgba(51,0,114,0.12), inset 0 -18px 36px rgba(16,24,32,0.18), 0 0 0 2px rgba(16,24,32,0.55)",
            }}
          >
            {/* Lid overlay for blink */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 origin-top bg-[#0a1018] transition-transform duration-100"
              style={{
                transform: blink ? "scaleY(1)" : "scaleY(0)",
              }}
            />

            {/* Iris */}
            <div
              data-iris
              className="watching-iris absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 will-change-transform"
              style={{
                width: "42%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: `
                  radial-gradient(circle at 50% 50%, #101820 0 28%, transparent 29%),
                  repeating-conic-gradient(
                    from 0deg,
                    #C9A84C 0deg 8deg,
                    #a8883a 8deg 14deg,
                    #F1B500 14deg 18deg,
                    #C9A84C 18deg 26deg,
                    #8a6e2e 26deg 32deg
                  )
                `,
                boxShadow:
                  "0 0 0 3px #101820, 0 0 24px rgba(201,168,76,0.35), inset 0 0 16px rgba(16,24,32,0.35)",
              }}
            >
              {!reduced && (
                <div
                  aria-hidden
                  className="watching-iris-spin absolute inset-[-8%] rounded-full opacity-40"
                  style={{
                    background:
                      "conic-gradient(from 40deg, transparent 0deg, rgba(51,0,114,0.55) 50deg, transparent 100deg)",
                  }}
                />
              )}
            </div>

            {/* Pupil */}
            <div
              data-pupil
              className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 will-change-transform"
              style={{
                width: "14%",
                aspectRatio: "1",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 40% 35%, #2a3540 0%, #101820 70%)",
                boxShadow: "0 0 0 1.5px #C9A84C",
              }}
            />

            {/* Specular */}
            <div
              data-glint
              className="absolute left-1/2 top-1/2 z-[3] will-change-transform"
              style={{
                width: "5%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 0 8px rgba(255,255,255,0.5)",
              }}
            />

            {/* Lower lid shade */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[28%]"
              style={{
                background:
                  "linear-gradient(to top, rgba(16,24,32,0.22), transparent)",
              }}
            />
          </div>

          {/* Crayon lashes suggestion */}
          <svg
            aria-hidden
            className="pointer-events-none absolute -top-[6%] left-[8%] w-[84%]"
            viewBox="0 0 200 24"
          >
            <path
              d="M10 18c30-16 70-20 90-18c22 2 58 10 90 20"
              fill="none"
              stroke="#101820"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>
        </div>

        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono-code text-[0.65rem] tracking-[0.2em] text-[color-mix(in_srgb,#C9A84C_70%,white)]">
          {t("hint")}
        </p>
      </div>
    </ExperienceBand>
  );
}
