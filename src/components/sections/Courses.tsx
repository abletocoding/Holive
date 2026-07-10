"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import {
  CrayonUnderline,
  HoliDoodleMotif,
  SketchFrame,
} from "@/components/ui/Doodle";
import { HoliMascot } from "@/components/holi/HoliMascot";

const teasers = ["one", "two", "three"] as const;

export function Courses() {
  const t = useTranslations("Courses");
  const n = useTranslations("Nav");

  return (
    <section
      id="courses"
      className="doodle-zone section-pad relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--holive-purple) 18%, var(--background)), var(--background) 55%, color-mix(in srgb, var(--holive-gold) 10%, var(--background)))",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-2 top-12 opacity-50 md:right-8 md:top-20"
      >
        <HoliDoodleMotif variant="spark" className="h-10 w-10" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-4 opacity-40 md:left-10"
      >
        <HoliDoodleMotif variant="halo" className="h-9 w-9 -rotate-12" />
      </div>

      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="flex flex-wrap items-start gap-4">
            <HoliMascot pose="celebrate" className="h-14 w-11 shrink-0" />
            <div>
              <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-[var(--holive-gold)]">
                {t("eyebrow")}
              </p>
              <h2 className="font-display mt-3 max-w-2xl text-[clamp(1.9rem,4.2vw,3.2rem)] font-semibold leading-tight">
                {t("title")}
              </h2>
              <CrayonUnderline />
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,transparent)]">
                {t("body")}
              </p>
              <Link
                href="/courses"
                className="focus-ring mt-4 inline-block text-sm tracking-wide text-[var(--holive-gold)] hover:underline"
              >
                {n("courses")} →
              </Link>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {teasers.map((key) => (
              <li key={key}>
                <SketchFrame className="font-mono-code text-sm tracking-wide text-[color-mix(in_srgb,var(--foreground)_85%,transparent)]">
                  {t(`teasers.${key}`)}
                </SketchFrame>
              </li>
            ))}
          </ul>
          <WaitlistForm />
        </SectionReveal>
      </div>
    </section>
  );
}
