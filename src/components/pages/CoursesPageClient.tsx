"use client";

import { useLocale, useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { COURSES } from "@/content/courses";

export function CoursesPageClient() {
  const t = useTranslations("Pages.courses");
  const locale = useLocale();
  const en = locale.startsWith("en");

  return (
    <PageHero
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      holiTip={t("holiTip")}
    >
      <div className="mb-10 flex items-center gap-3">
        <HoliMascot pose="celebrate" className="h-16 w-12" />
        <p className="font-mono-code text-xs tracking-[0.25em] text-[var(--holive-gold)]">
          {t("catalog")}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {COURSES.map((course, i) => (
          <SectionReveal key={course.slug} delay={0.05 * i}>
            <article className="doodle-frame flex h-full flex-col">
              <span className="font-mono-code w-fit rounded border border-[var(--border)] px-2 py-0.5 text-[0.55rem] tracking-[0.18em] text-[var(--holive-gold)]">
                {course.status === "waitlist"
                  ? t("statusWaitlist")
                  : t("statusSoon")}
              </span>
              <h2 className="font-display mt-3 text-xl font-semibold">
                {en ? course.title.en : course.title.es}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                {en ? course.blurb.en : course.blurb.es}
              </p>
              <p className="font-mono-code mt-4 text-[0.55rem] tracking-[0.2em] text-[var(--holive-purple)]">
                {t("outcomes")}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[color-mix(in_srgb,var(--foreground)_78%,transparent)]">
                {(en ? course.outcomes.en : course.outcomes.es).map((o) => (
                  <li key={o}>· {o}</li>
                ))}
              </ul>
            </article>
          </SectionReveal>
        ))}
      </div>

      <section className="mt-20 max-w-lg">
        <h2 className="font-display text-2xl font-semibold">{t("waitlist")}</h2>
        <div className="mt-6">
          <WaitlistForm />
        </div>
      </section>
    </PageHero>
  );
}
