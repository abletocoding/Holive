"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createBrowserClient } from "@/lib/supabase/client";
import type { LeadInsert, LeadInterest } from "@/lib/supabase/types";

const interests: LeadInterest[] = [
  "marketing",
  "digital",
  "courses",
  "other",
];

export function LeadForm() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "missing"
  >("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload: LeadInsert = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("company") || "").trim() || null,
      interest:
        (String(data.get("interest") || "other") as LeadInterest) || null,
      message: String(data.get("message") || "").trim() || null,
      locale,
      source: "landing",
    };

    if (!payload.name || !payload.email) return;

    const supabase = createBrowserClient();
    if (!supabase) {
      setStatus("missing");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.from("leads").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }

    // CRM slot: sync lead after insert (HubSpot / Pipedrive / webhook)
    // await syncLeadToCrm?.(payload);

    setStatus("success");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="text-xs tracking-wide">
            {t("name")}
          </label>
          <input
            id="lead-name"
            name="name"
            required
            autoComplete="name"
            className="focus-ring mt-1.5 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="text-xs tracking-wide">
            {t("email")}
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="focus-ring mt-1.5 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-company" className="text-xs tracking-wide">
            {t("company")}
          </label>
          <input
            id="lead-company"
            name="company"
            autoComplete="organization"
            className="focus-ring mt-1.5 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="lead-interest" className="text-xs tracking-wide">
            {t("interest")}
          </label>
          <select
            id="lead-interest"
            name="interest"
            defaultValue="marketing"
            className="focus-ring mt-1.5 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
          >
            {interests.map((value) => (
              <option key={value} value={value}>
                {t(`interestOptions.${value}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className="text-xs tracking-wide">
          {t("message")}
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          className="focus-ring mt-1.5 w-full resize-y border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="focus-ring w-full bg-[var(--holive-gold)] px-6 py-3.5 text-sm font-semibold tracking-wide text-[var(--holive-black)] transition hover:bg-[var(--holive-gold-bright)] disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </button>

      {status === "success" && (
        <p className="text-sm text-[var(--holive-gold)]" role="status">
          {t("success")}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {t("error")}
        </p>
      )}
      {status === "missing" && (
        <p
          className="text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]"
          role="status"
        >
          {t("missing")}
        </p>
      )}
    </form>
  );
}
