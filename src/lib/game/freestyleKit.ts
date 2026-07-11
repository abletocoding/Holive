const STORAGE_KEY = "holive-neural-freestyle-kit-v2";

export type FreestyleTheme = "pulse" | "heal" | "gold" | "night";
export type FreestylePadCount = 4 | 6 | 8;
export type FreestyleHealerBed =
  | "crystal"
  | "forest"
  | "deepheal"
  | "golden"
  | "heal";
export type FreestyleStepCount = 8 | 16;
export type FreestyleSessionPhase = "idle" | "warm" | "flow" | "cool";
export type FreestyleMood = "calm" | "open" | "bright" | "grounded" | "flowing";

export type FreestylePad = {
  id: string;
  label: string;
  tone: number;
  color: string;
  x?: number;
  y?: number;
};

export type FreestylePattern = {
  steps: FreestyleStepCount;
  /** tracks[padIndex][step] = active */
  tracks: boolean[][];
};

export type FreestyleKit = {
  theme: FreestyleTheme;
  padCount: FreestylePadCount;
  tempo: number;
  metronome: boolean;
  healerBed: FreestyleHealerBed;
  harmonicMode: boolean;
  breathGate: boolean;
  seqSteps: FreestyleStepCount;
  pattern: FreestylePattern;
  pads: FreestylePad[];
  lastMood?: FreestyleMood;
  jamStreak: number;
};

export const HEALER_BEDS: FreestyleHealerBed[] = [
  "crystal",
  "forest",
  "deepheal",
  "golden",
  "heal",
];

export const HEALER_BED_META: Record<
  FreestyleHealerBed,
  { labelKey: string; intent: string }
> = {
  crystal: { labelKey: "crystal", intent: "crystal bowl field" },
  forest: { labelKey: "forest", intent: "forest breath" },
  deepheal: { labelKey: "deepheal", intent: "deep heal drone" },
  golden: { labelKey: "golden", intent: "golden pulse" },
  heal: { labelKey: "heal", intent: "classic heal bed" },
};

/** Pentatonic-ish healing scale degrees (Hz) mapped onto pad slots. */
const HARMONIC_SCALE = [174, 196, 220, 261.63, 293.66, 329.63, 392, 440];

const DEFAULT_PADS: FreestylePad[] = [
  { id: "root", label: "Root", tone: 147, color: "var(--holive-purple)" },
  { id: "seed", label: "Seed", tone: 196, color: "var(--holive-gold)" },
  { id: "stem", label: "Stem", tone: 246.94, color: "var(--holive-purple-bright)" },
  { id: "aura", label: "Aura", tone: 329.63, color: "var(--holive-gold-bright)" },
  {
    id: "mesh",
    label: "Mesh",
    tone: 392,
    color: "color-mix(in srgb, var(--holive-purple) 70%, white)",
  },
  {
    id: "heal",
    label: "Heal",
    tone: 528,
    color: "color-mix(in srgb, var(--holive-gold) 70%, white)",
  },
  {
    id: "sun",
    label: "Sun",
    tone: 659,
    color: "color-mix(in srgb, var(--holive-gold-bright) 70%, white)",
  },
  {
    id: "moon",
    label: "Moon",
    tone: 741,
    color: "color-mix(in srgb, var(--holive-purple-bright) 70%, white)",
  },
];

export const DEFAULT_FREESTYLE_KIT: FreestyleKit = {
  theme: "heal",
  padCount: 6,
  tempo: 72,
  metronome: false,
  healerBed: "crystal",
  harmonicMode: false,
  breathGate: false,
  seqSteps: 8,
  pattern: emptyPattern(8, 6),
  pads: DEFAULT_PADS,
  jamStreak: 0,
};

/**
 * Layout percentages are inset (18–82) so circular pads never clip
 * the board edges across phone widths.
 */
const LAYOUTS: Record<number, { x: number; y: number }[]> = {
  4: [
    { x: 28, y: 28 },
    { x: 72, y: 28 },
    { x: 28, y: 72 },
    { x: 72, y: 72 },
  ],
  6: [
    { x: 50, y: 20 },
    { x: 78, y: 38 },
    { x: 78, y: 68 },
    { x: 50, y: 82 },
    { x: 22, y: 68 },
    { x: 22, y: 38 },
  ],
  8: [
    { x: 50, y: 18 },
    { x: 74, y: 28 },
    { x: 82, y: 50 },
    { x: 74, y: 72 },
    { x: 50, y: 82 },
    { x: 26, y: 72 },
    { x: 18, y: 50 },
    { x: 26, y: 28 },
  ],
};

