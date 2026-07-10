"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  className?: string;
  size?: number;
};

/** Logo mark morph on load — olive eye draws in with gold halo scramble. */
export function LogoMorph({ className = "", size = 64 }: Props) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"in" | "done">(reduced ? "done" : "in");
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => setPhase("done"), 1400);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <svg
      ref={ref}
      data-holive-logo
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      width={size}
      height={size}
      className={`logo-morph ${phase === "in" ? "is-morphing" : "is-done"} ${className}`}
      aria-hidden
    >
      <path
        className="logo-morph-halo"
        d="M28 28c8-18 36-18 44 2"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        className="logo-morph-body"
        d="M50 22c22-1 38 14 40 38c2 22-8 40-26 48c-10 4-20 4-30 0c-20-8-32-28-30-48c2-22 18-37 46-38z"
        fill="#330072"
        stroke="#101820"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <ellipse
        className="logo-morph-eye"
        cx="52"
        cy="68"
        rx="14"
        ry="16"
        fill="#FFFFFF"
        stroke="#101820"
        strokeWidth="2"
      />
      <circle className="logo-morph-iris" cx="54" cy="70" r="8" fill="#C9A84C" />
      <circle cx="55" cy="71" r="4.2" fill="#101820" />
      <circle cx="50" cy="66" r="2" fill="#FFFFFF" />
    </svg>
  );
}
