/**
 * Earned rewards after deep progress / full run.
 */

export type RewardKind = "code" | "badge" | "mantra" | "certificate";

export type Reward = {
  id: string;
  kind: RewardKind;
  code: string;
  key: string;
  unlockedAt: number;
  score: number;
  level: number;
};

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function hashSeed(score: number, level: number, ts: number) {
  let h = (score * 7919 + level * 104729 + ts) >>> 0;
  return () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h;
  };
}

function codeFrom(rand: () => number, prefix: string, len = 4) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHA[rand() % ALPHA.length];
  }
  return prefix + "-" + out;
}

export function mintReward(opts: {
  level: number;
  score: number;
  clearedAll?: boolean;
}): Reward | null {
  const { level, score, clearedAll } = opts;
  const ts = Date.now();
  const rand = hashSeed(score, level, ts);

  if (clearedAll || level >= 8) {
    return {
      id: "cert-" + ts,
      kind: "certificate",
      code: codeFrom(rand, "HOLIVE-PULSE", 6),
      key: "certificate",
      unlockedAt: ts,
      score,
      level,
    };
  }

  if (level >= 6) {
    return {
      id: "mantra-" + ts,
      kind: "mantra",
      code: codeFrom(rand, "MANTRA", 5),
      key: "mantraCard",
      unlockedAt: ts,
      score,
      level,
    };
  }

  if (level >= 4) {
    return {
      id: "badge-" + ts,
      kind: "badge",
      code: codeFrom(rand, "BADGE", 4),
      key: "badge",
      unlockedAt: ts,
      score,
      level,
    };
  }

  if (level >= 2 && score >= 80) {
    return {
      id: "code-" + ts,
      kind: "code",
      code: codeFrom(rand, "SYNC", 4),
      key: "unlockCode",
      unlockedAt: ts,
      score,
      level,
    };
  }

  return null;
}

export function shareableCertificate(opts: {
  code: string;
  score: number;
  level: number;
  locale: string;
}) {
  if (opts.locale.startsWith("en")) {
    return [
      "HOLIVE - Neural Pulse Certificate",
      "Code: " + opts.code,
      "Depth cleared: " + opts.level + " · Score: " + opts.score,
      "Synced signal. Planted process. Ready to harvest.",
      "holive.org",
    ].join("\n");
  }
  return [
    "HOLIVE - Certificado de Pulso Neural",
    "Codigo: " + opts.code,
    "Profundidad: " + opts.level + " · Puntos: " + opts.score,
    "Senal sincronizada. Proceso sembrado. Listo para cosechar.",
    "holive.org",
  ].join("\n");
}
