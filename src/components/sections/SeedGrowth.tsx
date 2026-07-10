"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Olive-seed → tree growth — interactive sembrar metaphor.
 */
export function SeedGrowth() {
  const t = useTranslations("Experience.seed");
  const reduced = usePrefersReducedMotion();
  const [stage, setStage] = useState(0); // 0 seed, 1 sprout, 2 sapling, 3 tree

  const next = () => setStage((s) => Math.min(3, s + 1));
  const reset = () => setStage(0);

  return (
    <ExperienceBand
      id="sembrar"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
    >
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,#ebe4f5_0%,#f7f4fb_40%,#d4c4a0_40%,#c9a84c33_100%)] dark:bg-[linear-gradient(180deg,#1a1524_0%,#141018_40%,#2a2433_40%,#101820_100%)]">
          <svg
            viewBox="0 0 320 320"
            className="h-full w-full"
            aria-hidden
          >
            {/* Soil line */}
            <path
              d="M0 210 Q80 200 160 212 T320 208 L320 320 L0 320 Z"
              fill="color-mix(in srgb, #330072 18%, transparent)"
            />
            <path
              d="M0 210 Q80 200 160 212 T320 208"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1.5"
              opacity="0.5"
            />

            {/* Seed */}
            <ellipse
              cx="160"
              cy={stage === 0 ? 200 : 218}
              rx={stage === 0 ? 14 : 8}
              ry={stage === 0 ? 10 : 5}
              fill="#330072"
              stroke="#C9A84C"
              strokeWidth="1.2"
              style={{
                transition: reduced ? undefined : "all 0.6s ease",
                opacity: stage >= 3 ? 0.2 : 1,
              }}
            />

            {/* Sprout / trunk */}
            {stage >= 1 && (
              <path
                d={
                  stage === 1
                    ? "M160 210 C158 190 162 175 160 160"
                    : stage === 2
                      ? "M160 210 C155 170 165 130 160 95"
                      : "M160 210 C150 150 155 90 160 45"
                }
                fill="none"
                stroke="#330072"
                strokeWidth={stage >= 3 ? 5 : 3}
                strokeLinecap="round"
                style={{
                  transition: reduced ? undefined : "d 0.7s ease",
                }}
              />
            )}

            {/* Leaves */}
            {stage >= 2 && (
              <g
                style={{
                  transition: reduced ? undefined : "opacity 0.5s ease",
                }}
              >
                <ellipse
                  cx="135"
                  cy={stage >= 3 ? 70 : 110}
                  rx={stage >= 3 ? 36 : 22}
                  ry={stage >= 3 ? 22 : 14}
                  fill="#5a2a9e"
                  opacity="0.85"
                  transform={`rotate(-25 ${stage >= 3 ? 135 : 140} ${stage >= 3 ? 70 : 110})`}
                />
                <ellipse
                  cx="185"
                  cy={stage >= 3 ? 65 : 105}
                  rx={stage >= 3 ? 38 : 20}
                  ry={stage >= 3 ? 24 : 13}
                  fill="#330072"
                  opacity="0.9"
                  transform={`rotate(28 ${stage >= 3 ? 185 : 180} ${stage >= 3 ? 65 : 105})`}
                />
                {stage >= 3 && (
                  <>
                    <ellipse
                      cx="160"
                      cy="48"
                      rx="42"
                      ry="28"
                      fill="#5a2a9e"
                      opacity="0.75"
                    />
                    <circle cx="148" cy="78" r="4" fill="#C9A84C" />
                    <circle cx="172" cy="72" r="3.5" fill="#C9A84C" />
                    <circle cx="160" cy="90" r="3" fill="#C9A84C" />
                  </>
                )}
              </g>
            )}

            {/* Gold halo when grown */}
            {stage >= 3 && (
              <path
                d="M120 40 Q160 18 200 40"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            )}
          </svg>
        </div>

        <div>
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
            {t(`stages.${stage}.label`)}
          </p>
          <p className="mt-3 text-lg leading-relaxed text-[color-mix(in_srgb,var(--foreground)_80%,transparent)]">
            {t(`stages.${stage}.text`)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {stage < 3 ? (
              <button
                type="button"
                onClick={next}
                className="focus-ring min-h-11 border border-[var(--holive-gold)] bg-[var(--holive-purple)] px-5 text-sm font-semibold text-[var(--holive-white)] hover:bg-[var(--holive-purple-bright)]"
              >
                {t("plant")}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="focus-ring min-h-11 border border-[var(--border)] px-5 text-sm font-semibold hover:border-[var(--holive-gold)]"
              >
                {t("again")}
              </button>
            )}
          </div>
        </div>
      </div>
    </ExperienceBand>
  );
}
