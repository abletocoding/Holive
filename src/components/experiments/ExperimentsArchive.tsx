"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { ExpContainmentIris } from "@/components/experiments/ExpContainmentIris";
import { ExpIcosahedronOffering } from "@/components/experiments/ExpIcosahedronOffering";
import { ExpDossierTube } from "@/components/experiments/ExpDossierTube";
import { ExpCrystalReliquary } from "@/components/experiments/ExpCrystalReliquary";
import { ExpLoyaltyField } from "@/components/experiments/ExpLoyaltyField";
import { ExpCraftHelmet } from "@/components/experiments/ExpCraftHelmet";
import { ExpStretchedMantra } from "@/components/experiments/ExpStretchedMantra";
import { ExpOliveGrove } from "@/components/experiments/ExpOliveGrove";
import { ExpPactCore } from "@/components/experiments/ExpPactCore";
import { ExpDissolveSeal } from "@/components/experiments/ExpDissolveSeal";
import { ExpWordCyclone } from "@/components/experiments/ExpWordCyclone";
import { ExpSignalRadar } from "@/components/experiments/ExpSignalRadar";
import { ExpMirrorLedger } from "@/components/experiments/ExpMirrorLedger";
import { ExpLiquidBrief } from "@/components/experiments/ExpLiquidBrief";
import { ExpHeartbeatKPI } from "@/components/experiments/ExpHeartbeatKPI";
import { ExpGlitchDossier } from "@/components/experiments/ExpGlitchDossier";
import { ExpGoldenVortex } from "@/components/experiments/ExpGoldenVortex";
import { ExpKineticTunnel } from "@/components/experiments/ExpKineticTunnel";

const TOC = [
  { id: "exp-iris", code: "001" },
  { id: "exp-offering", code: "002" },
  { id: "exp-tube", code: "003" },
  { id: "exp-crystal", code: "004" },
  { id: "exp-field", code: "005" },
  { id: "exp-helmet", code: "006" },
  { id: "exp-stretch", code: "007" },
  { id: "exp-grove", code: "008" },
  { id: "exp-pact", code: "009" },
  { id: "exp-dissolve", code: "010" },
  { id: "exp-cyclone", code: "011" },
  { id: "exp-signal", code: "012" },
  { id: "exp-mirror", code: "013" },
  { id: "exp-liquid", code: "014" },
  { id: "exp-heartbeat", code: "015" },
  { id: "exp-glitch", code: "016" },
  { id: "exp-vortex", code: "017" },
  { id: "exp-tunnel", code: "018" },
] as const;

/** Secret archive of Holive lab experiments — isolated from the main landing. */
export function ExperimentsArchive() {
  const t = useTranslations("Experiments");

  return (
    <main className="relative min-h-screen bg-[var(--holive-black)] text-[var(--holive-white)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(51,0,114,0.55),transparent_70%)]"
      />

      <section className="section-pad relative mx-auto max-w-6xl pt-28 md:pt-32">
        <SectionReveal preset="drop">
          <p className="font-mono-code text-[0.7rem] uppercase tracking-[0.35em] text-[var(--holive-gold)]">
            {t("eyebrow")}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--holive-white)_78%,transparent)] md:text-lg">
            {t("intro")}
          </p>
          <p className="font-display mt-4 text-lg italic text-[var(--holive-gold-bright)]">
            “{t("openingRefran")}”
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#exp-iris"
              className="focus-ring rounded-sm border border-[var(--holive-gold)] bg-[var(--holive-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--holive-black)]"
            >
              {t("ctaOpen")}
            </a>
            <Link
              href="/"
              className="focus-ring rounded-sm border border-[var(--border)] px-5 py-2.5 text-sm text-[var(--holive-white)] hover:border-[var(--holive-gold)]"
            >
              {t("ctaHome")}
            </Link>
          </div>
        </SectionReveal>

        <SectionReveal preset="fade" delay={0.12} className="mt-14">
          <div className="rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_25%,transparent)] bg-[color-mix(in_srgb,var(--holive-purple)_18%,transparent)] p-5 md:p-6">
            <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
              {t("indexLabel")}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="focus-ring flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-[color-mix(in_srgb,var(--holive-white)_80%,transparent)] transition hover:bg-[color-mix(in_srgb,var(--holive-gold)_12%,transparent)] hover:text-[var(--holive-gold)]"
                  >
                    <span className="font-mono-code text-[0.65rem] text-[var(--holive-gold)]">
                      EXP-{item.code}
                    </span>
                    <span className="truncate">{t(`toc.${item.id}`)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </section>

      <section className="section-pad mx-auto flex max-w-6xl flex-col gap-16 pb-24 md:gap-20">
        <ExpContainmentIris />
        <ExpIcosahedronOffering />
        <ExpDossierTube />
        <ExpCrystalReliquary />
        <ExpLoyaltyField />
        <ExpCraftHelmet />
        <ExpStretchedMantra />
        <ExpOliveGrove />
        <ExpPactCore />
        <ExpDissolveSeal />
        <ExpWordCyclone />
        <ExpSignalRadar />
        <ExpMirrorLedger />
        <ExpLiquidBrief />
        <ExpHeartbeatKPI />
        <ExpGlitchDossier />
        <ExpGoldenVortex />
        <ExpKineticTunnel />
      </section>

      <section className="border-t border-[var(--border)] px-5 py-16 text-center md:px-8">
        <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.3em] text-[var(--holive-gold)]">
          {t("closingEyebrow")}
        </p>
        <p className="font-display mx-auto mt-3 max-w-xl text-xl italic text-[var(--holive-gold-bright)] md:text-2xl">
          “{t("closingRefran")}”
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--muted)]">{t("closingBody")}</p>
        <Link
          href="/#contact"
          className="focus-ring mt-8 inline-block rounded-sm border border-[var(--holive-gold)] px-6 py-2.5 text-sm font-semibold text-[var(--holive-gold)] hover:bg-[var(--holive-gold)] hover:text-[var(--holive-black)]"
        >
          {t("ctaContact")}
        </Link>
      </section>
    </main>
  );
}
