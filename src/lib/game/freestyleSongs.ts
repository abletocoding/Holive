import type { FreestyleHealerBed, FreestyleTheme } from "@/lib/game/freestyleKit";

const PROGRESS_KEY = "holive-neural-freestyle-progress-v1";

export type ChartJudgement = "perfect" | "good" | "miss";

export type ChartNote = {
  /** Beat index from song start (0-based). */
  beat: number;
  /** Pad index in the song kit layout. */
  pad: number;
};

export type FreestyleSong = {
  id: string;
  /** i18n key suffix under freestyle.songs.* */
  labelKey: string;
  moodKey: string;
  tempo: number;
  healerBed: FreestyleHealerBed;
  theme: FreestyleTheme;
  padCount: 4 | 6 | 8;
  /** Total beats in the chart (including trailing rest). */
  durationBeats: number;
  notes: ChartNote[];
};

export type SongResult = {
  songId: string;
  perfect: number;
  good: number;
  miss: number;
  maxStreak: number;
  score: number;
  stars: 0 | 1 | 2 | 3;
};

export type FreestylePlayProgress = {
  songsCleared: string[];
  bestStars: Record<string, number>;
  bestScore: Record<string, number>;
  unlockedThemes: FreestyleTheme[];
  unlockedDances: string[];
  songClears: number;
};

const DEFAULT_PROGRESS: FreestylePlayProgress = {
  songsCleared: [],
  bestStars: {},
  bestScore: {},
  unlockedThemes: ["heal"],
  unlockedDances: ["pulse"],
  songClears: 0,
};

/** Original generative healer charts — no copyrighted music. */
export const FREESTYLE_SONGS: FreestyleSong[] = [
  {
    id: "crystal-drive",
    labelKey: "crystalDrive",
    moodKey: "crystalDriveMood",
    tempo: 96,
    healerBed: "crystal",
    theme: "pulse",
    padCount: 4,
    durationBeats: 32,
    notes: buildPulsePattern([0, 1, 2, 3], 32, {
      kick: [0, 4, 8, 12, 16, 20, 24, 28],
      snare: [2, 6, 10, 14, 18, 22, 26, 30],
      spark: [1, 5, 9, 13, 17, 21, 25, 29],
      lift: [3, 7, 11, 15, 19, 23, 27, 31],
    }),
  },
  {
    id: "forest-pulse",
    labelKey: "forestPulse",
    moodKey: "forestPulseMood",
    tempo: 78,
    healerBed: "forest",
    theme: "heal",
    padCount: 6,
    durationBeats: 32,
    notes: buildForestPattern(32),
  },
  {
    id: "golden-heart",
    labelKey: "goldenHeart",
    moodKey: "goldenHeartMood",
    tempo: 88,
    healerBed: "golden",
    theme: "gold",
    padCount: 4,
    durationBeats: 28,
    notes: buildHeartPattern(28),
  },
  {
    id: "deep-heal-ritual",
    labelKey: "deepHealRitual",
    moodKey: "deepHealRitualMood",
    tempo: 66,
    healerBed: "deepheal",
    theme: "night",
    padCount: 6,
    durationBeats: 36,
    notes: buildRitualPattern(36),
  },
  {
    id: "aurora-spiral",
    labelKey: "auroraSpiral",
    moodKey: "auroraSpiralMood",
    tempo: 104,
    healerBed: "crystal",
    theme: "pulse",
    padCount: 8,
    durationBeats: 32,
    notes: buildSpiralPattern(32, 8),
  },
  {
    id: "sunroot-groove",
    labelKey: "sunrootGroove",
    moodKey: "sunrootGrooveMood",
    tempo: 92,
    healerBed: "heal",
    theme: "gold",
    padCount: 6,
    durationBeats: 32,
    notes: buildGroovePattern(32),
  },
];

export function getSong(id: string): FreestyleSong | undefined {
  return FREESTYLE_SONGS.find((song) => song.id === id);
}

export function dailySongId(date = new Date()): string {
  const key = date.toISOString().slice(0, 10);
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return FREESTYLE_SONGS[hash % FREESTYLE_SONGS.length]!.id;
}

export function beatMs(tempo: number): number {
  return Math.max(220, Math.round(60000 / tempo));
}

export function judgeHit(
  expectedMs: number,
  hitMs: number,
): ChartJudgement {
  const delta = Math.abs(hitMs - expectedMs);
  if (delta <= 90) return "perfect";
  if (delta <= 170) return "good";
  return "miss";
}

export function scoreSong(params: {
  songId: string;
  perfect: number;
  good: number;
  miss: number;
  maxStreak: number;
  totalNotes: number;
}): SongResult {
  const { songId, perfect, good, miss, maxStreak, totalNotes } = params;
  const score = perfect * 100 + good * 60 + Math.max(0, maxStreak) * 8;
  const hitRate = totalNotes > 0 ? (perfect + good) / totalNotes : 0;
  let stars: 0 | 1 | 2 | 3 = 0;
  if (hitRate >= 0.92 && miss <= Math.max(1, totalNotes * 0.05)) stars = 3;
  else if (hitRate >= 0.75) stars = 2;
  else if (hitRate >= 0.5) stars = 1;
  return { songId, perfect, good, miss, maxStreak, score, stars };
}