export const PATTERN_PRESETS: {
  id: string;
  labelKey: string;
  steps: FreestyleStepCount;
  build: (padCount: number) => boolean[][];
}[] = [
  {
    id: "pulse4",
    labelKey: "presetPulse",
    steps: 8,
    build: (n) => {
      const t = emptyTracks(8, n);
      for (let s = 0; s < 8; s += 2) t[0]![s] = true;
      if (n > 2) for (let s = 1; s < 8; s += 2) t[2]![s] = true;
      return t;
    },
  },
  {
    id: "breath",
    labelKey: "presetBreath",
    steps: 8,
    build: (n) => {
      const t = emptyTracks(8, n);
      t[0]![0] = true;
      t[0]![4] = true;
      if (n > 1) {
        t[1]![2] = true;
        t[1]![6] = true;
      }
      if (n > 3) t[3]![4] = true;
      return t;
    },
  },
  {
    id: "spiral",
    labelKey: "presetSpiral",
    steps: 16,
    build: (n) => {
      const t = emptyTracks(16, n);
      for (let s = 0; s < 16; s++) {
        const track = s % Math.max(1, Math.min(n, 6));
        t[track]![s] = true;
        if (s % 4 === 0 && n > 1) t[0]![s] = true;
      }
      return t;
    },
  },
  {
    id: "heart",
    labelKey: "presetHeart",
    steps: 8,
    build: (n) => {
      const t = emptyTracks(8, n);
      const hits = [0, 3, 4, 6];
      for (const s of hits) t[0]![s] = true;
      if (n > 2) {
        t[2]![2] = true;
        t[2]![6] = true;
      }
      return t;
    },
  },
];

export function emptyTracks(steps: number, padCount: number): boolean[][] {
  return Array.from({ length: padCount }, () =>
    Array.from({ length: steps }, () => false),
  );
}

export function emptyPattern(
  steps: FreestyleStepCount,
  padCount: number,
): FreestylePattern {
  return { steps, tracks: emptyTracks(steps, padCount) };
}

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
        "color-mix(in srgb, var(--holive-gold) 70%, white)",
        "color-mix(in srgb, var(--holive-gold) 50%, var(--holive-purple))",
      ];
    case "night":
      return [
        "color-mix(in srgb, var(--holive-purple) 70%, black)",
        "var(--holive-purple)",
        "color-mix(in srgb, var(--holive-purple-bright) 70%, white)",
        "color-mix(in srgb, var(--holive-gold) 40%, var(--holive-purple))",
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
    const tone = kit.harmonicMode
      ? HARMONIC_SCALE[i % HARMONIC_SCALE.length]!
      : clamp(Number(pad.tone) || DEFAULT_PADS[i % DEFAULT_PADS.length]!.tone, 80, 1200);
    return {
      ...pad,
      id: safeText(pad.id, `pad-${i + 1}`),
      label: safeText(pad.label, `Pad ${i + 1}`),
      tone,
      color: safeText(pad.color, colors[i % colors.length]!),
    };
  });
  const layout = LAYOUTS[padCount]!;
  const steps = normalizeSteps(kit.seqSteps ?? kit.pattern?.steps ?? 8);
  const pattern = normalizePattern(kit.pattern, steps, padCount);

  return {
    ...kit,
    padCount,
    seqSteps: steps,
    healerBed: isHealerBed(kit.healerBed) ? kit.healerBed : "crystal",
    harmonicMode: Boolean(kit.harmonicMode),
    breathGate: Boolean(kit.breathGate),
    jamStreak: clamp(Math.round(Number(kit.jamStreak) || 0), 0, 9999),
    pattern,
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
  const padCount = normalizePadCount(
    parsed.padCount ?? parsed.pads?.length,
  );
  const pads =
    Array.isArray(parsed.pads) && parsed.pads.length >= 4
      ? parsed.pads
      : DEFAULT_FREESTYLE_KIT.pads;
  const steps = normalizeSteps(parsed.seqSteps ?? parsed.pattern?.steps);

  return kitWithLayout({
    theme,
    padCount,
    tempo: clamp(
      Math.round(Number(parsed.tempo) || DEFAULT_FREESTYLE_KIT.tempo),
      40,
      140,
    ),
    metronome: Boolean(parsed.metronome),
    healerBed: isHealerBed(parsed.healerBed)
      ? parsed.healerBed
      : DEFAULT_FREESTYLE_KIT.healerBed,
    harmonicMode: Boolean(parsed.harmonicMode),
    breathGate: Boolean(parsed.breathGate),
    seqSteps: steps,
    pattern: normalizePattern(parsed.pattern, steps, padCount),
    lastMood: isMood(parsed.lastMood) ? parsed.lastMood : undefined,
    jamStreak: clamp(Math.round(Number(parsed.jamStreak) || 0), 0, 9999),
    pads: pads.slice(0, padCount).map((pad, i) => ({
      id: safeText(pad.id, `pad-${i + 1}`),
      label: safeText(pad.label, `Pad ${i + 1}`),
      tone: clamp(
        Number(pad.tone) ||
          DEFAULT_FREESTYLE_KIT.pads[i % DEFAULT_FREESTYLE_KIT.pads.length]!
            .tone,
        80,
        1200,
      ),
      color: safeText(pad.color, colors[i % colors.length]!),
    })),
  });
}

