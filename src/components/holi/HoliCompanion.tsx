"use client";

import { useEffect, useState } from "react";
import { HoliMascot, type HoliPose } from "@/components/holi/HoliMascot";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

type Props = {
  messages: string[];
};

/**
 * Fixed scroll companion — soft presence only.
 * Hidden near footer / contact so it never covers CTAs.
 * Comics live in dedicated Holi Stories sections — not here.
 */
export function HoliCompanion({ messages }: Props) {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const [visible, setVisible] = useState(false);
  const [peek, setPeek] = useState(false);
  const [idx, setIdx] = useState(0);
  const [pose, setPose] = useState<HoliPose>("wave");
  const [dismissed, setDismissed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [parked, setParked] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? y / max : 0;

      // Park near footer / contact so CTAs stay clickable
      const footer = document.getElementById("contact") ?? document.querySelector("footer");
      let nearEnd = p > 0.88;
      if (footer) {
        const rect = footer.getBoundingClientRect();
        nearEnd = rect.top < window.innerHeight * 0.72;
      }
      setParked(nearEnd);

      setPeek(!nearEnd && y > 120 && y <= 320);
      setVisible(!nearEnd && y > 320);

      if (p < 0.25) {
        setIdx(0);
        setPose("wave");
      } else if (p < 0.5) {
        setIdx(Math.min(1, messages.length - 1));
        setPose("guide");
      } else if (p < 0.75) {
        setIdx(Math.min(2, messages.length - 1));
        setPose("think");
      } else {
        setIdx(Math.min(3, messages.length - 1));
        setPose("celebrate");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed, messages.length]);

  useEffect(() => {
    if (dismissed || reduced || coarse || parked) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 8;
      const ny = (e.clientY / window.innerHeight - 0.5) * 5;
      setOffset({ x: nx, y: ny });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [dismissed, reduced, coarse, parked]);

  if (dismissed || messages.length === 0 || parked) return null;

  if (peek && !visible) {
    return (
      <div
        className="pointer-events-none fixed bottom-[max(0.5rem,env(safe-area-inset-bottom))] right-0 z-[var(--z-chrome-companion)] translate-x-[40%] sm:translate-x-[35%]"
        aria-hidden
      >
        <div className="holi-peek-in">
          <HoliMascot pose="peek" animated={!reduced} className="h-12 w-9 opacity-80" />
        </div>
      </div>
    );
  }

  if (reduced || !visible) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-[var(--z-chrome-companion)] flex max-w-[10.5rem] flex-col items-end gap-1.5 sm:bottom-6 sm:right-5 sm:max-w-[12rem]"
      style={
        coarse
          ? undefined
          : {
              transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
              transition: "transform 0.35s ease-out",
            }
      }
    >
      <div
        className="pointer-events-auto rounded border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-2.5 py-2 text-[0.68rem] leading-snug shadow-lg backdrop-blur-sm animate-[fadeIn_0.4s_ease]"
        role="status"
      >
        <p className="font-mono-code mb-0.5 text-[0.5rem] tracking-[0.22em] text-[var(--holive-gold)]">
          HOLI
        </p>
        {messages[idx]}
        <button
          type="button"
          className="focus-ring mt-1 block min-h-8 min-w-8 text-[0.55rem] tracking-wide text-[color-mix(in_srgb,var(--foreground)_45%,transparent)] hover:text-[var(--holive-gold)]"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      {/* Mascot never steals clicks from page CTAs */}
      <div className="pointer-events-none holi-bob" aria-hidden>
        <HoliMascot pose={pose} animated className="h-11 w-8 opacity-90 sm:h-12 sm:w-9" />
      </div>
    </div>
  );
}
