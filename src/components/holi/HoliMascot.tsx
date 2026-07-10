"use client";

import { useState } from "react";

export type HoliPose = "idle" | "wave" | "think" | "celebrate" | "guide";

type Props = {
  className?: string;
  facing?: "right" | "left";
  /** Prefer PNG pose assets; falls back to SVG doodle. */
  pose?: HoliPose;
  alt?: string;
};

const POSE_SRC: Record<Exclude<HoliPose, "idle">, string> = {
  wave: "/brand/holi/holi-wave.webp",
  think: "/brand/holi/holi-think.webp",
  celebrate: "/brand/holi/holi-celebrate.webp",
  guide: "/brand/holi/holi-guide.webp",
};

/** Holi — olive-with-eye crayon stickman. Pose PNGs or /brand/holi.svg. */
export function HoliMascot({
  className,
  facing = "right",
  pose = "idle",
  alt = "",
}: Props) {
  const [failed, setFailed] = useState(false);
  const preferPose = pose !== "idle" && !failed;
  const src = preferPose ? POSE_SRC[pose] : "/brand/holi.svg";

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transform: facing === "left" ? "scaleX(-1)" : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={64}
        height={80}
        className="h-full w-full object-contain"
        onError={() => {
          if (preferPose) setFailed(true);
        }}
      />
    </span>
  );
}
