import { setRequestLocale, getTranslations } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { BlogIndexClient } from "@/components/pages/BlogIndexClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.blog" });
  return { title: `${t("title")} — Holive`, description: t("intro") };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <BlogIndexClient />
      <Footer showGame={false} />
    </>
  );
}
