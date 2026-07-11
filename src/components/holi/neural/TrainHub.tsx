"use client";

import { missionPercent, type Mission, type MissionMetric } from "@/lib/game/missions";

type Props = {
  highScore: number;
  unlockedLevel: number;
  totalLevels: number;
  missions: Mission[];
  labels: {
    eyebrow: string;
    title: string;
    subtitle: string;
    classicTitle: string;
    classicBody: string;
    classicCta: string;
    freestyleTitle: string;
    freestyleBody: string;
    freestyleCta: string;
    missionsTitle: string;
    completed: string;
    highScore: string;
    unlocked: string;
    mission: Record<MissionMetric, string>;
  };
  onClassic: () => void;
  onFreestyle: () => void;
};

export function TrainHub({
  highScore,
  unlockedLevel,
  totalLevels,
  missions,
  labels,
  onClassic,
  onFreestyle,
}: Props) {
  return (
    <div className="relative z-20 grid w-full max-w-5xl gap-3 overflow-x-clip sm:gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative overflow-hidden border border-white/10 bg-black/35 p-4 backdrop-blur-sm sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-8 h-36 w-36 rounded-full border border-[var(--holive-gold)]/15"
        />
        <p className="font-mono-code text-[0.6rem] tracking-[0.28em] text-[var(--holive-gold)]/75 uppercase">
          {labels.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-xl text-[var(--holive-gold)] sm:text-3xl">
          {labels.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65 sm:mt-3">
          {labels.subtitle}
        </p>

        <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
          <ModeCard
            title={labels.classicTitle}
            body={labels.classicBody}
            cta={labels.classicCta}
            onClick={onClassic}
          />
          <ModeCard
            title={labels.freestyleTitle}
            body={labels.freestyleBody}
            cta={labels.freestyleCta}
            featured
            onClick={onFreestyle}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:mt-5">
          <Stat label={labels.highScore} value={String(highScore)} />
          <Stat
            label={labels.unlocked}
            value={`${unlockedLevel}/${totalLevels}`}
          />
        </div>
      </section>

      <section className="relative overflow-hidden border border-[var(--holive-gold)]/25 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.14),transparent_55%),linear-gradient(160deg,rgba(20,10,40,0.88),rgba(0,0,0,0.4))] p-4 backdrop-blur-sm sm:p-6">
        <p className="font-mono-code text-[0.6rem] tracking-[0.28em] text-white/45 uppercase">
          {labels.missionsTitle}
        </p>
        <div className="mt-3 space-y-3 sm:mt-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="border border-white/10 bg-black/30 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/85">
                    {labels.mission[mission.metric]}
                  </p>
                  <p className="mt-1 font-mono-code text-[0.6rem] tracking-[0.14em] text-white/40 uppercase">
                    {mission.mode}
                  </p>
                </div>
                <p className="shrink-0 font-mono-code text-xs text-[var(--holive-gold)]">
                  {mission.completed
                    ? labels.completed
                    : `${mission.progress}/${mission.target}`}
                </p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--holive-gold)] transition-[width]"
                  style={{ width: `${missionPercent(mission)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ModeCard({
  title,
  body,
  cta,
  featured = false,
  onClick,
}: {
  title: string;
  body: string;
  cta: string;
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring min-h-12 border p-4 text-left transition hover:-translate-y-0.5 ${
        featured
          ? "border-[var(--holive-gold)]/45 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.2),rgba(90,42,158,0.12)_45%,rgba(0,0,0,0.35))]"
          : "border-white/15 bg-black/35"
      }`}
    >
      <span className="font-display text-lg text-[var(--holive-gold)] sm:text-xl">
        {title}
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-white/62">
        {body}
      </span>
      <span className="mt-4 inline-flex min-h-11 items-center border border-white/15 px-3 text-xs font-semibold text-white/85">
        {cta}
      </span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/30 px-3 py-3">
      <p className="font-mono-code text-[0.55rem] tracking-[0.2em] text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-lg text-[var(--holive-gold)] sm:text-xl">
        {value}
      </p>
    </div>
  );
}
