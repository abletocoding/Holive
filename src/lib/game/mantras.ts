/**
 * Rotating business mantras for Neural Pulse — entrepreneurial, useful,
 * ecosystem-minded. Holive voice: purity, loyalty, living systems.
 */

export type Mantra = { es: string; en: string };

export const BUSINESS_MANTRAS: Mantra[] = [
  {
    es: "Sirve al cliente. El sistema hace el resto.",
    en: "Serve the client. The system does the rest.",
  },
  {
    es: "Siembra procesos. Cosecha tiempo.",
    en: "Plant processes. Harvest time.",
  },
  {
    es: "Tu negocio es un ecosistema vivo — riégalo con datos.",
    en: "Your business is a living ecosystem — water it with data.",
  },
  {
    es: "Foco: una oferta clara vence a diez ideas brillantes.",
    en: "Focus: one clear offer beats ten brilliant ideas.",
  },
  {
    es: "Digitaliza lo repetible. Humaniza lo que importa.",
    en: "Digitize the repeatable. Humanize what matters.",
  },
  {
    es: "Lealtad se construye con sistemas que no fallan.",
    en: "Loyalty is built with systems that don't fail.",
  },
  {
    es: "Mide lo que mueve. Ignora el ruido del feed.",
    en: "Measure what moves. Ignore feed noise.",
  },
  {
    es: "Construye una vez. Escala muchas.",
    en: "Build once. Scale many.",
  },
  {
    es: "La marca es promesa. El código es cumplimiento.",
    en: "Brand is promise. Code is delivery.",
  },
  {
    es: "Sal de la zona cómoda: ahí no crecen los ecosistemas.",
    en: "Leave the comfort zone — ecosystems don't grow there.",
  },
  {
    es: "Automatiza la fricción. Protege la atención.",
    en: "Automate friction. Protect attention.",
  },
  {
    es: "Un canal bien cuidado vale más que diez abandonados.",
    en: "One well-tended channel beats ten abandoned ones.",
  },
  {
    es: "Enseña el método. Luego entrega el resultado.",
    en: "Teach the method. Then deliver the result.",
  },
  {
    es: "Pureza en el mensaje. Precisión en la ejecución.",
    en: "Purity in the message. Precision in the execution.",
  },
  {
    es: "Los clientes no compran ruido — compran claridad.",
    en: "Clients don't buy noise — they buy clarity.",
  },
  {
    es: "Diseña el flujo. El crecimiento sigue al flujo.",
    en: "Design the flow. Growth follows the flow.",
  },
  {
    es: "Hoy siembras el embudo. Mañana cosechas recurrencia.",
    en: "Plant the funnel today. Harvest recurrence tomorrow.",
  },
  {
    es: "Código vivo: si no corre, no sirve.",
    en: "Living code: if it doesn't run, it doesn't serve.",
  },
];

export function mantraForLocale(m: Mantra, locale: string): string {
  return locale.startsWith("en") ? m.en : m.es;
}

export function pickMantra(index: number): Mantra {
  return BUSINESS_MANTRAS[index % BUSINESS_MANTRAS.length]!;
}
