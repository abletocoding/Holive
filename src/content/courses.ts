export type Course = {
  slug: string;
  status: "waitlist" | "soon";
  title: { es: string; en: string };
  blurb: { es: string; en: string };
  outcomes: { es: string[]; en: string[] };
};

export const COURSES: Course[] = [
  {
    slug: "marketing-con-alma",
    status: "waitlist",
    title: {
      es: "Marketing con alma y métricas",
      en: "Marketing with soul and metrics",
    },
    blurb: {
      es: "Narrativa, canales y medición — sin ruido de feed. Para equipos que quieren lealtad, no solo alcance.",
      en: "Narrative, channels, and measurement — without feed noise. For teams that want loyalty, not just reach.",
    },
    outcomes: {
      es: [
        "Oferta clara y mensaje de pureza",
        "Calendario vivo con ritmo real",
        "Tablero mínimo que sí se usa",
      ],
      en: [
        "Clear offer and purity of message",
        "Living calendar with real rhythm",
        "Minimal dashboard people actually use",
      ],
    },
  },
  {
    slug: "digitalizacion-pymes",
    status: "waitlist",
    title: {
      es: "Digitalización para PYMES",
      en: "Digitalization for SMBs",
    },
    blurb: {
      es: "Del papel al flujo: webs, CRM ligero y automatizaciones que respetan cómo opera tu negocio.",
      en: "From paper to flow: sites, light CRM, and automations that respect how your business actually runs.",
    },
    outcomes: {
      es: [
        "Mapa de fricción honesto",
        "Stack pequeño y útil",
        "Primer embudo que respira",
      ],
      en: [
        "Honest friction map",
        "Small useful stack",
        "First funnel that breathes",
      ],
    },
  },
  {
    slug: "automatizacion-sin-jerga",
    status: "soon",
    title: {
      es: "Automatización sin jerga",
      en: "Automation without jargon",
    },
    blurb: {
      es: "Siembra lo repetible. Cosecha tiempo. Herramientas explicadas en lenguaje de negocio.",
      en: "Plant the repeatable. Harvest time. Tools explained in business language.",
    },
    outcomes: {
      es: [
        "3 flujos listos para copiar",
        "Criterio de qué no automatizar",
        "Checklist de lealtad post-venta",
      ],
      en: [
        "3 copy-ready flows",
        "Judgment on what not to automate",
        "Post-sale loyalty checklist",
      ],
    },
  },
];
