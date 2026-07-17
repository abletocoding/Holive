import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ConsultaLanding } from "@/components/consulta/ConsultaLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Consulta" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ConsultaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConsultaLanding />;
}
