"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HoliMascot, type HoliPose } from "@/components/holi/HoliMascot";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CrayonUnderline } from "@/components/ui/Doodle";

type EpisodeKey =
  | "seed"
  | "comfort"
  | "useful"
  | "ecosystem"
  | "patience"
  | "loyalty";

type PanelScene = "seed" | "door" | "stage" | "mesh" | "funnel" | "table" | "none";

const EPISODES: {
  key: EpisodeKey;
  panels: { pose: HoliPose; scene: PanelScene; holiX: number }[];
}[] = [
  {
    key: "seed",
    panels: [
      { pose: "plant", scene: "seed", holiX: 0 },
      { pose: "think", scene: "seed", holiX: 8 },
      { pose: "celebrate", scene: "seed", holiX: 0 },
    ],
  },
  {
    key: "comfort",
    panels: [
      { pose: "idle", scene: "door", holiX: -18 },
      { pose: "guide", scene: "door", holiX: 12 },
      { pose: "walk", scene: "door", holiX: 28 },
    ],
  },
  {
    key: "useful",
    panels: [
      { pose: "wave", scene: "stage", holiX: 0 },
      { pose: "think", scene: "stage", holiX: -6 },
      { pose: "celebrate", scene: "none", holiX: 0 },
    ],
  },
  {
    key: "ecosystem",
    panels: [
      { pose: "idle", scene: "mesh", holiX: -10 },
      { pose: "guide", scene: "mesh", holiX: 6 },
      { pose: "celebrate", scene: "mesh", holiX: 0 },
    ],
  },
  {
    key: "patience",
    panels: [
      { pose: "think", scene: "funnel", holiX: 0 },
      { pose: "plant", scene: "funnel", holiX: -4 },
      { pose: "wave", scene: "funnel", holiX: 0 },
    ],
  },
  {
    key: "loyalty",
    panels: [
      { pose: "peek", scene: "table", holiX: -8 },
      { pose: "guide", scene: "table", holiX: 4 },
      { pose: "celebrate", scene: "table", holiX: 0 },
    ],
  },
];

