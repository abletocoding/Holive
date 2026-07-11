/**
 * Neural Pulse level design — rising difficulty across 8 depths.
 * Each level grows a sequence from startLen to clearLen; clear unlocks next.
 */

export type AudioBedId =
  | "seed"
  | "sprout"
  | "root"
  | "stem"
  | "mesh"
  | "orbit"
  | "deep"
  | "master"
  | "heal"
  | "crystal"
  | "forest"
  | "deepheal"
  | "golden";

export type LevelDef = {
  id: number;
  key: string;
  nodes: number;
  startLen: number;
  clearLen: number;
  flashMs: number;
  gapMs: number;
  drift: boolean;
  orbit: boolean;
  distractors: boolean;
  moving: boolean;
  pulseRings: boolean;
  trails: boolean;
  audioBed: AudioBedId;
  scoreMult: number;
};

export const LEVELS: LevelDef[] = [
  { id: 1, key: "seed", nodes: 4, startLen: 3, clearLen: 4, flashMs: 480, gapMs: 180, drift: false, orbit: false, distractors: false, moving: false, pulseRings: true, trails: false, audioBed: "seed", scoreMult: 1 },
  { id: 2, key: "sprout", nodes: 4, startLen: 4, clearLen: 5, flashMs: 420, gapMs: 150, drift: false, orbit: false, distractors: false, moving: false, pulseRings: true, trails: true, audioBed: "sprout", scoreMult: 1.1 },
  { id: 3, key: "root", nodes: 4, startLen: 4, clearLen: 6, flashMs: 380, gapMs: 130, drift: true, orbit: false, distractors: false, moving: false, pulseRings: true, trails: true, audioBed: "root", scoreMult: 1.25 },
  { id: 4, key: "stem", nodes: 5, startLen: 5, clearLen: 7, flashMs: 340, gapMs: 110, drift: true, orbit: false, distractors: false, moving: false, pulseRings: true, trails: true, audioBed: "stem", scoreMult: 1.4 },
  { id: 5, key: "mesh", nodes: 5, startLen: 5, clearLen: 8, flashMs: 300, gapMs: 95, drift: true, orbit: false, distractors: true, moving: false, pulseRings: true, trails: true, audioBed: "mesh", scoreMult: 1.6 },
  { id: 6, key: "orbit", nodes: 6, startLen: 6, clearLen: 8, flashMs: 280, gapMs: 85, drift: false, orbit: true, distractors: false, moving: true, pulseRings: true, trails: true, audioBed: "orbit", scoreMult: 1.85 },
  { id: 7, key: "constellation", nodes: 6, startLen: 6, clearLen: 9, flashMs: 250, gapMs: 75, drift: false, orbit: true, distractors: true, moving: true, pulseRings: true, trails: true, audioBed: "deep", scoreMult: 2.1 },
  { id: 8, key: "master", nodes: 6, startLen: 7, clearLen: 10, flashMs: 220, gapMs: 60, drift: false, orbit: true, distractors: true, moving: true, pulseRings: true, trails: true, audioBed: "master", scoreMult: 2.5 },
];

export const FINAL_LEVEL_ID = LEVELS[LEVELS.length - 1]!.id;

export function getLevel(id: number): LevelDef {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0]!;
}

export const NODE_COLORS = [
  "var(--holive-purple)",
  "var(--holive-gold)",
  "var(--holive-purple-bright)",
  "var(--holive-gold-bright)",
  "color-mix(in srgb, var(--holive-purple) 70%, white)",
  "color-mix(in srgb, var(--holive-gold) 65%, white)",
] as const;

export function randomNode(count: number) {
  return Math.floor(Math.random() * count);
}