export function loadFreestyleKit(): FreestyleKit {
  if (typeof window === "undefined") return kitWithLayout(DEFAULT_FREESTYLE_KIT);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // migrate v1
      const legacy = localStorage.getItem("holive-neural-freestyle-kit-v1");
      return normalizeKit(legacy ? JSON.parse(legacy) : DEFAULT_FREESTYLE_KIT);
    }
    return normalizeKit(JSON.parse(raw));
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

export function applyPatternPreset(
  kit: FreestyleKit,
  presetId: string,
): FreestyleKit {
  const preset = PATTERN_PRESETS.find((p) => p.id === presetId);
  if (!preset) return kit;
  const padCount = kit.padCount;
  return kitWithLayout({
    ...kit,
    seqSteps: preset.steps,
    pattern: {
      steps: preset.steps,
      tracks: preset.build(padCount),
    },
  });
}

/**
 * Max pad diameter (px) so every pad stays fully inside the board.
 * Centers use % of board; diameter must leave margin on all sides.
 */
export function fitPadDiameterPx(
  boardW: number,
  boardH: number,
  pads: { x?: number; y?: number }[],
  preferredRatio: number,
): number {
  if (boardW <= 0 || boardH <= 0 || pads.length === 0) return 48;
  const preferred = Math.min(boardW, boardH) * preferredRatio;
  let max = preferred;
  for (const pad of pads) {
    const x = ((pad.x ?? 50) / 100) * boardW;
    const y = ((pad.y ?? 50) / 100) * boardH;
    const room = 2 * Math.min(x, boardW - x, y, boardH - y) - 4;
    max = Math.min(max, room);
  }
  return clamp(max, 36, Math.min(boardW, boardH) * 0.42);
}

function normalizePattern(
  pattern: FreestylePattern | undefined,
  steps: FreestyleStepCount,
  padCount: number,
): FreestylePattern {
  const src = pattern?.tracks;
  const tracks = emptyTracks(steps, padCount);
  if (Array.isArray(src)) {
    for (let t = 0; t < padCount; t++) {
      const row = src[t];
      if (!Array.isArray(row)) continue;
      for (let s = 0; s < steps; s++) {
        tracks[t]![s] = Boolean(row[s]);
      }
    }
  }
  return { steps, tracks };
}

function isTheme(value: unknown): value is FreestyleTheme {
  return (
    value === "pulse" ||
    value === "heal" ||
    value === "gold" ||
    value === "night"
  );
}

function isHealerBed(value: unknown): value is FreestyleHealerBed {
  return (
    value === "crystal" ||
    value === "forest" ||
    value === "deepheal" ||
    value === "golden" ||
    value === "heal"
  );
}

function isMood(value: unknown): value is FreestyleMood {
  return (
    value === "calm" ||
    value === "open" ||
    value === "bright" ||
    value === "grounded" ||
    value === "flowing"
  );
}

function normalizePadCount(value: unknown): FreestylePadCount {
  const n = Number(value);
  if (n <= 4) return 4;
  if (n >= 8) return 8;
  return 6;
}

function normalizeSteps(value: unknown): FreestyleStepCount {
  return Number(value) >= 16 ? 16 : 8;
}

function safeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, 24)
    : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
