"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  text: string;
  className?: string;
  /** Scramble on mount / when text changes */
  trigger?: "mount" | "hover";
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

const GLYPHS = "HOLIVE◆◇◈░▒▓01アイウエオ◆";

/**
 * Text scramble reveal — Holive mono aesthetic, agency-portfolio moment.
 */
export function TextScramble({
  text,
  className = "",
  trigger = "mount",
  as: Tag = "span",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : "");
  const [hovering, setHovering] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    if (trigger === "hover" && !hovering) {
      setDisplay(text);
      return;
    }

    let i = 0;
    const len = text.length;
    const tick = () => {
      i += 1;
      const progress = Math.min(1, i / (len * 2.2));
      const revealed = Math.floor(progress * len);
      let out = "";
      for (let c = 0; c < len; c++) {
        if (text[c] === " ") {
          out += " ";
        } else if (c < revealed) {
          out += text[c];
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [text, reduced, trigger, hovering]);

  return (
    <Tag
      className={className}
      onMouseEnter={() => trigger === "hover" && setHovering(true)}
      onMouseLeave={() => trigger === "hover" && setHovering(false)}
    >
      {display || text}
    </Tag>
  );
}
