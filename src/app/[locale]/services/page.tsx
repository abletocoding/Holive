import { setRequestLocale, getTranslations } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { ServicesPageClient } from "@/components/pages/ServicesPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.services" });
  return { title: `${t("title")} — Holive`, description: t("intro") };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ServicesPageClient />
      <Footer showGame={false} />
    </>
  );
}
