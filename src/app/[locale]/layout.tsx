import type { Metadata } from "next";
import { Syne, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteChrome } from "@/components/SiteChrome";
import "../globals.css";

const display = Syne({
  variable: "--font-holive-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Fraunces({
  variable: "--font-holive-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-holive-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/brand/favicon.svg",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Holive",
      locale: locale === "es" ? "es_MX" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="theme-dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('holive-theme');if(t==='light'||t==='dark'){document.documentElement.classList.remove('theme-light','theme-dark');document.documentElement.classList.add('theme-'+t);document.documentElement.style.colorScheme=t;}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <SiteChrome>{children}</SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
