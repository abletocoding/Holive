import { setRequestLocale, getTranslations } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { CoursesPageClient } from "@/components/pages/CoursesPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.courses" });
  return { title: `${t("title")} — Holive`, description: t("intro") };
}

export default async function CoursesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <CoursesPageClient />
      <Footer showGame={false} />
    </>
  );
}
