"use client";

type Props = {
  unlocked: boolean;
  leadId?: string | null;
  hint: string;
  missing: string;
};

/** Cal.com embed — only after questionnaire gate unlocks. */
export function ConsultaCalEmbed({ unlocked, leadId, hint, missing }: Props) {
  const url = process.env.NEXT_PUBLIC_CAL_EMBED_URL;

  if (!unlocked) {
    return (
      <div className="rounded-sm border border-dashed border-[color-mix(in_srgb,var(--holive-gold)_35%,transparent)] bg-[color-mix(in_srgb,var(--holive-purple)_12%,transparent)] px-5 py-10 text-center">
        <p className="font-mono-code text-[0.65rem] uppercase tracking-[0.28em] text-[var(--holive-gold)]">
          CALENDARIO BLOQUEADO
        </p>
        <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]">
          {hint}
        </p>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] px-5 py-10 text-center">
        <p className="font-display text-xl text-[var(--holive-gold-bright)]">HOLIVE</p>
        <p className="mt-3 text-sm text-[var(--muted)]">{missing}</p>
        {leadId ? (
          <p className="font-mono-code mt-4 text-[0.6rem] tracking-[0.2em] text-[var(--holive-gold)]">
            REF · {leadId.slice(0, 8).toUpperCase()}
          </p>
        ) : null}
      </div>
    );
  }

  const src = leadId
    ? `${url}${url.includes("?") ? "&" : "?"}metadata[leadId]=${encodeURIComponent(leadId)}`
    : url;

  return (
    <div className="overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--holive-gold)_30%,var(--border))] bg-[#0a0810]">
      <iframe
        title="Holive consulta"
        src={src}
        className="h-[min(720px,80vh)] w-full"
        loading="lazy"
      />
    </div>
  );
}
