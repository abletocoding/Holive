"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { ConsultaQuiz } from "@/components/consulta/ConsultaQuiz";
import { Link } from "@/i18n/navigation";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono-code text-[0.7rem] uppercase tracking-[0.32em] text-[var(--holive-gold)]">
      {children}
    </p>
  );
}

/** Full /consulta funnel — 9 Holive-branded sections. */
export function ConsultaLanding() {
  const t = useTranslations("Consulta");

  return (
    <main id="main" className="relative min-h-screen bg-[var(--holive-black)] text-[var(--holive-white)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(51,0,114,0.55),transparent_68%)]"
      />

      {/* 1. Hero */}
      <section className="section-pad relative mx-auto max-w-6xl pt-28 md:pt-32">
        <SectionReveal preset="drop">
          <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          <p className="font-display mt-4 text-[clamp(2.6rem,10vw,5.5rem)] font-semibold leading-[0.92] tracking-[0.08em]">
            HOLIVE
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-[clamp(1.6rem,4.2vw,2.8rem)] font-medium leading-tight text-[var(--holive-gold-bright)]">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,var(--holive-white)_80%,transparent)] md:text-lg">
            {t("hero.sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#consulta-quiz"
              className="focus-ring rounded-sm bg-[var(--holive-gold)] px-6 py-3 text-sm font-semibold text-[var(--holive-black)]"
            >
              {t("hero.cta")}
            </a>
            <a
              href="#consulta-session"
              className="focus-ring rounded-sm border border-[var(--border)] px-6 py-3 text-sm hover:border-[var(--holive-gold)]"
            >
              {t("hero.secondary")}
            </a>
          </div>
          <p className="mt-5 font-mono-code text-[0.6rem] uppercase tracking-[0.24em] text-[var(--muted)]">
            {t("hero.scarcity")}
          </p>
        </SectionReveal>
      </section>

      {/* 2. Problem PAS */}
      <section className="section-pad mx-auto max-w-6xl border-t border-[var(--border)]">
        <SectionReveal preset="rise">
          <Eyebrow>{t("problem.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-3 max-w-3xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight">
            {t("problem.title")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--holive-white)_78%,transparent)] md:text-lg">
            {t("problem.body")}
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {(["a", "b", "c"] as const).map((k) => (
              <li
                key={k}
                className="border-l-2 border-[var(--holive-gold)]/50 pl-4"
              >
                <p className="font-display text-lg text-[var(--holive-gold-bright)]">
                  {t(`problem.points.${k}.title`)}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{t(`problem.points.${k}.text`)}</p>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </section>

      {/* 3. Social proof */}
      <section className="section-pad mx-auto max-w-6xl border-t border-[var(--border)]">
        <SectionReveal preset="fade">
          <Eyebrow>{t("proof.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.7rem,3.8vw,2.6rem)] font-semibold">
            {t("proof.title")}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-[var(--muted)] md:text-base">{t("proof.body")}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(["s1", "s2", "s3"] as const).map((k) => (
              <div key={k}>
                <p className="font-display text-3xl text-[var(--holive-gold)]">{t(`proof.stats.${k}.value`)}</p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--holive-white)_75%,transparent)]">
                  {t(`proof.stats.${k}.label`)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {(["q1", "q2"] as const).map((k) => (
              <blockquote
                key={k}
                className="rounded-sm border border-[var(--border)] bg-[color-mix(in_srgb,var(--holive-purple)_14%,transparent)] p-5"
              >
                <p className="font-display text-lg italic text-[var(--holive-white)]">
                  “{t(`proof.quotes.${k}.text`)}”
                </p>
                <footer className="mt-3 font-mono-code text-[0.65rem] uppercase tracking-[0.2em] text-[var(--holive-gold)]">
                  {t(`proof.quotes.${k}.attr`)}
                </footer>
              </blockquote>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* 4. Session value */}
      <section id="consulta-session" className="section-pad mx-auto max-w-6xl scroll-mt-28 border-t border-[var(--border)]">
        <SectionReveal preset="slideLeft">
          <Eyebrow>{t("session.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.7rem,3.8vw,2.6rem)] font-semibold">
            {t("session.title")}
          </h2>
          <p className="mt-4 max-w-xl text-base text-[color-mix(in_srgb,var(--holive-white)_78%,transparent)]">
            {t("session.body")}
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {(["one", "two", "three"] as const).map((k, i) => (
              <li key={k} className="rounded-sm border border-[var(--border)] p-5">
                <span className="font-mono-code text-[0.65rem] text-[var(--holive-gold)]">
                  0{i + 1}
                </span>
                <p className="font-display mt-2 text-lg">{t(`session.steps.${k}.title`)}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{t(`session.steps.${k}.text`)}</p>
              </li>
            ))}
          </ol>
        </SectionReveal>
      </section>

      {/* 5. Quiz gate */}
      <section className="section-pad mx-auto max-w-6xl border-t border-[var(--border)]">
        <SectionReveal preset="rise" className="mb-8">
          <Eyebrow>{t("quizSection.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.7rem,3.8vw,2.6rem)] font-semibold">
            {t("quizSection.title")}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-[var(--muted)] md:text-base">
            {t("quizSection.body")}
          </p>
        </SectionReveal>
        <ConsultaQuiz />
      </section>

      {/* 6. Investment anchor */}
      <section className="section-pad mx-auto max-w-6xl border-t border-[var(--border)]">
        <SectionReveal preset="fade">
          <Eyebrow>{t("anchor.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.7rem,3.8vw,2.6rem)] font-semibold">
            {t("anchor.title")}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-[var(--muted)] md:text-base">{t("anchor.body")}</p>
          <div className="mt-8 grid gap-3">
            {(["web", "plan", "app", "finance"] as const).map((k) => (
              <div
                key={k}
                className="flex flex-col justify-between gap-2 border-b border-[var(--border)] py-4 sm:flex-row sm:items-end"
              >
                <div>
                  <p className="font-display text-lg">{t(`anchor.items.${k}.title`)}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{t(`anchor.items.${k}.text`)}</p>
                </div>
                <p className="font-mono-code shrink-0 text-sm tracking-wide text-[var(--holive-gold)]">
                  {t(`anchor.items.${k}.price`)}
                </p>
              </div>
            ))}
          </div>
          <p className="font-display mt-6 text-base italic text-[var(--holive-gold-bright)]">
            {t("anchor.micro")}
          </p>
        </SectionReveal>
      </section>

      {/* 7. Three paths */}
      <section className="section-pad mx-auto max-w-6xl border-t border-[var(--border)]">
        <SectionReveal preset="pop">
          <Eyebrow>{t("paths.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.7rem,3.8vw,2.6rem)] font-semibold">
            {t("paths.title")}
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {(["service", "courses", "advisory"] as const).map((k) => (
              <article
                key={k}
                className="flex flex-col rounded-sm border border-[var(--border)] bg-[color-mix(in_srgb,var(--holive-purple)_12%,transparent)] p-5"
              >
                <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.24em] text-[var(--holive-gold)]">
                  {t(`paths.${k}.label`)}
                </p>
                <h3 className="font-display mt-3 text-xl">{t(`paths.${k}.title`)}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                  {t(`paths.${k}.body`)}
                </p>
                {k === "courses" ? (
                  <Link
                    href="/#courses"
                    className="focus-ring mt-6 inline-flex rounded-sm border border-[var(--holive-gold)] px-4 py-2.5 text-sm text-[var(--holive-gold)]"
                  >
                    {t(`paths.${k}.cta`)}
                  </Link>
                ) : (
                  <a
                    href="#consulta-quiz"
                    className="focus-ring mt-6 inline-flex rounded-sm bg-[var(--holive-gold)] px-4 py-2.5 text-sm font-semibold text-[var(--holive-black)]"
                  >
                    {t(`paths.${k}.cta`)}
                  </a>
                )}
              </article>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* 8. FAQ */}
      <section className="section-pad mx-auto max-w-6xl border-t border-[var(--border)]">
        <SectionReveal preset="rise">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-3 text-[clamp(1.7rem,3.8vw,2.6rem)] font-semibold">
            {t("faq.title")}
          </h2>
          <dl className="mt-8 space-y-5">
            {(["q1", "q2", "q3", "q4"] as const).map((k) => (
              <div key={k} className="border-b border-[var(--border)] pb-5">
                <dt className="font-display text-lg">{t(`faq.items.${k}.q`)}</dt>
                <dd className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                  {t(`faq.items.${k}.a`)}
                </dd>
              </div>
            ))}
          </dl>
        </SectionReveal>
      </section>

      {/* 9. Final CTA */}
      <section className="section-pad mx-auto max-w-6xl border-t border-[var(--border)] pb-24 text-center">
        <SectionReveal preset="drop">
          <Eyebrow>{t("final.eyebrow")}</Eyebrow>
          <h2 className="font-display mx-auto mt-3 max-w-2xl text-[clamp(1.8rem,4vw,2.8rem)] font-semibold">
            {t("final.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--muted)] md:text-base">
            {t("final.body")}
          </p>
          <a
            href="#consulta-quiz"
            className="focus-ring mt-8 inline-block rounded-sm bg-[var(--holive-gold)] px-8 py-3.5 text-sm font-semibold text-[var(--holive-black)]"
          >
            {t("final.cta")}
          </a>
          <p className="mt-6 font-mono-code text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
            holive.org
          </p>
        </SectionReveal>
      </section>
    </main>
  );
}
