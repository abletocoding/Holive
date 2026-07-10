"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createBrowserClient } from "@/lib/supabase/client";

type Props = {
  score: number;
  level: number;
  onDone: () => void;
  onSkip: () => void;
};

/**
 * Soft Easter-egg CTA after victory / deep progress — email + objective → Supabase.
 */
export function LeadCapture({ score, level, onDone, onSkip }: Props) {
  const t = useTranslations("HoliGame.lead");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [objective, setObjective] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !objective.trim()) return;
    setStatus("loading");

    const supabase = createBrowserClient();
    if (!supabase) {
      setStatus("err");
      return;
    }

    const { error } = await supabase.from("neural_pulse_leads").insert({
      email: email.trim().toLowerCase(),
      objective: objective.trim().slice(0, 500),
      score,
      level,
      locale,
    });

    if (error) {
      // Fallback: course_waitlist if new table not migrated yet
      const fb = await supabase.from("course_waitlist").insert({
        email: email.trim().toLowerCase(),
        name: objective.trim().slice(0, 120),
        locale,
        course_interest: `neural_pulse:L${level}:S${score}`,
      });
      if (fb.error) {
        setStatus("err");
        return;
      }
    }

    setStatus("ok");
    window.setTimeout(onDone, 900);
  }

  return (
    <div className="w-full text-left">
      <p className="font-mono-code text-[0.55rem] tracking-[0.28em] text-white/40 uppercase">
        {t("eyebrow")}
      </p>
      <p className="mt-1 text-sm text-white/70">{t("blurb")}</p>

      {status === "ok" ? (
        <p className="mt-4 text-sm text-[var(--holive-gold)]">{t("thanks")}</p>
      ) : (
        <form onSubmit={(e) => void onSubmit(e)} className="mt-4 flex flex-col gap-3">
          <label className="block">
            <span className="sr-only">{t("email")}</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              className="focus-ring w-full border border-white/20 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-white/35"
            />
          </label>
          <label className="block">
            <span className="sr-only">{t("objective")}</span>
            <textarea
              required
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder={t("objective")}
              className="focus-ring w-full resize-none border border-white/20 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-white/35"
            />
          </label>
          {status === "err" && (
            <p className="text-xs text-red-300/90">{t("error")}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="focus-ring min-h-11 bg-[var(--holive-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--holive-black)] disabled:opacity-60"
            >
              {status === "loading" ? t("sending") : t("submit")}
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="focus-ring min-h-11 px-3 py-2 text-xs text-white/50 hover:text-white/80"
            >
              {t("skip")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
