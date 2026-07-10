import { setRequestLocale, getTranslations } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { HoliStories } from "@/components/sections/HoliStories";
import { PageHero } from "@/components/ui/PageHero";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.historias" });
  return { title: `${t("title")} — Holive`, description: t("intro") };
}

export default async function HistoriasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.historias");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        ambient="none"
      >
        <HoliStories mode="full" showIntro={false} />
      </PageHero>
      <Footer />
    </>
  );
}
