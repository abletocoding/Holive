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
    <div className="relative z-20 grid w-full max-w-5xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="border border-white/10 bg-black/35 p-5 backdrop-blur-sm sm:p-6">
        <p className="font-mono-code text-[0.6rem] tracking-[0.28em] text-[var(--holive-gold)]/75 uppercase">
          {labels.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-2xl text-[var(--holive-gold)] sm:text-4xl">
          {labels.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
          {labels.subtitle}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
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

        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <Stat label={labels.highScore} value={String(highScore)} />
          <Stat label={labels.unlocked} value={`${unlockedLevel}/${totalLevels}`} />
        </div>
      </section>

      <section className="border border-[var(--holive-gold)]/20 bg-[linear-gradient(160deg,rgba(201,168,76,0.12),rgba(0,0,0,0.35))] p-5 backdrop-blur-sm sm:p-6">
        <p className="font-mono-code text-[0.6rem] tracking-[0.28em] text-white/45 uppercase">
          {labels.missionsTitle}
        </p>
        <div className="mt-4 space-y-3">
          {missions.map((mission) => (
            <div key={mission.id} className="border border-white/10 bg-black/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white/85">
                    {labels.mission[mission.metric]}
                  </p>
                  <p className="mt-1 font-mono-code text-[0.6rem] tracking-[0.18em] text-white/40 uppercase">
                    {mission.mode}
                  </p>
                </div>
                <p className="font-mono-code text-xs text-[var(--holive-gold)]">
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
      className={`focus-ring min-h-44 border p-4 text-left transition hover:-translate-y-0.5 ${
        featured
          ? "border-[var(--holive-gold)]/45 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.18),rgba(90,42,158,0.16)_48%,rgba(0,0,0,0.36))]"
          : "border-white/15 bg-black/35"
      }`}
    >
      <span className="font-display text-xl text-[var(--holive-gold)]">{title}</span>
      <span className="mt-2 block text-sm leading-relaxed text-white/62">{body}</span>
      <span className="mt-4 inline-flex min-h-10 items-center border border-white/15 px-3 text-xs font-semibold text-white/85">
        {cta}
      </span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/30 px-3 py-3">
      <p className="font-mono-code text-[0.58rem] tracking-[0.2em] text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-xl text-[var(--holive-gold)]">{value}</p>
    </div>
  );
}
