"use client";

import { useEffect, useState } from "react";
import { HoliMascot, type HoliPose } from "@/components/holi/HoliMascot";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  messages: string[];
};

/** Fixed scroll companion — Holi reacts as the user progresses. */
export function HoliCompanion({ messages }: Props) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [pose, setPose] = useState<HoliPose>("wave");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || reduced) return;

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? y / max : 0;
      setVisible(y > 320);
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
  }, [dismissed, messages.length, reduced]);

  if (dismissed || reduced || !visible || messages.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-3 z-40 flex max-w-[11rem] flex-col items-end gap-2 sm:bottom-6 sm:right-5 sm:max-w-[13rem]">
      <div
        className="pointer-events-auto rounded border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-2.5 py-2 text-[0.7rem] leading-snug shadow-lg backdrop-blur-sm animate-[fadeIn_0.4s_ease]"
        role="status"
      >
        <p className="font-mono-code mb-0.5 text-[0.5rem] tracking-[0.22em] text-[var(--holive-gold)]">
          HOLI
        </p>
        {messages[idx]}
        <button
          type="button"
          className="focus-ring mt-1 block text-[0.55rem] tracking-wide text-[color-mix(in_srgb,var(--foreground)_45%,transparent)] hover:text-[var(--holive-gold)]"
          onClick={() => setDismissed(true)}
        >
          ×
        </button>
      </div>
      <div className="pointer-events-auto holi-bob">
        <HoliMascot pose={pose} className="h-12 w-9 opacity-95 sm:h-14 sm:w-11" />
      </div>
    </div>
  );
}
