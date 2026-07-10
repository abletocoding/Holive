"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Brand flash on route change — purple→gold portal wipe with olive eye motif. */
export function PageTransition() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [flash, setFlash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || reduced) return;
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 720);
    return () => window.clearTimeout(t);
  }, [pathname, ready, reduced]);

  if (!flash || reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[var(--z-overlay-transition)] overflow-hidden"
      aria-hidden
    >
      <div className="portal-wipe absolute inset-0 bg-[var(--holive-purple)]" />
      <div className="portal-wipe-gold absolute inset-0" />
      <div className="portal-eye absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 80 80" className="h-16 w-16 opacity-90 sm:h-20 sm:w-20">
          <ellipse
            cx="40"
            cy="42"
            rx="22"
            ry="26"
            fill="#330072"
            stroke="#C9A84C"
            strokeWidth="2"
          />
          <ellipse cx="40" cy="44" rx="10" ry="11" fill="#FFFFFF" />
          <circle cx="41" cy="45" r="6" fill="#C9A84C" />
          <circle cx="42" cy="46" r="3.2" fill="#101820" />
          <path
            d="M22 22c8-14 28-14 36 2"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
