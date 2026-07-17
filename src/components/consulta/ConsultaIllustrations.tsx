"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Illustrated bottleneck → system for the consulta funnel. */
export function IlluBottleneck({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      className={className}
      viewBox="0 0 420 280"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="funnelGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#330072" />
        </linearGradient>
      </defs>
      {/* chaos dots left */}
      {Array.from({ length: 18 }, (_, i) => (
        <motion.circle
          key={i}
          cx={40 + (i % 6) * 22}
          cy={50 + Math.floor(i / 6) * 50}
          r={4 + (i % 3)}
          fill={i % 2 ? "#330072" : "#C9A84C"}
          opacity={0.35}
          initial={reduce ? false : { opacity: 0, y: -8 }}
          whileInView={{ opacity: 0.45, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03 }}
        />
      ))}
      {/* funnel neck */}
      <motion.path
        d="M170 40 L250 40 L210 140 L250 240 L170 240 L210 140 Z"
        stroke="url(#funnelGold)"
        strokeWidth="2.5"
        fill="color-mix(in srgb, #330072 8%, transparent)"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* eye at center */}
      <motion.ellipse
        cx="210"
        cy="140"
        rx="28"
        ry="18"
        stroke="#C9A84C"
        strokeWidth="2"
        fill="#FAFAF8"
        initial={reduce ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.4 }}
      />
      <circle cx="210" cy="140" r="8" fill="#330072" />
      <circle cx="213" cy="137" r="2.5" fill="#FAFAF8" />
      {/* ordered flow right */}
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={300}
          y={70 + i * 40}
          width={90}
          height={22}
          rx={4}
          fill={i % 2 ? "#330072" : "#C9A84C"}
          opacity={0.75}
          initial={reduce ? false : { x: 280, opacity: 0 }}
          whileInView={{ x: 300, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 120 }}
        />
      ))}
    </svg>
  );
}

/** Result card illustration — hours freed. */
export function IlluResultPulse({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="48" stroke="#C9A84C" strokeWidth="1.5" opacity="0.4" />
      <circle cx="60" cy="60" r="34" stroke="#330072" strokeWidth="2" opacity="0.5" />
      <ellipse cx="60" cy="58" rx="18" ry="12" stroke="#330072" strokeWidth="2" fill="#F7F4FB" />
      <circle cx="60" cy="58" r="5" fill="#C9A84C" />
      <path
        d="M40 88c8-6 16-4 24-2s16 2 22-4"
        stroke="#C9A84C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IlluOliveTree({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg className={className} viewBox="0 0 200 220" fill="none" aria-hidden>
      <motion.path
        d="M100 200 V90"
        stroke="#330072"
        strokeWidth="4"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      {[
        [70, 70],
        [130, 75],
        [85, 45],
        [115, 42],
        [100, 28],
      ].map(([x, y], i) => (
        <motion.ellipse
          key={i}
          cx={x}
          cy={y}
          rx={18}
          ry={26}
          fill={i % 2 ? "#5a2a9e" : "#330072"}
          opacity={0.85}
          initial={reduce ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: 0.2 + i * 0.08 }}
        />
      ))}
      <motion.circle
        cx="100"
        cy="55"
        r="10"
        fill="#C9A84C"
        initial={reduce ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.7 }}
      />
    </svg>
  );
}
