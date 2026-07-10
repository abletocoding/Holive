/** Subtle crayon / Holi doodle accents for selected soft sections. */

import type { ReactNode } from "react";

type ClassProps = { className?: string };

export function CrayonUnderline({ className = "" }: ClassProps) {
  return (
    <svg
      className={`mt-2 block h-3 w-[min(12rem,70%)] ${className}`}
      viewBox="0 0 160 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 7c18-4 36 3 54-1s38-2 56 2 30-3 46-1"
        stroke="var(--holive-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M6 9c22-2 40 1 58-2 20-3 36 2 52 0 14-2 28-1 40 1"
        stroke="var(--holive-purple)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function SketchDivider({ className = "" }: ClassProps) {
  return (
    <svg
      className={`mx-auto my-8 block h-4 w-full max-w-md ${className}`}
      viewBox="0 0 320 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 8c28-5 56 4 84-1 30-5 58 3 88 0 26-3 52-4 78 1 22 4 44 2 62-1"
        stroke="var(--holive-purple)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="160" cy="8" r="2.2" fill="var(--holive-gold)" opacity="0.7" />
    </svg>
  );
}

/** Tiny Holi-inspired olive-eye motif for soft section corners. */
export function HoliDoodleMotif({
  className = "",
  variant = "olive",
}: ClassProps & { variant?: "olive" | "halo" | "spark" }) {
  if (variant === "halo") {
    return (
      <svg
        className={`h-10 w-10 ${className}`}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
      >
        <path
          d="M8 22c2-12 22-14 26-2"
          stroke="var(--holive-gold)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M10 24c3-9 18-10 22-1"
          stroke="var(--holive-gold)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    );
  }

  if (variant === "spark") {
    return (
      <svg
        className={`h-8 w-8 ${className}`}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
      >
        <path
          d="M16 4v6M16 22v6M4 16h6M22 16h6M8 8l4 4M20 20l4 4M24 8l-4 4M12 20l-4 4"
          stroke="var(--holive-gold)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`h-12 w-10 ${className}`}
      viewBox="0 0 40 48"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 18c0-10 8-14 12-14s12 4 12 14c0 12-6 22-12 22S12 30 12 18z"
        fill="color-mix(in srgb, var(--holive-purple) 18%, transparent)"
        stroke="var(--holive-purple)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <ellipse
        cx="22"
        cy="22"
        rx="5"
        ry="5.5"
        fill="var(--holive-white)"
        stroke="var(--holive-ink)"
        strokeWidth="1.2"
        opacity="0.85"
      />
      <circle cx="23" cy="22.5" r="2.4" fill="var(--holive-gold)" />
      <circle cx="23.5" cy="23" r="1.1" fill="var(--holive-black)" />
    </svg>
  );
}

export function SketchFrame({
  children,
  className = "",
}: ClassProps & { children: ReactNode }) {
  return (
    <div className={`doodle-frame relative ${className}`}>{children}</div>
  );
}
