"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HoliMascot, type HoliPose } from "@/components/holi/HoliMascot";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CrayonUnderline } from "@/components/ui/Doodle";

const EPISODES = [
  { key: "seed", pose: "think" as HoliPose, panels: 3 },
  { key: "comfort", pose: "guide" as HoliPose, panels: 3 },
  { key: "useful", pose: "wave" as HoliPose, panels: 3 },
  { key: "ecosystem", pose: "celebrate" as HoliPose, panels: 3 },
  { key: "patience", pose: "idle" as HoliPose, panels: 3 },
  { key: "loyalty", pose: "guide" as HoliPose, panels: 3 },
] as const;

type Props = {
  /** Home teaser shows first 3; full page shows all */
  mode?: "teaser" | "full";
  /** Hide section chrome when PageHero already provides title */
  showIntro?: boolean;
};

/** Dedicated comic-strip section — Holi stories stay here, never float over CTAs. */
export function HoliStories({ mode = "teaser", showIntro = true }: Props) {
  const t = useTranslations("HoliStories");
  const list = mode === "teaser" ? EPISODES.slice(0, 3) : EPISODES;

  return (
    <section
      id="historias"
      className={`doodle-zone relative isolate overflow-hidden bg-[color-mix(in_srgb,var(--surface)_70%,var(--background))] ${
        showIntro ? "section-pad" : "section-pad pt-4 md:pt-6"
      }`}
    >
      <div className="relative z-[var(--z-section-content)] mx-auto max-w-6xl">
        {showIntro && (
          <SectionReveal>
            <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
              {t("eyebrow")}
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight">
              {t("title")}
            </h2>
            <CrayonUnderline />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,transparent)]">
              {t("intro")}
            </p>
          </SectionReveal>
        )}

        <div className={showIntro ? "mt-12 space-y-14" : "space-y-14"}>
          {list.map((ep, i) => (
            <SectionReveal key={ep.key} delay={0.05 * i} immersive>
              <article className="comic-strip">
                <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-purple-bright)]">
                      {t(`episodes.${ep.key}.number`)}
                    </p>
                    <h3 className="font-display mt-1 text-xl font-semibold md:text-2xl">
                      {t(`episodes.${ep.key}.title`)}
                    </h3>
                  </div>
                  <p className="max-w-sm text-right text-sm italic text-[var(--holive-gold)]">
                    “{t(`episodes.${ep.key}.moral`)}”
                  </p>
                </header>

                <div className="grid gap-3 sm:grid-cols-3">
                  {Array.from({ length: ep.panels }, (_, pi) => (
                    <div
                      key={pi}
                      className="comic-panel relative flex min-h-[11rem] flex-col overflow-hidden border-2 border-[color-mix(in_srgb,var(--holive-purple)_45%,transparent)] bg-[var(--background)]"
                      style={{
                        borderRadius: `${4 + pi * 3}px ${14 - pi}px ${6 + pi}px ${12 - pi * 2}px / ${12}px ${3 + pi}px ${14}px ${5}px`,
                      }}
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-[0.07]"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23330072' stroke-width='0.5'/%3E%3C/svg%3E\")",
                        }}
                      />
                      <div className="relative z-[1] flex flex-1 items-center justify-center px-3 pt-4">
                        <HoliMascot
                          pose={pi === 0 ? "idle" : pi === 1 ? ep.pose : "celebrate"}
                          animated={false}
                          className={`h-20 w-16 ${pi === 2 ? "scale-110" : ""}`}
                        />
                      </div>
                      <p className="relative z-[1] border-t border-[color-mix(in_srgb,var(--holive-gold)_35%,transparent)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] px-3 py-2.5 text-center text-[0.78rem] leading-snug">
                        {t(`episodes.${ep.key}.panels.${pi}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>

        {mode === "teaser" && (
          <SectionReveal delay={0.15} className="mt-12 text-center">
            <Link
              href="/historias"
              className="focus-ring inline-flex min-h-11 items-center justify-center border border-[var(--holive-gold)] bg-[var(--holive-purple)] px-6 py-2.5 text-sm font-semibold tracking-wide text-[var(--holive-white)] transition-colors hover:bg-[var(--holive-purple-bright)]"
            >
              {t("seeAll")}
            </Link>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}

