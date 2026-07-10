"use client";

import { useEffect, useState } from "react";
import { HoliMascot, type HoliPose } from "@/components/holi/HoliMascot";

type Props = {
  tip: string;
  pose?: HoliPose;
  className?: string;
  playful?: boolean;
};

/** Interactive Holi tip bubble — guide tooltips across sections. */
export function HoliGuide({
  tip,
  pose = "guide",
  className = "",
  playful = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [react, setReact] = useState<HoliPose>(pose);

  useEffect(() => {
    setReact(pose);
  }, [pose]);

  return (
    <div className={`relative inline-flex items-end gap-2 ${className}`}>
      <button
        type="button"
        className={`focus-ring group relative shrink-0 ${playful ? "holi-bob" : ""}`}
        aria-expanded={open}
        aria-label="Holi"
        onClick={() => {
          setOpen((v) => !v);
          setReact((r) => (r === "celebrate" ? pose : "celebrate"));
        }}
        onMouseEnter={() => setReact("wave")}
        onMouseLeave={() => setReact(open ? "think" : pose)}
      >
        <HoliMascot pose={react} className="h-14 w-11 drop-shadow-md sm:h-16 sm:w-12" />
      </button>
      {open && (
        <div
          role="status"
          className="max-w-[14rem] rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_85%,transparent)] shadow-lg animate-[fadeIn_0.35s_ease] sm:max-w-xs"
        >
          <p className="font-mono-code mb-1 text-[0.55rem] tracking-[0.2em] text-[var(--holive-gold)]">
            HOLI
          </p>
          {tip}
        </div>
      )}
    </div>
  );
}
