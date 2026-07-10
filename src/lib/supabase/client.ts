import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  CourseWaitlistInsert,
  GameScoreInsert,
  LeadInsert,
} from "./types";

/** Untyped client — table shapes live in `./types` and form payloads. */
export type HoliveSupabase = SupabaseClient;

export function createBrowserClient(): HoliveSupabase | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function insertLead(payload: LeadInsert) {
  const supabase = createBrowserClient();
  if (!supabase) return { data: null, error: new Error("missing_supabase") };
  return supabase.from("leads").insert(payload);
}

export async function insertWaitlist(payload: CourseWaitlistInsert) {
  const supabase = createBrowserClient();
  if (!supabase) return { data: null, error: new Error("missing_supabase") };
  return supabase.from("course_waitlist").insert(payload);
}

export async function insertGameScore(payload: GameScoreInsert) {
  const supabase = createBrowserClient();
  if (!supabase) return { data: null, error: new Error("missing_supabase") };
  return supabase.from("game_scores").insert(payload);
}
