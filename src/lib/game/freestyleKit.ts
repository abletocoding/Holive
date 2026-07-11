const STORAGE_KEY = "holive-neural-freestyle-kit-v1";

export type FreestyleTheme = "pulse" | "heal" | "gold" | "night";
export type FreestylePadCount = 4 | 6 | 8;

export type FreestylePad = {
  id: string;
  label: string;
  tone: number;
  color: string;
  x?: number;
  y?: number;
};

export type FreestyleKit = {
  theme: FreestyleTheme;
  padCount: FreestylePadCount;
  tempo: number;
  metronome: boolean;
  pads: FreestylePad[];
};

const DEFAULT_PADS: FreestylePad[] = [
  { id: "root", label: "Root", tone: 174, color: "var(--holive-purple)" },
  { id: "seed", label: "Seed", tone: 220, color: "var(--holive-gold)" },
  { id: "stem", label: "Stem", tone: 261.63, color: "var(--holive-purple-bright)" },
  { id: "aura", label: "Aura", tone: 329.63, color: "var(--holive-gold-bright)" },
  { id: "mesh", label: "Mesh", tone: 392, color: "color-mix(in srgb, var(--holive-purple) 70%, white)" },
  { id: "heal", label: "Heal", tone: 528, color: "color-mix(in srgb, var(--holive-gold) 70%, white)" },
  { id: "sun", label: "Sun", tone: 639, color: "color-mix(in srgb, var(--holive-gold-bright) 70%, white)" },
  { id: "moon", label: "Moon", tone: 741, color: "color-mix(in srgb, var(--holive-purple-bright) 72%, white)" },
];

export const DEFAULT_FREESTYLE_KIT: FreestyleKit = {
  theme: "heal",
  padCount: 6,
  tempo: 72,
  metronome: false,
  pads: DEFAULT_PADS,
};

const LAYOUTS: Record<number, { x: number; y: number }[]> = {
  4: [
    { x: 30, y: 30 },
    { x: 70, y: 30 },
    { x: 30, y: 70 },
    { x: 70, y: 70 },
  ],
  6: [
    { x: 50, y: 14 },
    { x: 82, y: 36 },
    { x: 82, y: 70 },
    { x: 50, y: 88 },
    { x: 18, y: 70 },
    { x: 18, y: 36 },
  ],
  8: [
    { x: 50, y: 10 },
    { x: 78, y: 22 },
    { x: 90, y: 50 },
    { x: 78, y: 78 },
    { x: 50, y: 90 },
    { x: 22, y: 78 },
    { x: 10, y: 50 },
    { x: 22, y: 22 },
  ],
};

export function themePadColors(theme: FreestyleTheme) {
  switch (theme) {
    case "pulse":
      return [
        "var(--holive-purple)",
        "var(--holive-gold)",
        "var(--holive-purple-bright)",
        "var(--holive-gold-bright)",
      ];
    case "gold":
      return [
        "var(--holive-gold)",
        "var(--holive-gold-bright)",
        "color-mix(in srgb, var(--holive-gold) 72%, white)",
        "color-mix(in srgb, var(--holive-gold) 58%, var(--holive-purple))",
      ];
    case "night":
      return [
        "color-mix(in srgb, var(--holive-purple) 78%, black)",
        "var(--holive-purple)",
        "color-mix(in srgb, var(--holive-purple-bright) 74%, white)",
        "color-mix(in srgb, var(--holive-gold) 44%, var(--holive-purple))",
      ];
    case "heal":
    default:
      return [
        "color-mix(in srgb, var(--holive-purple) 66%, white)",
        "color-mix(in srgb, var(--holive-gold) 80%, white)",
        "var(--holive-gold)",
        "var(--holive-purple-bright)",
      ];
  }
}

export function kitWithLayout(kit: FreestyleKit): FreestyleKit {
  const padCount = normalizePadCount(kit.padCount ?? kit.pads.length);
  const colors = themePadColors(kit.theme);
  const pads = Array.from({ length: padCount }, (_, i) => {
    const pad = kit.pads[i] ?? DEFAULT_PADS[i % DEFAULT_PADS.length]!;
    return {
      ...pad,
      id: safeText(pad.id, `pad-${i + 1}`),
      label: safeText(pad.label, `Pad ${i + 1}`),
      tone: clamp(Number(pad.tone) || DEFAULT_PADS[i % DEFAULT_PADS.length]!.tone, 80, 1200),
      color: safeText(pad.color, colors[i % colors.length]!),
    };
  });
  const layout = LAYOUTS[padCount];

  return {
    ...kit,
    padCount,
    pads: pads.map((pad, i) => ({
      ...pad,
      x: layout[i]?.x ?? 50,
      y: layout[i]?.y ?? 50,
    })),
  };
}

export function normalizeKit(value: unknown): FreestyleKit {
  const parsed = (value ?? {}) as Partial<FreestyleKit>;
  const theme = isTheme(parsed.theme) ? parsed.theme : DEFAULT_FREESTYLE_KIT.theme;
  const colors = themePadColors(theme);
  const padCount = normalizePadCount(parsed.padCount ?? parsed.pads?.length);
  const pads = Array.isArray(parsed.pads) && parsed.pads.length >= 4
    ? parsed.pads
    : DEFAULT_FREESTYLE_KIT.pads;

  return kitWithLayout({
    theme,
    padCount,
    tempo: clamp(Math.round(Number(parsed.tempo) || DEFAULT_FREESTYLE_KIT.tempo), 40, 140),
    metronome: Boolean(parsed.metronome),
    pads: pads.slice(0, padCount).map((pad, i) => ({
      id: safeText(pad.id, `pad-${i + 1}`),
      label: safeText(pad.label, `Pad ${i + 1}`),
      tone: clamp(Number(pad.tone) || DEFAULT_FREESTYLE_KIT.pads[i % DEFAULT_FREESTYLE_KIT.pads.length]!.tone, 80, 1200),
      color: safeText(pad.color, colors[i % colors.length]!),
    })),
  });
}

export function loadFreestyleKit(): FreestyleKit {
  if (typeof window === "undefined") return kitWithLayout(DEFAULT_FREESTYLE_KIT);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return normalizeKit(raw ? JSON.parse(raw) : DEFAULT_FREESTYLE_KIT);
  } catch {
    return kitWithLayout(DEFAULT_FREESTYLE_KIT);
  }
}

export function saveFreestyleKit(kit: FreestyleKit) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeKit(kit)));
  } catch {
    /* ignore quota/private mode */
  }
}

function isTheme(value: unknown): value is FreestyleTheme {
  return value === "pulse" || value === "heal" || value === "gold" || value === "night";
}

function normalizePadCount(value: unknown): FreestylePadCount {
  const n = Number(value);
  if (n <= 4) return 4;
  if (n >= 8) return 8;
  return 6;
}

function safeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 24) : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
