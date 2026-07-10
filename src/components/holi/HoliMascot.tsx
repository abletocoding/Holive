"use client";

import { useId } from "react";

export type HoliPose = "idle" | "wave" | "think" | "celebrate" | "guide" | "peek";

type Props = {
  className?: string;
  facing?: "right" | "left";
  pose?: HoliPose;
  alt?: string;
  /** Soft CSS motion (bob / blink). Off when reduced-motion via parent CSS. */
  animated?: boolean;
};

/**
 * Holi — native crayon SVG (matches public/brand/holi.svg).
 * Poses are path variants of the same doodle — no AI PNGs.
 */
export function HoliMascot({
  className,
  facing = "right",
  pose = "idle",
  alt = "",
  animated = true,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const filterId = `holi-crayon-${uid}`;
  const label = alt || "Holi";

  return (
    <span
      className={`holi-mascot inline-block leading-none ${animated ? "holi-alive" : ""} ${className ?? ""}`}
      style={{
        transform: facing === "left" ? "scaleX(-1)" : undefined,
      }}
      role={alt ? "img" : "presentation"}
      aria-label={alt ? label : undefined}
      aria-hidden={alt ? undefined : true}
      data-pose={pose}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 240"
        width="100%"
        height="100%"
        className="h-full w-full overflow-visible"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            x="-12%"
            y="-12%"
            width="124%"
            height="124%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g filter={`url(#${filterId})`} className="holi-body-group">
          {/* Halo */}
          <path
            className="holi-halo"
            d={
              pose === "celebrate"
                ? "M62 48c12-32 64-32 76 4"
                : pose === "peek"
                  ? "M78 58c6-18 38-18 44 2"
                  : "M70 52c8-28 52-28 60 2"
            }
            fill="none"
            stroke="#C9A84C"
            strokeWidth={pose === "celebrate" ? 5 : 4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arms */}
          {pose === "wave" && (
            <>
              <path
                d="M62 128c-22 8-34 28-38 48"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                className="holi-arm-wave"
                d="M138 122c18-22 28-38 22-58"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M158 68c4-6 10-8 14-6"
                fill="none"
                stroke="#101820"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}
          {pose === "think" && (
            <>
              <path
                d="M62 128c-18 4-28 18-30 34"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M138 128c16 4 26 22 8 38c-6 6-14 8-22 4"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="48" cy="96" r="2.2" fill="#C9A84C" opacity="0.85" />
              <circle cx="40" cy="84" r="1.6" fill="#C9A84C" opacity="0.65" />
              <circle cx="36" cy="72" r="1.2" fill="#C9A84C" opacity="0.45" />
            </>
          )}
          {pose === "celebrate" && (
            <>
              <path
                d="M62 120c-20-18-32-28-40-26"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M138 120c20-18 32-28 40-26"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M28 88c-4-8-2-14 4-16"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M172 88c4-8 2-14-4-16"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
          {pose === "guide" && (
            <>
              <path
                d="M62 128c-22 8-34 28-38 48"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M138 124c24-4 40-2 48 10"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M186 134c6 2 10 8 8 14"
                fill="none"
                stroke="#101820"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}
          {(pose === "idle" || pose === "peek") && (
            <>
              <path
                d="M62 128c-22 8-34 28-38 48"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M138 128c22 10 32 28 36 46"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Legs — peek hides lower body slightly via clip feel */}
          {pose !== "peek" && (
            <>
              <path
                d="M88 178c-6 22-10 38-8 52"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M112 178c8 20 14 36 18 52"
                fill="none"
                stroke="#101820"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Olive body */}
          <path
            d="M100 58
               c28-2 48 18 50 48
               c2 28-10 52-34 62
               c-12 5-26 6-38 2
               c-28-10-42-36-40-62
               c2-28 24-48 62-50z"
            fill="#330072"
            stroke="#101820"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Leaf nub */}
          <path
            d="M96 56c2-14 8-22 14-26c-2 10 0 18 2 26"
            fill="#1A003D"
            stroke="#101820"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Eye */}
          <ellipse
            cx="102"
            cy="118"
            rx="22"
            ry="24"
            fill="#FFFFFF"
            stroke="#101820"
            strokeWidth="2.5"
          />
          <circle
            className="holi-iris"
            cx={pose === "think" ? 108 : pose === "guide" ? 106 : 104}
            cy={pose === "think" ? 116 : 120}
            r="13"
            fill="#C9A84C"
            stroke="#101820"
            strokeWidth="1.5"
          />
          <circle
            className="holi-pupil"
            cx={pose === "think" ? 110 : pose === "guide" ? 108 : 105}
            cy={pose === "think" ? 117 : 121}
            r="7"
            fill="#101820"
          />
          <circle
            cx={pose === "think" ? 104 : 99}
            cy={pose === "think" ? 110 : 114}
            r="3.2"
            fill="#FFFFFF"
          />

          {/* Expression */}
          {pose === "think" ? (
            <path
              d="M94 150c4 2 12 2 18-2"
              fill="none"
              stroke="#101820"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : pose === "celebrate" ? (
            <path
              d="M88 146c8 10 24 12 34 2"
              fill="none"
              stroke="#101820"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M90 148c6 6 18 8 28 2"
              fill="none"
              stroke="#101820"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </g>
      </svg>
    </span>
  );
}
