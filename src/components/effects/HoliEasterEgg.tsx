"use client";

import { useEffect, useState } from "react";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { fireGoldDust } from "@/components/effects/GoldDust";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Logo triple-click + Konami — Holi peeks and celebrates. */
export function HoliEasterEgg() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let buf: string[] = [];
    let clicks = 0;
    let clickTimer = 0;

    const celebrate = (text: string) => {
      setMsg(text);
      setShow(true);
      fireGoldDust(window.innerWidth * 0.5, window.innerHeight * 0.35);
      window.setTimeout(() => setShow(false), 4200);
    };

    const onKey = (e: KeyboardEvent) => {
      buf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (buf.length > KONAMI.length) buf = buf.slice(-KONAMI.length);
      if (buf.join(",") === KONAMI.join(",")) {
        buf = [];
        celebrate("Neural sync unlocked. Holi sees you.");
      }
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest?.('a[aria-label="Holive"], [data-holive-logo]')) return;
      clicks += 1;
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => {
        clicks = 0;
      }, 700);
      if (clicks >= 3) {
        clicks = 0;
        celebrate("You found Holi. Sembrar → cosechar.");
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      window.clearTimeout(clickTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[max(4.5rem,env(safe-area-inset-top))] z-[var(--z-overlay-toast)] flex justify-center px-4"
      role="status"
    >
      <div className="flex items-end gap-3 rounded border border-[var(--holive-gold)]/40 bg-[color-mix(in_srgb,var(--holive-black)_88%,transparent)] px-4 py-3 shadow-[var(--glow-gold)] backdrop-blur-md animate-[fadeIn_0.4s_ease]">
        <HoliMascot
          pose="celebrate"
          animated={!reduced}
          className="h-16 w-12"
          alt="Holi"
        />
        <p className="max-w-[14rem] pb-1 text-sm text-[var(--holive-gold-bright)]">
          {msg}
        </p>
      </div>
    </div>
  );
}
