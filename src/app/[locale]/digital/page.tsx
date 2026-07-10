import { setRequestLocale, getTranslations } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { DigitalPageClient } from "@/components/pages/DigitalPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.digital" });
  return { title: `${t("title")} — Holive`, description: t("intro") };
}

export default async function DigitalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <DigitalPageClient />
      <Footer showGame={false} />
    </>
  );
}