export function loadFreestyleProgress(): FreestylePlayProgress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<FreestylePlayProgress>;
    return {
      songsCleared: Array.isArray(parsed.songsCleared)
        ? parsed.songsCleared.filter((id) => typeof id === "string")
        : [],
      bestStars:
        parsed.bestStars && typeof parsed.bestStars === "object"
          ? parsed.bestStars
          : {},
      bestScore:
        parsed.bestScore && typeof parsed.bestScore === "object"
          ? parsed.bestScore
          : {},
      unlockedThemes: Array.isArray(parsed.unlockedThemes)
        ? (parsed.unlockedThemes.filter(isTheme) as FreestyleTheme[])
        : ["heal"],
      unlockedDances: Array.isArray(parsed.unlockedDances)
        ? parsed.unlockedDances.filter((d) => typeof d === "string")
        : ["pulse"],
      songClears: Math.max(0, Number(parsed.songClears) || 0),
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveFreestyleProgress(progress: FreestylePlayProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export function applySongResult(
  progress: FreestylePlayProgress,
  result: SongResult,
): FreestylePlayProgress {
  const bestStars = {
    ...progress.bestStars,
    [result.songId]: Math.max(progress.bestStars[result.songId] ?? 0, result.stars),
  };
  const bestScore = {
    ...progress.bestScore,
    [result.songId]: Math.max(progress.bestScore[result.songId] ?? 0, result.score),
  };
  const songsCleared =
    result.stars >= 1 && !progress.songsCleared.includes(result.songId)
      ? [...progress.songsCleared, result.songId]
      : progress.songsCleared;
  const songClears = progress.songClears + (result.stars >= 1 ? 1 : 0);
  const unlockedThemes = new Set<FreestyleTheme>(progress.unlockedThemes);
  const unlockedDances = new Set(progress.unlockedDances);
  if (songsCleared.includes("crystal-drive")) unlockedThemes.add("pulse");
  if (songsCleared.includes("golden-heart")) unlockedThemes.add("gold");
  if (songsCleared.includes("deep-heal-ritual")) unlockedThemes.add("night");
  if (songsCleared.includes("forest-pulse")) unlockedDances.add("sway");
  if (songsCleared.includes("aurora-spiral")) unlockedDances.add("spiral");
  if (songClears >= 3) unlockedDances.add("celebrate");
  if (result.stars === 3) unlockedDances.add("glow");
  return {
    songsCleared,
    bestStars,
    bestScore,
    unlockedThemes: [...unlockedThemes],
    unlockedDances: [...unlockedDances],
    songClears,
  };
}

function isTheme(value: unknown): value is FreestyleTheme {
  return (
    value === "pulse" ||
    value === "heal" ||
    value === "gold" ||
    value === "night"
  );
}

function note(beat: number, pad: number): ChartNote {
  return { beat, pad };
}

function buildPulsePattern(
  pads: number[],
  beats: number,
  lanes: Record<string, number[]>,
): ChartNote[] {
  const map = [pads[0]!, pads[1]!, pads[2]!, pads[3]!];
  const keys = Object.keys(lanes);
  const out: ChartNote[] = [];
  keys.forEach((key, i) => {
    for (const beat of lanes[key]!) {
      if (beat < beats) out.push(note(beat, map[i % map.length]!));
    }
  });
  return out.sort((a, b) => a.beat - b.beat || a.pad - b.pad);
}

function buildForestPattern(beats: number): ChartNote[] {
  const out: ChartNote[] = [];
  for (let b = 0; b < beats; b++) {
    if (b % 4 === 0) out.push(note(b, 0));
    if (b % 4 === 2) out.push(note(b, 1));
    if (b % 8 === 3) out.push(note(b, 2));
    if (b % 8 === 6) out.push(note(b, 3));
    if (b % 16 === 7) out.push(note(b, 4));
    if (b % 16 === 15) out.push(note(b, 5));
  }
  return out;
}

function buildHeartPattern(beats: number): ChartNote[] {
  const hits = [0, 3, 4, 6, 8, 11, 12, 14, 16, 19, 20, 22, 24, 26];
  return hits
    .filter((b) => b < beats)
    .map((b, i) => note(b, i % 2 === 0 ? 0 : 2));
}

function buildRitualPattern(beats: number): ChartNote[] {
  const out: ChartNote[] = [];
  for (let b = 0; b < beats; b++) {
    if (b % 6 === 0) out.push(note(b, 0));
    if (b % 6 === 3) out.push(note(b, 1));
    if (b % 12 === 5) out.push(note(b, 2));
    if (b % 12 === 8) out.push(note(b, 4));
    if (b % 18 === 9) out.push(note(b, 3));
    if (b % 18 === 15) out.push(note(b, 5));
  }
  return out;
}

function buildSpiralPattern(beats: number, padCount: number): ChartNote[] {
  const out: ChartNote[] = [];
  for (let b = 0; b < beats; b++) {
    out.push(note(b, b % padCount));
    if (b % 4 === 0) out.push(note(b, (b + 3) % padCount));
  }
  return out.sort((a, b) => a.beat - b.beat || a.pad - b.pad);
}

function buildGroovePattern(beats: number): ChartNote[] {
  const out: ChartNote[] = [];
  for (let b = 0; b < beats; b++) {
    if (b % 2 === 0) out.push(note(b, 0));
    if (b % 4 === 1) out.push(note(b, 2));
    if (b % 4 === 3) out.push(note(b, 1));
    if (b % 8 === 5) out.push(note(b, 3));
    if (b % 8 === 7) out.push(note(b, 4));
    if (b % 16 === 10) out.push(note(b, 5));
  }
  return out;
}
