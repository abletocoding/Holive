"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { HoliCompanion } from "@/components/holi/HoliCompanion";
import { useTranslations } from "next-intl";

const BrandCursor = dynamic(
  () => import("@/components/effects/BrandCursor").then((m) => m.BrandCursor),
  { ssr: false },
);
const ScrollProgress = dynamic(
  () =>
    import("@/components/effects/ScrollProgress").then((m) => m.ScrollProgress),
  { ssr: false },
);
const PageTransition = dynamic(
  () =>
    import("@/components/effects/PageTransition").then((m) => m.PageTransition),
  { ssr: false },
);
const GoldDustHost = dynamic(
  () => import("@/components/effects/GoldDust").then((m) => m.GoldDustHost),
  { ssr: false },
);
const HoliEasterEgg = dynamic(
  () =>
    import("@/components/effects/HoliEasterEgg").then((m) => m.HoliEasterEgg),
  { ssr: false },
);

export function SiteChrome({ children }: { children: ReactNode }) {
  const t = useTranslations("Nav");
  const h = useTranslations("Holi.companion");

  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        {t("skip")}
      </a>
      <BrandCursor />
      <PageTransition />
      <GoldDustHost />
      <HoliEasterEgg />
      <ScrollProgress />
      <SiteHeader />
      {children}
      <HoliCompanion messages={[h("a"), h("b"), h("c"), h("d")]} />
    </ThemeProvider>
  );
}
