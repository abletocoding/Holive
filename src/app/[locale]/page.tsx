import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Digital } from "@/components/sections/Digital";
import { Courses } from "@/components/sections/Courses";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { ShowcaseStrip } from "@/components/sections/ShowcaseStrip";
import { PortalSection } from "@/components/effects/PortalSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <main id="main">
        <PortalSection>
          <Manifesto />
        </PortalSection>
        <ShowcaseStrip />
        <PortalSection>
          <Services />
        </PortalSection>
        <PortalSection>
          <Digital />
        </PortalSection>
        <Courses />
        <PortalSection>
          <Process />
        </PortalSection>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
