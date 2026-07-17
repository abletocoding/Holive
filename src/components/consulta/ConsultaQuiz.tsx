"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ConsultaCalEmbed } from "@/components/consulta/ConsultaCalEmbed";
import type { ConsultaPathInterest } from "@/lib/supabase/types";

type Answers = {
  business_type: string;
  stage: string;
  bottleneck: string;
  revenue_range: string;
  delegation: string;
  tried_before: string;
  priority_90d: string;
  budget_quarter: string;
  name: string;
  email: string;
  whatsapp: string;
  zone: string;
  path_interest: ConsultaPathInterest | "";
};

const empty: Answers = {
  business_type: "",
  stage: "",
  bottleneck: "",
  revenue_range: "",
  delegation: "",
  tried_before: "",
  priority_90d: "",
  budget_quarter: "",
  name: "",
  email: "",
  whatsapp: "",
  zone: "",
  path_interest: "",
};

type Step =
  | "business_type"
  | "stage"
  | "bottleneck"
  | "revenue_range"
  | "delegation"
  | "tried_before"
  | "priority_90d"
  | "budget_quarter"
  | "contact";

const STEPS: Step[] = [
  "business_type",
  "stage",
  "bottleneck",
  "revenue_range",
  "delegation",
  "tried_before",
  "priority_90d",
  "budget_quarter",
  "contact",
];

/** Multi-step questionnaire gate before Cal.com. */
export function ConsultaQuiz() {
  const t = useTranslations("Consulta.quiz");
  const locale = useLocale();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>(empty);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error" | "missing">(
    "idle",
  );
  const [leadId, setLeadId] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState("");

  const step = STEPS[stepIdx];
  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  const optionKeys = useMemo(() => {
    const map: Partial<Record<Step, string[]>> = {
      business_type: ["retail", "services", "saas", "agency", "other"],
      stage: ["validate", "grow", "scale", "rebuild"],
      revenue_range: ["u50", "u150", "u500", "u1m", "o1m"],
      delegation: ["solo", "partial", "team"],
      budget_quarter: ["u10", "u30", "u80", "o80"],
    };
    return map[step] ?? null;
  }, [step]);

  function setField<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance() {
    if (step === "contact") {
      return Boolean(
        answers.name.trim() &&
          answers.email.includes("@") &&
          answers.whatsapp.trim() &&
          answers.zone.trim(),
      );
    }
    if (step === "bottleneck" || step === "tried_before" || step === "priority_90d") {
      return Boolean(answers[step].trim());
    }
    return Boolean(answers[step as keyof Answers]);
  }

  async function submit() {
    setStatus("loading");
    setErrorDetail("");
    try {
      const res = await fetch("/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          path_interest: answers.path_interest || null,
          locale,
          source: "consulta",
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        leadId?: string | null;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        if (json.error === "missing_supabase") {
          setStatus("missing");
          return;
        }
        setErrorDetail(json.error || "error");
        setStatus("error");
        return;
      }
      setLeadId(json.leadId ?? null);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  async function next() {
    if (!canAdvance()) return;
    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
      return;
    }
    await submit();
  }

  if (status === "done") {
    return (
      <div id="consulta-agenda" className="scroll-mt-28 space-y-6">
        <div className="rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_40%,var(--border))] bg-[linear-gradient(160deg,#F7F4FB,#FFFFFF)] px-5 py-6">
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
            {t("unlockedEyebrow")}
          </p>
          <p className="font-display mt-2 text-2xl text-[var(--holive-purple)] md:text-3xl">
            {t("unlockedTitle")}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            {t("unlockedBody")}
          </p>
        </div>
        <ConsultaCalEmbed
          unlocked
          leadId={leadId}
          hint={t("calLockedHint")}
          missing={t("calMissing")}
        />
      </div>
    );
  }

  return (
    <div id="consulta-quiz" className="scroll-mt-28">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
            {t("progress", { current: stepIdx + 1, total: STEPS.length })}
          </p>
          <span className="text-xs text-[var(--muted)]">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--holive-purple)_25%,transparent)]">
          <div
            className="h-full bg-[var(--holive-gold)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-sm border border-[var(--border)] bg-white p-5 shadow-[0_16px_50px_rgba(51,0,114,0.07)] md:p-7">
        <h3 className="font-display text-xl text-[var(--holive-purple)] md:text-2xl">
          {t(`steps.${step}.title`)}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t(`steps.${step}.help`)}
        </p>

        <div className="mt-6">
          {optionKeys ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {optionKeys.map((key) => {
                const selected = answers[step as keyof Answers] === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setField(step as keyof Answers, key as never)}
                    className={`focus-ring rounded-sm border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-[var(--holive-gold)] bg-[color-mix(in_srgb,var(--holive-gold)_14%,white)] text-[var(--holive-purple)]"
                        : "border-[var(--border)] text-[var(--holive-black)] hover:border-[var(--holive-gold)]/60"
                    }`}
                  >
                    {t(`options.${step}.${key}`)}
                  </button>
                );
              })}
            </div>
          ) : null}

          {(step === "bottleneck" || step === "tried_before" || step === "priority_90d") && (
            <textarea
              value={answers[step]}
              onChange={(e) => setField(step, e.target.value)}
              rows={4}
              className="focus-ring mt-1 w-full resize-y rounded-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)]"
              placeholder={t(`steps.${step}.placeholder`)}
            />
          )}

          {step === "contact" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "text"],
                  ["email", "email"],
                  ["whatsapp", "tel"],
                  ["zone", "text"],
                ] as const
              ).map(([field, type]) => (
                <div key={field} className={field === "zone" ? "sm:col-span-2" : ""}>
                  <label className="text-xs tracking-wide text-[var(--muted)]">
                    {t(`contact.${field}`)}
                  </label>
                  <input
                    type={type}
                    value={answers[field]}
                    onChange={(e) => setField(field, e.target.value)}
                    required
                    className="focus-ring mt-1.5 w-full rounded-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="mb-2 text-xs tracking-wide text-[var(--muted)]">
                  {t("contact.pathLabel")}
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(["service", "courses", "advisory"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setField("path_interest", p)}
                      className={`focus-ring rounded-sm border px-3 py-2.5 text-sm ${
                        answers.path_interest === p
                          ? "border-[var(--holive-gold)] text-[var(--holive-gold)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      {t(`contact.paths.${p}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {stepIdx > 0 ? (
            <button
              type="button"
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              className="focus-ring rounded-sm border border-[var(--border)] px-4 py-2.5 text-sm"
            >
              {t("back")}
            </button>
          ) : null}
          <button
            type="button"
            disabled={!canAdvance() || status === "loading"}
            onClick={() => void next()}
            className="focus-ring rounded-sm bg-[var(--holive-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--holive-black)] disabled:opacity-50"
          >
            {status === "loading"
              ? t("sending")
              : stepIdx === STEPS.length - 1
                ? t("submit")
                : t("next")}
          </button>
        </div>

        {status === "error" ? (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {t("error")} {errorDetail ? `(${errorDetail})` : ""}
          </p>
        ) : null}
        {status === "missing" ? (
          <p className="mt-4 text-sm text-[var(--muted)]" role="status">
            {t("missing")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
