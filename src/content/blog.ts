export type BlogPost = {
  slug: string;
  date: string;
  readingMinutes: number;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  tags: { es: string[]; en: string[] };
  body: { es: string[]; en: string[] };
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ecosistemas-vivos",
    date: "2026-06-12",
    readingMinutes: 5,
    title: {
      es: "Tu negocio es un ecosistema vivo",
      en: "Your business is a living ecosystem",
    },
    excerpt: {
      es: "Marca, operaciones, contenido y código comparten un pulso. Si un nodo se seca, la malla entera se debilita.",
      en: "Brand, ops, content, and code share one pulse. Starve one node and the whole mesh weakens.",
    },
    tags: {
      es: ["sistemas", "estrategia"],
      en: ["systems", "strategy"],
    },
    body: {
      es: [
        "Holive trata a cada empresa como un organismo: raíces (oferta y promesa), tronco (operaciones), hojas (canales) y savia (datos).",
        "Digitalizar no es publicar un sitio y olvidarlo. Es conectar el flujo: lead → conversación → entrega → lealtad.",
        "Cuando el marketing promete lo que el sistema no puede cumplir, el ecosistema se enferma. Pureza es alinear mensaje y capacidad.",
        "Empieza por un mapa honesto: ¿qué se repite? ¿qué se rompe? ¿qué se mide? Luego siembra procesos. Cosecha tiempo.",
        "Holi lo resume así: riega con datos, poda el ruido, protege la atención del cliente.",
      ],
      en: [
        "Holive treats every company as an organism: roots (offer and promise), trunk (operations), leaves (channels), and sap (data).",
        "Digitizing is not publishing a site and forgetting it. It is connecting the flow: lead → conversation → delivery → loyalty.",
        "When marketing promises what the system cannot deliver, the ecosystem gets sick. Purity means aligning message and capacity.",
        "Start with an honest map: what repeats? what breaks? what gets measured? Then plant processes. Harvest time.",
        "Holi puts it simply: water with data, prune the noise, protect the client's attention.",
      ],
    },
  },
  {
    slug: "sembrar-cosechar",
    date: "2026-06-20",
    readingMinutes: 4,
    title: {
      es: "Sembrar procesos, cosechar tiempo",
      en: "Plant processes, harvest time",
    },
    excerpt: {
      es: "La automatización no es magia: es sembrar lo repetible para liberar lo humano.",
      en: "Automation is not magic: it is planting the repeatable so the human work can breathe.",
    },
    tags: {
      es: ["automatización", "PYMES"],
      en: ["automation", "SMB"],
    },
    body: {
      es: [
        "Salir de la zona cómoda duele menos cuando el primer paso es concreto: documentar un flujo que ya haces tres veces por semana.",
        "Siembra: formularios claros, respuestas plantilla con alma, recordatorios que no fallan.",
        "Cosecha: horas recuperadas, menos fricción, clientes que sienten lealtad porque el sistema no los deja caer.",
        "Holive digitaliza lo repetible y humaniza lo que importa — la conversación, el criterio, el cierre.",
        "No necesitas cien herramientas. Necesitas un embudo que respire y un equipo que sepa por qué existe.",
      ],
      en: [
        "Leaving the comfort zone hurts less when the first step is concrete: document a flow you already run three times a week.",
        "Plant: clear forms, templated replies with soul, reminders that do not fail.",
        "Harvest: hours recovered, less friction, clients who feel loyalty because the system does not drop them.",
        "Holive digitizes the repeatable and humanizes what matters — conversation, judgment, close.",
        "You do not need a hundred tools. You need a funnel that breathes and a team that knows why it exists.",
      ],
    },
  },
  {
    slug: "marca-codigo",
    date: "2026-06-28",
    readingMinutes: 6,
    title: {
      es: "La marca es promesa. El código es cumplimiento.",
      en: "Brand is promise. Code is delivery.",
    },
    excerpt: {
      es: "Sin sistemas, la marca es teatro. Sin marca, el código es ruido técnico.",
      en: "Without systems, brand is theater. Without brand, code is technical noise.",
    },
    tags: {
      es: ["marca", "producto"],
      en: ["brand", "product"],
    },
    body: {
      es: [
        "En Holive, púrpura y oro no son decoración: son señal de pureza y lealtad. El Matrix es atmósfera — el producto es utilidad.",
        "Una identidad clara acelera cada decisión de producto. Un producto vivo protege la reputación de la identidad.",
        "Los clientes no compran ruido. Compran claridad: qué ofreces, cómo llega, qué pasa después.",
        "Construye una vez con intención. Escala muchas veces con sistemas que no traicionan la promesa.",
        "Cuando marca y código comparten pulso, el negocio deja de improvisar y empieza a crecer como ecosistema.",
      ],
      en: [
        "At Holive, purple and gold are not decoration: they signal purity and loyalty. Matrix is atmosphere — the product is usefulness.",
        "A clear identity speeds every product decision. A living product protects the identity's reputation.",
        "Clients do not buy noise. They buy clarity: what you offer, how it arrives, what happens next.",
        "Build once with intention. Scale many times with systems that do not betray the promise.",
        "When brand and code share a pulse, the business stops improvising and starts growing as an ecosystem.",
      ],
    },
  },
  {
    slug: "foco-oferta",
    date: "2026-07-02",
    readingMinutes: 4,
    title: {
      es: "Una oferta clara vence a diez ideas brillantes",
      en: "One clear offer beats ten brilliant ideas",
    },
    excerpt: {
      es: "El foco no es limitarte: es servir mejor a quien ya confía en ti.",
      en: "Focus is not limiting yourself: it is serving better the people who already trust you.",
    },
    tags: {
      es: ["oferta", "crecimiento"],
      en: ["offer", "growth"],
    },
    body: {
      es: [
        "El emprendedor que sale del confort suele llegar con demasiadas ideas. Holi levanta una ceja: ¿cuál sirve al cliente esta semana?",
        "Elige un problema caro. Diseña una oferta medible. Construye el flujo. Luego enseña el método.",
        "Los cursos de Holive nacen de esa lógica: aprender para aplicar, no para acumular pestañas abiertas.",
        "Sirve al cliente. El sistema hace el resto — si lo sembraste bien.",
      ],
      en: [
        "Founders leaving comfort often arrive with too many ideas. Holi raises an eyebrow: which one serves the client this week?",
        "Pick an expensive problem. Design a measurable offer. Build the flow. Then teach the method.",
        "Holive courses come from that logic: learn to apply, not to collect open tabs.",
        "Serve the client. The system does the rest — if you planted it well.",
      ],
    },
  },
  {
    slug: "digital-organico",
    date: "2026-07-08",
    readingMinutes: 5,
    title: {
      es: "Lo digital también es orgánico",
      en: "Digital can be organic too",
    },
    excerpt: {
      es: "Sitios, SaaS y automatizaciones deben crecer con el equipo — no quedar como PDFs de estrategia.",
      en: "Sites, SaaS, and automations should grow with the team — not sit as strategy PDFs.",
    },
    tags: {
      es: ["digitalización", "filosofía"],
      en: ["digitalization", "philosophy"],
    },
    body: {
      es: [
        "Orgánico no significa improvisado. Significa vivo: medible, iterable, leal al contexto real del negocio.",
        "Un CRM vacío es un árbol seco. Un tablero que nadie mira es decoración. Holive prefiere menos pantallas y más pulso.",
        "La digitalización con alma respeta a quien abre temprano y cierra tarde. Empatía mexicana de trinchera, sin romanticismo vacío.",
        "Código vivo: si no corre, no sirve. Si corre pero nadie lo entiende, tampoco.",
        "Transformación es salir de hábitos solo-analógicos sin abandonar a las personas que construyeron el negocio.",
      ],
      en: [
        "Organic does not mean improvised. It means alive: measurable, iterable, loyal to the real business context.",
        "An empty CRM is a dry tree. A dashboard nobody watches is decoration. Holive prefers fewer screens and more pulse.",
        "Soulful digitalization respects people who open early and close late. Ground-level entrepreneurship empathy — no empty romance.",
        "Living code: if it does not run, it does not serve. If it runs but nobody understands it, same problem.",
        "Transformation is leaving analog-only habits without abandoning the people who built the business.",
      ],
    },
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function localized<T extends Record<"es" | "en", unknown>>(
  field: T,
  locale: string,
): T["es"] | T["en"] {
  return locale.startsWith("en") ? field.en : field.es;
}
