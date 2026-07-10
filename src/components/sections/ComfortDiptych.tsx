"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExperienceBand } from "@/components/sections/ExperienceBand";
import { HoliMascot } from "@/components/holi/HoliMascot";

/**
 * Dual-pan comfort vs warehouse diptych — archetype, not memoir.
 */
export function ComfortDiptych() {
  const t = useTranslations("Experience.diptych");
  const [side, setSide] = useState<"comfort" | "warehouse">("comfort");

  return (
    <ExperienceBand
      id="diptico"
      eyebrow={t("eyebrow")}
      title={t("title")}
      refran={t("refran")}
      dark
    >
      <div className="grid gap-3 md:grid-cols-2">
        {(["comfort", "warehouse"] as const).map((key) => {
          const active = side === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSide(key)}
              className={`focus-ring group relative min-h-[16rem] overflow-hidden border-2 p-6 text-left transition-all ${
                active
                  ? "border-[var(--holive-gold)] bg-[color-mix(in_srgb,#330072_55%,#101820)]"
                  : "border-[color-mix(in_srgb,#C9A84C_25%,transparent)] bg-[color-mix(in_srgb,#101820_80%,#330072)] opacity-75 hover:opacity-95"
              }`}
              aria-pressed={active}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background:
                    key === "comfort"
                      ? "radial-gradient(circle at 30% 40%, rgba(201,168,76,0.35), transparent 55%)"
                      : "linear-gradient(135deg, transparent 40%, rgba(51,0,114,0.5), rgba(0,255,65,0.08))",
                }}
              />
              <p className="font-mono-code relative z-[1] text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
                {t(`${key}.label`)}
              </p>
              <h3 className="font-display relative z-[1] mt-2 text-xl font-semibold text-[var(--holive-white)] md:text-2xl">
                {t(`${key}.title`)}
              </h3>
              <p className="relative z-[1] mt-3 max-w-sm text-sm leading-relaxed text-[color-mix(in_srgb,white_78%,transparent)]">
                {t(`${key}.text`)}
              </p>
              <div className="pointer-events-none absolute bottom-3 right-3 opacity-80">
                <HoliMascot
                  pose={key === "comfort" ? "think" : "guide"}
                  animated={active}
                  className="h-14 w-11"
                />
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-center text-sm italic text-[color-mix(in_srgb,#C9A84C_85%,white)]">
        {t(`${side}.aside`)}
      </p>
    </ExperienceBand>
  );
}
