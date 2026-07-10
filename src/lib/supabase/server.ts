import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side anon client for Server Actions / Route Handlers.
 * Prefer RLS-safe public inserts; never expose service role in the browser.
 */
export function createServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
