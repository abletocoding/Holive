"use client";

import { useTranslations } from "next-intl";
import { SectionReveal, FloatAccent } from "@/components/ui/SectionReveal";
import { CrayonUnderline, HoliDoodleMotif, SketchDivider } from "@/components/ui/Doodle";
import { ConsultaQuiz } from "@/components/consulta/ConsultaQuiz";
import {
  IlluBottleneck,
  IlluOliveTree,
  IlluResultPulse,
} from "@/components/consulta/ConsultaIllustrations";
import {
  BottleneckMeter,
  HeroSparkField,
  ResultFlipCards,
  SlotsPulse,
} from "@/components/consulta/ConsultaSurprises";
import { Link } from "@/i18n/navigation";

/** Light, illustrated, one-idea-per-section consulta funnel. */
export function ConsultaLanding() {
  const t = useTranslations("Consulta");

  return (
    <main
      id="main"
      className="theme-light relative min-h-screen bg-[var(--holive-white)] text-[var(--holive-black)]"
      style={{ colorScheme: "light" }}
    >
      {/* Atmosphere — soft purple/gold wash, not black void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_at_20%_0%,rgba(201,168,76,0.22),transparent_45%),radial-gradient(ellipse_at_90%_10%,rgba(51,0,114,0.18),transparent_50%),linear-gradient(180deg,#FAF8FC_0%,#F3EEF8_40%,#FFFFFF_100%)]"
      />

      {/* 1. Hero — brand + one promise + one CTA */}
      <HeroSparkField>
        <section className="section-pad relative mx-auto grid max-w-6xl gap-10 pt-28 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-32">
          <SectionReveal preset="drop">
            <SlotsPulse />
            <p className="font-display mt-6 text-[clamp(3rem,11vw,6.5rem)] font-semibold leading-[0.88] tracking-[0.06em] text-[var(--holive-purple)]">
              HOLIVE
            </p>
            <h1 className="font-display mt-4 max-w-lg text-[clamp(1.55rem,3.8vw,2.45rem)] font-medium leading-tight text-[var(--holive-black)]">
              {t("hero.title")}
            </h1>
            <CrayonUnderline />
            <p className="mt-4 max-w-md text-base text-[var(--muted)] md:text-lg">
              {t("hero.sub")}
            </p>
            <a
              href="#consulta-quiz"
              className="focus-ring mt-8 inline-flex rounded-sm bg-[var(--holive-gold)] px-7 py-3.5 text-sm font-semibold text-[var(--holive-black)] shadow-[0_10px_30px_rgba(201,168,76,0.35)] transition hover:bg-[var(--holive-gold-bright)]"
            >
              {t("hero.cta")}
            </a>
          </SectionReveal>
          <SectionReveal preset="slideRight" delay={0.1} className="relative">
            <FloatAccent amplitude={8} duration={5}>
              <IlluBottleneck className="mx-auto w-full max-w-md" />
            </FloatAccent>
            <FloatAccent className="absolute -left-2 top-4 opacity-70" amplitude={6}>
              <HoliDoodleMotif variant="spark" className="h-8 w-8" />
            </FloatAccent>
          </SectionReveal>
        </section>
      </HeroSparkField>

      <SketchDivider />

      {/* 2. Problem — ONE line + meter surprise */}
      <section className="section-pad mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <SectionReveal preset="rise">
            <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.3em] text-[var(--holive-gold)]">
              {t("problem.eyebrow")}
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.7rem,3.5vw,2.5rem)] font-semibold text-[var(--holive-purple)]">
              {t("problem.title")}
            </h2>
            <p className="mt-4 max-w-md text-[var(--muted)]">{t("problem.body")}</p>
          </SectionReveal>
          <SectionReveal preset="pop" delay={0.08}>
            <BottleneckMeter />
          </SectionReveal>
        </div>
      </section>

      {/* 3. Results — flip examples */}
      <section className="section-pad relative mx-auto max-w-6xl overflow-hidden rounded-sm bg-[linear-gradient(180deg,#F7F4FB_0%,#FFFFFF_100%)]">
        <FloatAccent className="pointer-events-none absolute right-8 top-8 opacity-40" amplitude={7}>
          <IlluResultPulse className="h-20 w-20" />
        </FloatAccent>
        <SectionReveal preset="fade">
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("results.eyebrow")}
          </p>
          <h2 className="font-display mt-3 max-w-xl text-[clamp(1.7rem,3.5vw,2.5rem)] font-semibold text-[var(--holive-purple)]">
            {t("results.title")}
          </h2>
          <p className="mt-3 max-w-lg text-sm text-[var(--muted)]">{t("results.body")}</p>
          <div className="mt-8">
            <ResultFlipCards />
          </div>
        </SectionReveal>
      </section>

      {/* 4. Session — 3 beats only */}
      <section id="consulta-session" className="section-pad mx-auto max-w-6xl scroll-mt-28">
        <SectionReveal preset="slideLeft">
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("session.eyebrow")}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.7rem,3.5vw,2.5rem)] font-semibold text-[var(--holive-purple)]">
            {t("session.title")}
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {(["one", "two", "three"] as const).map((k, i) => (
              <li key={k} className="relative pl-2">
                <span className="font-display text-4xl text-[color-mix(in_srgb,var(--holive-gold)_55%,transparent)]">
                  0{i + 1}
                </span>
                <p className="font-display mt-2 text-xl text-[var(--holive-black)]">
                  {t(`session.steps.${k}.title`)}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{t(`session.steps.${k}.text`)}</p>
              </li>
            ))}
          </ol>
        </SectionReveal>
      </section>

      {/* 5. Quiz gate */}
      <section className="section-pad mx-auto max-w-6xl">
        <div className="mb-8 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <SectionReveal preset="rise">
            <IlluOliveTree className="h-40 w-36" />
            <p className="font-mono-code mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--holive-gold)]">
              {t("quizSection.eyebrow")}
            </p>
            <h2 className="font-display mt-2 text-[clamp(1.6rem,3.2vw,2.3rem)] font-semibold text-[var(--holive-purple)]">
              {t("quizSection.title")}
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{t("quizSection.body")}</p>
          </SectionReveal>
          <ConsultaQuiz />
        </div>
      </section>

      {/* 6. Anchor — compact strip */}
      <section className="border-y border-[var(--border)] bg-[var(--holive-purple)] text-[var(--holive-white)]">
        <div className="section-pad mx-auto max-w-6xl py-14 md:py-16">
          <SectionReveal preset="fade">
            <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.3em] text-[var(--holive-gold)]">
              {t("anchor.eyebrow")}
            </p>
            <h2 className="font-display mt-3 max-w-xl text-2xl font-semibold md:text-3xl">
              {t("anchor.title")}
            </h2>
            <p className="mt-3 max-w-lg text-sm text-[color-mix(in_srgb,var(--holive-white)_75%,transparent)]">
              {t("anchor.body")}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(["web", "plan", "app", "finance"] as const).map((k) => (
                <div
                  key={k}
                  className="rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_35%,transparent)] bg-[color-mix(in_srgb,var(--holive-black)_25%,transparent)] px-4 py-4"
                >
                  <p className="font-mono-code text-[0.6rem] text-[var(--holive-gold)]">
                    {t(`anchor.items.${k}.price`)}
                  </p>
                  <p className="font-display mt-2 text-base">{t(`anchor.items.${k}.title`)}</p>
                </div>
              ))}
            </div>
            <p className="font-display mt-6 text-base italic text-[var(--holive-gold-bright)]">
              {t("anchor.micro")}
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* 7. Three paths — simple */}
      <section className="section-pad mx-auto max-w-6xl">
        <SectionReveal preset="pop">
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.3em] text-[var(--holive-gold)]">
            {t("paths.eyebrow")}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.7rem,3.5vw,2.5rem)] font-semibold text-[var(--holive-purple)]">
            {t("paths.title")}
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {(["service", "courses", "advisory"] as const).map((k) => (
              <article
                key={k}
                className="flex flex-col border-t-2 border-[var(--holive-gold)] bg-[var(--surface)] px-5 py-6"
              >
                <p className="font-mono-code text-[0.6rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  {t(`paths.${k}.label`)}
                </p>
                <h3 className="font-display mt-2 text-xl text-[var(--holive-purple)]">
                  {t(`paths.${k}.title`)}
                </h3>
                <p className="mt-3 flex-1 text-sm text-[var(--muted)]">{t(`paths.${k}.body`)}</p>
                {k === "courses" ? (
                  <Link
                    href="/#courses"
                    className="focus-ring mt-6 text-sm font-semibold text-[var(--holive-purple)] underline decoration-[var(--holive-gold)] underline-offset-4"
                  >
                    {t(`paths.${k}.cta`)}
                  </Link>
                ) : (
                  <a
                    href="#consulta-quiz"
                    className="focus-ring mt-6 text-sm font-semibold text-[var(--holive-purple)] underline decoration-[var(--holive-gold)] underline-offset-4"
                  >
                    {t(`paths.${k}.cta`)}
                  </a>
                )}
              </article>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* 8. FAQ — short */}
      <section className="section-pad mx-auto max-w-3xl">
        <SectionReveal preset="rise">
          <h2 className="font-display text-center text-2xl font-semibold text-[var(--holive-purple)]">
            {t("faq.title")}
          </h2>
          <dl className="mt-8 space-y-4">
            {(["q1", "q2", "q3"] as const).map((k) => (
              <div key={k} className="border-b border-[var(--border)] pb-4">
                <dt className="font-display text-base text-[var(--holive-black)]">
                  {t(`faq.items.${k}.q`)}
                </dt>
                <dd className="mt-1.5 text-sm text-[var(--muted)]">{t(`faq.items.${k}.a`)}</dd>
              </div>
            ))}
          </dl>
        </SectionReveal>
      </section>

      {/* 9. Final CTA */}
      <section className="section-pad mx-auto max-w-6xl pb-24 text-center">
        <SectionReveal preset="drop">
          <HoliDoodleMotif variant="halo" className="mx-auto h-12 w-12 opacity-80" />
          <h2 className="font-display mx-auto mt-4 max-w-xl text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[var(--holive-purple)]">
            {t("final.title")}
          </h2>
          <a
            href="#consulta-quiz"
            className="focus-ring mt-8 inline-block rounded-sm bg-[var(--holive-purple)] px-8 py-3.5 text-sm font-semibold text-[var(--holive-white)]"
          >
            {t("final.cta")}
          </a>
        </SectionReveal>
      </section>
    </main>
  );
}
