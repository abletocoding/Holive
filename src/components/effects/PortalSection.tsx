"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Section enter portal — olive/eye motif wipe when section scrolls into view. */
export function PortalSection({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setEntered(true);
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`portal-section relative ${entered ? "is-in" : ""} ${className}`}
      data-reduced={reduced ? "1" : "0"}
    >
      {!reduced && (
        <div aria-hidden className="portal-section-veil pointer-events-none absolute inset-0 z-[1]">
          <svg
            className="portal-section-eye absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 opacity-0"
            viewBox="0 0 64 64"
          >
            <ellipse cx="32" cy="34" rx="16" ry="20" fill="#330072" stroke="#C9A84C" strokeWidth="1.8" />
            <ellipse cx="32" cy="36" rx="7" ry="8" fill="#fff" />
            <circle cx="33" cy="37" r="4" fill="#C9A84C" />
            <circle cx="34" cy="38" r="2.2" fill="#101820" />
          </svg>
        </div>
      )}
      <div className="portal-section-content relative z-[2]">{children}</div>
    </div>
  );
}
