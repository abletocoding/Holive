"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createBrowserClient } from "@/lib/supabase/client";

export function WaitlistForm() {
  const t = useTranslations("Courses");
  const locale = useLocale();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "missing"
  >("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const name = String(data.get("name") || "").trim() || null;

    if (!email) return;

    const supabase = createBrowserClient();
    if (!supabase) {
      setStatus("missing");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.from("course_waitlist").insert({
      email,
      name,
      locale,
      course_interest: "general",
    });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
    const { fireGoldDust } = await import("@/components/effects/GoldDust");
    fireGoldDust();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex max-w-lg flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="waitlist-name">
          {t("waitlistName")}
        </label>
        <input
          id="waitlist-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t("waitlistName")}
          className="focus-ring w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
        />
        <label className="sr-only" htmlFor="waitlist-email">
          {t("waitlistPlaceholder")}
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("waitlistPlaceholder")}
          className="focus-ring w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="focus-ring bg-[var(--holive-purple)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--holive-white)] transition hover:bg-[var(--holive-purple-bright)] disabled:opacity-60"
      >
        {status === "loading" ? "…" : t("waitlistCta")}
      </button>
      {status === "success" && (
        <p className="text-sm text-[var(--holive-gold)]" role="status">
          {t("waitlistSuccess")}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {t("waitlistError")}
        </p>
      )}
      {status === "missing" && (
        <p className="text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]" role="status">
          {t("waitlistMissing")}
        </p>
      )}
    </form>
  );
}
