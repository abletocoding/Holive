/**
 * Typed integration slots — wire real providers without reshaping the landing.
 * Env vars and comments mark where each container connects.
 */

export type CmsProvider = "sanity" | "contentful" | "supabase-cms" | "none";
export type PaymentsProvider = "stripe" | "mercadopago" | "none";
export type CrmProvider = "hubspot" | "pipedrive" | "supabase" | "none";
export type AnalyticsProvider = "ga4" | "plausible" | "posthog" | "none";
export type ChatProvider = "crisp" | "intercom" | "custom" | "none";

export type IntegrationSlots = {
  /** Headless CMS for courses / case studies copy */
  cms: CmsProvider;
  /** Course checkout / deposits */
  payments: PaymentsProvider;
  /** Lead sync beyond Supabase tables */
  crm: CrmProvider;
  /** Page analytics */
  analytics: AnalyticsProvider;
  /** Live chat widget */
  chat: ChatProvider;
};

export const integrationSlots: IntegrationSlots = {
  cms: "none",
  payments: "none",
  crm: "supabase",
  analytics: "none",
  chat: "none",
};

/**
 * CMS: set CMS_PROJECT_ID / CMS_DATASET and replace teaser copy fetch.
 * Payments: STRIPE_SECRET_KEY or MP_ACCESS_TOKEN for course checkout routes.
 * CRM: sync leads after insert (webhook or Edge Function).
 * Analytics: NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_PLAUSIBLE_DOMAIN.
 * Chat: NEXT_PUBLIC_CRISP_WEBSITE_ID — mount widget in SiteChrome.
 */
export function getIntegrationEnvHints(): Record<string, string | undefined> {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "[set]"
      : undefined,
    // CMS_PROJECT_ID: process.env.CMS_PROJECT_ID,
    // STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    // NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    // NEXT_PUBLIC_CRISP_WEBSITE_ID: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
  };
}
