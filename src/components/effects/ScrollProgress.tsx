"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Compact scroll ring — top-right under header so it never collides
 * with Holi companion (bottom-right) or footer CTAs.
 * Ring only (no second Holi mascot).
 */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setP(next);
      setShow(window.scrollY > 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const r = 14;
  const circ = 2 * Math.PI * r;
  const dash = circ * p;

  return (
    <div
      className="pointer-events-none fixed right-3 top-[max(4.75rem,calc(env(safe-area-inset-top)+3.75rem))] z-[var(--z-chrome-progress)] sm:right-5"
      aria-hidden
    >
      <div className="relative h-10 w-10 opacity-80 sm:h-11 sm:w-11">
        <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            stroke="color-mix(in srgb, var(--holive-purple) 30%, transparent)"
            strokeWidth="2"
          />
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            stroke="url(#holi-progress-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{
              transition: reduced ? undefined : "stroke-dasharray 0.12s linear",
            }}
          />
          <defs>
            <linearGradient id="holi-progress-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#330072" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-mono-code absolute inset-0 flex items-center justify-center text-[0.5rem] tracking-tight text-[var(--holive-gold)]">
          {Math.round(p * 100)}
        </span>
      </div>
    </div>
  );
}
