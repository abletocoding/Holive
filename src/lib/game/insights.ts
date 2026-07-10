/**
 * Actionable micro-lessons shown after clearing a level / full run.
 * Aligned with Holive: ecosystems, sembrar/cosechar, usefulness over theater.
 */

export type Insight = { es: string; en: string; titleEs: string; titleEn: string };

/** One insight per level (index 0 = level 1). */
export const LEVEL_INSIGHTS: Insight[] = [
  {
    titleEs: "Semilla: una señal clara",
    titleEn: "Seed: one clear signal",
    es: "Antes de escalar, define una oferta que quepa en una frase. La claridad es el primer nodo del ecosistema.",
    en: "Before you scale, define an offer that fits in one sentence. Clarity is the first node in the ecosystem.",
  },
  {
    titleEs: "Germen: ritmo antes que volumen",
    titleEn: "Sprout: rhythm before volume",
    es: "Un canal bien cuidado vence a diez abandonados. Siembra frecuencia sostenible, no picos de ruido.",
    en: "One well-tended channel beats ten abandoned ones. Plant sustainable cadence, not noise spikes.",
  },
  {
    titleEs: "Raíz: digitaliza lo repetible",
    titleEn: "Root: digitize the repeatable",
    es: "Todo lo que haces dos veces merece un flujo. Automatiza la fricción; protege la atención humana.",
    en: "Anything you do twice deserves a flow. Automate friction; protect human attention.",
  },
  {
    titleEs: "Tallo: marca + código = promesa",
    titleEn: "Stem: brand + code = promise",
    es: "La marca promete. El código cumple. Si el sitio no corre, la promesa se rompe — midelo como un sistema vivo.",
    en: "Brand promises. Code delivers. If the site doesn't run, the promise breaks — measure it as a living system.",
  },
  {
    titleEs: "Malla: ignora el ruido del feed",
    titleEn: "Mesh: ignore feed noise",
    es: "Mide lo que mueve clientes, no likes. Los distractores del mercado son como flashes falsos: no los toques.",
    en: "Measure what moves clients, not likes. Market distractors are fake flashes — don't tap them.",
  },
  {
    titleEs: "Órbita: el cliente en el centro",
    titleEn: "Orbit: client at the center",
    es: "Tu negocio gira alrededor de quien pagas a servir. Diseña el flujo hacia ellos; el crecimiento sigue al flujo.",
    en: "Your business orbits who you get paid to serve. Design the flow toward them; growth follows the flow.",
  },
  {
    titleEs: "Constelación: lealtad con sistemas",
    titleEn: "Constellation: loyalty via systems",
    es: "La lealtad no es un post. Es un sistema que no falla: seguimiento, entrega, recurrencia. Siembra confianza; cosecha retención.",
    en: "Loyalty isn't a post. It's a system that doesn't fail: follow-up, delivery, recurrence. Plant trust; harvest retention.",
  },
  {
    titleEs: "Pulso Maestro: sal de lo cómodo",
    titleEn: "Master Pulse: leave comfort",
    es: "Dejar lo analógico a medias no es abandonar el alma — es dejar que el ecosistema respire. Construye una vez. Escala muchas.",
    en: "Leaving half-analog habits isn't abandoning soul — it's letting the ecosystem breathe. Build once. Scale many.",
  },
];

export function insightForLevel(levelId: number): Insight {
  const idx = Math.max(0, Math.min(LEVEL_INSIGHTS.length - 1, levelId - 1));
  return LEVEL_INSIGHTS[idx]!;
}

export function insightText(insight: Insight, locale: string) {
  return locale.startsWith("en")
    ? { title: insight.titleEn, body: insight.en }
    : { title: insight.titleEs, body: insight.es };
}
