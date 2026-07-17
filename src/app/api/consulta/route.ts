import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { ConsultaLeadInsert, ConsultaPathInterest } from "@/lib/supabase/types";

export const runtime = "nodejs";

type Body = Partial<ConsultaLeadInsert> & {
  pathInterest?: ConsultaPathInterest | null;
};

function requiredString(value: unknown, max = 2000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

async function notifyTelegram(payload: ConsultaLeadInsert & { id?: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    "HOLIVE · Nuevo lead /consulta",
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    `WhatsApp: ${payload.whatsapp}`,
    `Zona: ${payload.zone}`,
    `Negocio: ${payload.business_type} · ${payload.stage}`,
    `Cuello: ${payload.bottleneck}`,
    `Facturación: ${payload.revenue_range}`,
    `Delegación: ${payload.delegation}`,
    `Prioridad 90d: ${payload.priority_90d}`,
    `Presupuesto Q: ${payload.budget_quarter}`,
    payload.path_interest ? `Interés: ${payload.path_interest}` : null,
    payload.locale ? `Locale: ${payload.locale}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // Non-blocking: lead is already stored
  }
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const payload: ConsultaLeadInsert = {
    business_type: requiredString(body.business_type, 120) || "",
    stage: requiredString(body.stage, 120) || "",
    bottleneck: requiredString(body.bottleneck, 2000) || "",
    revenue_range: requiredString(body.revenue_range, 80) || "",
    delegation: requiredString(body.delegation, 120) || "",
    tried_before: requiredString(body.tried_before, 2000) || "",
    priority_90d: requiredString(body.priority_90d, 500) || "",
    budget_quarter: requiredString(body.budget_quarter, 80) || "",
    name: requiredString(body.name, 120) || "",
    email: requiredString(body.email, 200) || "",
    whatsapp: requiredString(body.whatsapp, 40) || "",
    zone: requiredString(body.zone, 120) || "",
    locale: requiredString(body.locale, 8),
    source: "consulta",
    cal_booked: false,
    path_interest: body.path_interest ?? body.pathInterest ?? null,
    raw: body.raw ?? null,
  };

  const missing = Object.entries({
    business_type: payload.business_type,
    stage: payload.stage,
    bottleneck: payload.bottleneck,
    revenue_range: payload.revenue_range,
    delegation: payload.delegation,
    tried_before: payload.tried_before,
    priority_90d: payload.priority_90d,
    budget_quarter: payload.budget_quarter,
    name: payload.name,
    email: payload.email,
    whatsapp: payload.whatsapp,
    zone: payload.zone,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length || !payload.email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "validation", missing },
      { status: 400 },
    );
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "missing_supabase" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("leads_consulta")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: "insert_failed", detail: error.message },
      { status: 500 },
    );
  }

  void notifyTelegram({ ...payload, id: data?.id });

  return NextResponse.json({ ok: true, leadId: data?.id ?? null });
}
