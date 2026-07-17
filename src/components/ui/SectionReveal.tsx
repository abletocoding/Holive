"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export type MotionPreset =
  | "rise"
  | "slideLeft"
  | "slideRight"
  | "pop"
  | "drop"
  | "skew"
  | "expand"
  | "fade";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  preset?: MotionPreset;
};

const presets: Record<
  MotionPreset,
  { initial: Record<string, number>; animate: Record<string, number> }
> = {
  rise: {
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -56 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 56 },
    animate: { opacity: 1, x: 0 },
  },
  pop: {
    initial: { opacity: 0, scale: 0.82 },
    animate: { opacity: 1, scale: 1 },
  },
  drop: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
  },
  skew: {
    initial: { opacity: 0, y: 28, rotate: -2.5 },
    animate: { opacity: 1, y: 0, rotate: 0 },
  },
  expand: {
    initial: { opacity: 0, scaleX: 0.88, scaleY: 0.94 },
    animate: { opacity: 1, scaleX: 1, scaleY: 1 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

/**
 * Scroll reveal with distinct presets per section/element.
 * Transform + opacity only — no blur, no layout thrash.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  preset = "rise",
}: Props) {
  const reduce = useReducedMotion();
  const p = presets[preset];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={p.initial}
      whileInView={p.animate}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -5% 0px" }}
      transition={{
        type: "spring",
        stiffness: preset === "pop" ? 140 : 85,
        damping: preset === "pop" ? 12 : 16,
        mass: 0.85,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  preset?: MotionPreset;
};

export function StaggerGroup({
  children,
  className,
  stagger = 0.1,
}: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.06 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  preset = "rise",
}: {
  children: ReactNode;
  className?: string;
  preset?: MotionPreset;
}) {
  const reduce = useReducedMotion();
  const p = presets[preset];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = {
    hidden: p.initial,
    show: {
      ...p.animate,
      transition: { type: "spring", stiffness: 100, damping: 14 },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/** Ambient float for doodles — continuous, gentle, noticeable. */
export function FloatAccent({
  children,
  className,
  amplitude = 10,
  duration = 4.5,
  rotate = 3,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  rotate?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      aria-hidden
      animate={{
        y: [0, -amplitude, 0, amplitude * 0.45, 0],
        rotate: [0, rotate, -rotate * 0.7, rotate * 0.4, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