function ComicScene({ scene }: { scene: PanelScene }) {
  if (scene === "none") return null;

  return (
    <svg
      aria-hidden
      viewBox="0 0 320 180"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
      fill="none"
    >
      {scene === "seed" && (
        <>
          <path
            d="M24 148c40-6 80-4 120 2c36 5 72 2 112-8"
            stroke="#101820"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          <ellipse cx="248" cy="42" rx="18" ry="18" stroke="#C9A84C" strokeWidth="2" opacity="0.7" />
          <path d="M248 28v-10M238 42h-10M258 42h10M248 56v10" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
        </>
      )}
      {scene === "door" && (
        <>
          <path d="M210 40v110M210 40h70v110H210" stroke="#330072" strokeWidth="2.4" opacity="0.7" />
          <circle cx="268" cy="98" r="3.5" fill="#C9A84C" />
          <path d="M40 150h250" stroke="#101820" strokeWidth="2" opacity="0.4" />
        </>
      )}
      {scene === "stage" && (
        <>
          <path d="M40 50c30-28 80-28 110 0" stroke="#C9A84C" strokeWidth="2" opacity="0.5" />
          <path d="M170 50c30-28 80-28 110 0" stroke="#C9A84C" strokeWidth="2" opacity="0.35" />
          <path d="M30 150h260" stroke="#101820" strokeWidth="2.2" opacity="0.45" />
          <path d="M60 150v-18h200v18" stroke="#330072" strokeWidth="2" opacity="0.55" />
        </>
      )}
      {scene === "mesh" && (
        <>
          <circle cx="80" cy="70" r="8" stroke="#330072" strokeWidth="2" />
          <circle cx="160" cy="48" r="10" stroke="#C9A84C" strokeWidth="2" />
          <circle cx="240" cy="78" r="8" stroke="#330072" strokeWidth="2" />
          <circle cx="160" cy="120" r="9" stroke="#101820" strokeWidth="2" opacity="0.7" />
          <path d="M88 74l62-18M170 54l62 20M160 58v52M88 76l64 40M232 82l-64 34" stroke="#330072" strokeWidth="1.5" opacity="0.45" />
        </>
      )}
      {scene === "funnel" && (
        <>
          <path d="M110 36h100l-28 70H138z" stroke="#330072" strokeWidth="2.2" opacity="0.65" />
          <path d="M138 106h44v28" stroke="#C9A84C" strokeWidth="2" opacity="0.7" />
          <circle cx="160" cy="148" r="5" fill="#C9A84C" opacity="0.85" />
        </>
      )}
      {scene === "table" && (
        <>
          <path d="M60 120h200" stroke="#101820" strokeWidth="2.4" opacity="0.55" />
          <path d="M80 120v30M240 120v30" stroke="#101820" strokeWidth="2" opacity="0.45" />
          <path d="M120 100h80v20H120z" stroke="#330072" strokeWidth="2" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

function ComicEpisode({
  ep,
  index,
}: {
  ep: (typeof EPISODES)[number];
  index: number;
}) {
  const t = useTranslations("HoliStories");
  const reduced = useReducedMotion();
  const [panel, setPanel] = useState(0);
  const total = ep.panels.length;
  const current = ep.panels[panel]!;

  const advance = useCallback(() => {
    setPanel((p) => (p + 1) % total);
  }, [total]);

  const goTo = useCallback((i: number) => setPanel(i), []);

  return (
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

      <button
        type="button"
        onClick={advance}
        className="comic-stage focus-ring group relative block w-full overflow-hidden border-2 border-[color-mix(in_srgb,var(--holive-purple)_50%,transparent)] bg-[var(--background)] text-left"
        style={{
          borderRadius: `${6 + (index % 3)}px ${16 - (index % 4)}px ${8}px ${14}px / ${14}px ${5}px ${16}px ${7}px`,
          minHeight: "16.5rem",
        }}
        aria-label={t("advanceAria", {
          panel: panel + 1,
          total,
          title: t(`episodes.${ep.key}.title`),
        })}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23330072' stroke-width='0.5'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative h-[12.5rem] w-full md:h-[14rem]">
          <ComicScene scene={current.scene} />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${ep.key}-${panel}`}
              className="absolute inset-0 flex items-end justify-center pb-2"
              initial={
                reduced
                  ? false
                  : { opacity: 0, y: 18, scale: 0.94 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{ x: current.holiX }}
            >
              <motion.div
                className="comic-holi-parallax"
                animate={
                  reduced
                    ? undefined
                    : { y: [0, -4, 0] }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <HoliMascot
                  pose={current.pose}
                  animated={!reduced}
                  className="h-36 w-28 md:h-40 md:w-32"
                  alt="Holi"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <span className="pointer-events-none absolute right-3 top-3 font-mono-code text-[0.65rem] tracking-[0.2em] text-[color-mix(in_srgb,var(--holive-gold)_80%,transparent)]">
            {panel + 1}/{total}
          </span>
        </div>

        <div className="relative border-t border-[color-mix(in_srgb,var(--holive-gold)_35%,transparent)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={`cap-${ep.key}-${panel}`}
              className="text-center text-sm leading-snug md:text-[0.95rem]"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              {t(`episodes.${ep.key}.panels.${panel}`)}
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 text-center font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--foreground)_45%,transparent)] group-hover:text-[var(--holive-gold)]">
            {t("tapHint")}
          </p>
        </div>
      </button>

      <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label={t("panelsLabel")}>
        {ep.panels.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === panel}
            aria-label={t("panelDot", { n: i + 1 })}
            onClick={() => goTo(i)}
            className={`focus-ring h-2.5 rounded-full transition-all ${
              i === panel
                ? "w-7 bg-[var(--holive-gold)]"
                : "w-2.5 bg-[color-mix(in_srgb,var(--holive-purple)_40%,transparent)] hover:bg-[var(--holive-purple-bright)]"
            }`}
          />
        ))}
      </div>
    </article>
  );
}

type Props = {
  mode?: "teaser" | "full";
  showIntro?: boolean;
};

/** Dedicated comic experiences — Holi stories stay here, never float over CTAs. */
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
              <ComicEpisode ep={ep} index={i} />
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
