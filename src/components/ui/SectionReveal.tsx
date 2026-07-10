"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Deeper enter storytelling without per-item scroll listeners */
  immersive?: boolean;
};

export function SectionReveal({
  children,
  className,
  delay = 0,
  immersive = false,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: immersive ? 48 : 36,
        filter: immersive ? "blur(4px)" : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: immersive ? "-8% 0px" : "-12% 0px" }}
      transition={{
        duration: immersive ? 0.85 : 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
