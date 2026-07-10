import { setRequestLocale, getTranslations } from "next-intl/server";
import { Footer } from "@/components/sections/Footer";
import { ContactPageClient } from "@/components/pages/ContactPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.contact" });
  return { title: `${t("title")} — Holive`, description: t("body") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ContactPageClient />
      <Footer />
    </>
  );
}
