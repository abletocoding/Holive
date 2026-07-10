"use client";

import { useEffect, useState } from "react";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Fixed neural scroll path — gold/purple arc with Holi riding progress. */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setP(next);
      setShow(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const angle = -90 + p * 360;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = circ * p;

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-40 sm:left-5"
      aria-hidden
    >
      <div className="relative h-14 w-14 sm:h-16 sm:w-16">
        <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke="color-mix(in srgb, var(--holive-purple) 35%, transparent)"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke="url(#holi-progress-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{
              transition: reduced ? undefined : "stroke-dasharray 0.15s linear",
            }}
          />
          <defs>
            <linearGradient id="holi-progress-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#330072" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
        </svg>
        <div
          className="absolute left-1/2 top-1/2 h-7 w-5 -translate-x-1/2 -translate-y-1/2 sm:h-8 sm:w-6"
          style={
            reduced
              ? undefined
              : { transform: `translate(-50%, -50%) rotate(${angle * 0.08}deg)` }
          }
        >
          <HoliMascot
            pose={p > 0.85 ? "celebrate" : p > 0.4 ? "guide" : "idle"}
            animated={!reduced}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
