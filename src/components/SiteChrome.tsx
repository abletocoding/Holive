"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { HoliCompanion } from "@/components/holi/HoliCompanion";
import { useTranslations } from "next-intl";

export function SiteChrome({ children }: { children: ReactNode }) {
  const t = useTranslations("Nav");
  const h = useTranslations("Holi.companion");

  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        {t("skip")}
      </a>
      <SiteHeader />
      {children}
      <HoliCompanion messages={[h("a"), h("b"), h("c"), h("d")]} />
    </ThemeProvider>
  );
}
