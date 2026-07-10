"use client";

import { useState } from "react";

type Props = {
  className?: string;
  facing?: "right" | "left";
};

/** Holi — olive-with-eye crayon stickman. Uses /brand/holi.svg with inline SVG fallback. */
export function HoliMascot({ className, facing = "right" }: Props) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transform: facing === "left" ? "scaleX(-1)" : undefined,
      }}
    >
      {!useFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/holi.svg"
          alt=""
          width={64}
          height={80}
          className="h-full w-full object-contain"
          onError={() => setUseFallback(true)}
        />
      ) : (
        <svg
          viewBox="0 0 64 80"
          width="64"
          height="80"
          aria-hidden
          className="h-full w-full"
        >
          <ellipse
            cx="32"
            cy="8"
            rx="10"
            ry="3"
            fill="none"
            stroke="#e0c35a"
            strokeWidth="1.8"
          />
          <ellipse
            cx="32"
            cy="28"
            rx="14"
            ry="18"
            fill="#6b2fa0"
            stroke="#e0c35a"
            strokeWidth="2.2"
          />
          <circle
            cx="38"
            cy="26"
            r="5"
            fill="#faf8ff"
            stroke="#0c0a10"
            strokeWidth="1.6"
          />
          <circle cx="39.5" cy="26" r="2.2" fill="#0c0a10" />
          <path
            d="M32 46 L32 58 M32 50 L22 56 M32 50 L42 56 M32 58 L24 72 M32 58 L40 72"
            fill="none"
            stroke="#4a1d7a"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}
