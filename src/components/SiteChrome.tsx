"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { PlausibleAnalytics } from "@/components/analytics/PlausibleAnalytics";
import { useTranslations } from "next-intl";

export function SiteChrome({ children }: { children: ReactNode }) {
  const t = useTranslations("Nav");

  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        {t("skip")}
      </a>
      <SiteHeader />
      {children}
      <PlausibleAnalytics />
      {/* Chat slot: mount Crisp/Intercom when NEXT_PUBLIC_CRISP_WEBSITE_ID is set */}
    </ThemeProvider>
  );
}
