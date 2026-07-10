import type { Reward } from "./rewards";

const STORAGE_KEY = "holive-neural-pulse-v2";
const LEGACY_HIGHSCORE = "holive-neural-highscore";

export type PulseProgress = {
  unlockedLevel: number;
  highScore: number;
  levelBest: Record<string, number>;
  rewards: Reward[];
  completedRun: boolean;
  /** Soft gate: show lead form after this */
  deepProgress: boolean;
};

const DEFAULT: PulseProgress = {
  unlockedLevel: 1,
  highScore: 0,
  levelBest: {},
  rewards: [],
  completedRun: false,
  deepProgress: false,
};

function migrateLegacyHighScore(): number {
  try {
    return Number(localStorage.getItem(LEGACY_HIGHSCORE) || 0) || 0;
  } catch {
    return 0;
  }
}

export function loadProgress(): PulseProgress {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = migrateLegacyHighScore();
      return { ...DEFAULT, highScore: legacy };
    }
    const parsed = JSON.parse(raw) as Partial<PulseProgress>;
    return {
      unlockedLevel: Math.max(1, Number(parsed.unlockedLevel) || 1),
      highScore: Math.max(
        Number(parsed.highScore) || 0,
        migrateLegacyHighScore(),
      ),
      levelBest: parsed.levelBest ?? {},
      rewards: Array.isArray(parsed.rewards) ? parsed.rewards : [],
      completedRun: Boolean(parsed.completedRun),
      deepProgress: Boolean(parsed.deepProgress),
    };
  } catch {
    return { ...DEFAULT, highScore: migrateLegacyHighScore() };
  }
}

export function saveProgress(p: PulseProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    localStorage.setItem(LEGACY_HIGHSCORE, String(p.highScore));
  } catch {
    /* ignore quota */
  }
}

export function unlockLevel(p: PulseProgress, levelId: number): PulseProgress {
  const next = {
    ...p,
    unlockedLevel: Math.max(p.unlockedLevel, levelId),
    deepProgress: p.deepProgress || levelId >= 4,
  };
  saveProgress(next);
  return next;
}

export function recordScore(
  p: PulseProgress,
  levelId: number,
  score: number,
): PulseProgress {
  const key = String(levelId);
  const prev = p.levelBest[key] ?? 0;
  const next: PulseProgress = {
    ...p,
    highScore: Math.max(p.highScore, score),
    levelBest: {
      ...p.levelBest,
      [key]: Math.max(prev, score),
    },
    deepProgress: p.deepProgress || levelId >= 4 || score >= 120,
  };
  saveProgress(next);
  return next;
}

export function addReward(p: PulseProgress, reward: Reward): PulseProgress {
  if (p.rewards.some((r) => r.code === reward.code)) return p;
  const next = {
    ...p,
    rewards: [...p.rewards, reward].slice(-12),
  };
  saveProgress(next);
  return next;
}

export function markRunComplete(p: PulseProgress): PulseProgress {
  const next = {
    ...p,
    completedRun: true,
    deepProgress: true,
    unlockedLevel: Math.max(p.unlockedLevel, 8),
  };
  saveProgress(next);
  return next;
}
