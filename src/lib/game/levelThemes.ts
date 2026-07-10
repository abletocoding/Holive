/**
 * Per-depth visual beds - gradients, motifs, particle density, color temp.
 * Stays within Holive purple / gold / black.
 */

export type LevelMotif =
  | "seed"
  | "sprout"
  | "root"
  | "stem"
  | "mesh"
  | "orbit"
  | "constellation"
  | "master";

export type LevelTheme = {
  id: number;
  motif: LevelMotif;
  gradient: string;
  softGradient: string;
  waveA: string;
  waveB: string;
  gridColor: string;
  gridOpacity: number;
  codeOpacity: number;
  particleDensity: number;
  goldBias: number;
  temp: "cool" | "warm" | "neutral" | "hot";
  vignette: string;
};

export const LEVEL_THEMES: Record<number, LevelTheme> = {
  1: {
    id: 1,
    motif: "seed",
    gradient:
      "radial-gradient(ellipse at 28% 18%, rgba(120,70,180,0.38), transparent 52%), radial-gradient(ellipse at 72% 78%, rgba(201,168,76,0.1), transparent 48%), radial-gradient(ellipse at 50% 100%, rgba(40,20,70,0.4), transparent 42%), #06040c",
    softGradient:
      "radial-gradient(ellipse at 30% 20%, rgba(90,42,158,0.32), transparent 50%), radial-gradient(ellipse at 75% 80%, rgba(201,168,76,0.1), transparent 45%), #07060a",
    waveA: "rgba(140,90,210,0.32)",
    waveB: "rgba(201,168,76,0.14)",
    gridColor: "rgba(155,109,255,0.1)",
    gridOpacity: 0.08,
    codeOpacity: 0.04,
    particleDensity: 0.45,
    goldBias: 0.25,
    temp: "cool",
    vignette: "rgba(8,4,16,0.55)",
  },
  2: {
    id: 2,
    motif: "sprout",
    gradient:
      "radial-gradient(ellipse at 40% 12%, rgba(155,109,255,0.42), transparent 50%), radial-gradient(ellipse at 18% 70%, rgba(90,42,158,0.35), transparent 45%), radial-gradient(ellipse at 85% 55%, rgba(201,168,76,0.16), transparent 40%), #070510",
    softGradient:
      "radial-gradient(ellipse at 35% 18%, rgba(120,70,180,0.35), transparent 50%), radial-gradient(ellipse at 80% 75%, rgba(201,168,76,0.12), transparent 45%), #07060a",
    waveA: "rgba(155,109,255,0.38)",
    waveB: "rgba(201,168,76,0.2)",
    gridColor: "rgba(0,255,65,0.08)",
    gridOpacity: 0.1,
    codeOpacity: 0.06,
    particleDensity: 0.55,
    goldBias: 0.35,
    temp: "neutral",
    vignette: "rgba(6,4,14,0.5)",
  },
  3: {
    id: 3,
    motif: "root",
    gradient:
      "radial-gradient(ellipse at 50% 85%, rgba(70,30,120,0.55), transparent 50%), radial-gradient(ellipse at 20% 25%, rgba(90,42,158,0.28), transparent 48%), radial-gradient(ellipse at 78% 40%, rgba(160,120,50,0.12), transparent 42%), #04020a",
    softGradient:
      "radial-gradient(ellipse at 50% 80%, rgba(70,30,120,0.4), transparent 50%), radial-gradient(ellipse at 30% 20%, rgba(90,42,158,0.28), transparent 45%), #06040c",
    waveA: "rgba(90,42,158,0.4)",
    waveB: "rgba(120,80,40,0.18)",
    gridColor: "rgba(90,42,158,0.14)",
    gridOpacity: 0.11,
    codeOpacity: 0.05,
    particleDensity: 0.5,
    goldBias: 0.2,
    temp: "cool",
    vignette: "rgba(4,2,10,0.65)",
  },
  4: {
    id: 4,
    motif: "stem",
    gradient:
      "radial-gradient(ellipse at 50% 0%, rgba(155,109,255,0.35), transparent 45%), linear-gradient(180deg, rgba(20,10,40,0.2) 0%, transparent 40%, rgba(51,0,114,0.35) 100%), radial-gradient(ellipse at 60% 70%, rgba(201,168,76,0.14), transparent 45%), #05030c",
    softGradient:
      "radial-gradient(ellipse at 50% 10%, rgba(120,70,180,0.32), transparent 48%), radial-gradient(ellipse at 55% 80%, rgba(201,168,76,0.1), transparent 45%), #07060a",
    waveA: "rgba(130,80,200,0.3)",
    waveB: "rgba(201,168,76,0.22)",
    gridColor: "rgba(201,168,76,0.08)",
    gridOpacity: 0.09,
    codeOpacity: 0.055,
    particleDensity: 0.6,
    goldBias: 0.4,
    temp: "warm",
    vignette: "rgba(6,3,12,0.55)",
  },
  5: {
    id: 5,
    motif: "mesh",
    gradient:
      "radial-gradient(ellipse at 15% 20%, rgba(155,109,255,0.4), transparent 42%), radial-gradient(ellipse at 85% 25%, rgba(90,42,158,0.38), transparent 42%), radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.18), transparent 48%), #05020e",
    softGradient:
      "radial-gradient(ellipse at 20% 25%, rgba(120,70,180,0.35), transparent 48%), radial-gradient(ellipse at 80% 70%, rgba(201,168,76,0.12), transparent 45%), #07060a",
    waveA: "rgba(155,109,255,0.42)",
    waveB: "rgba(90,42,158,0.28)",
    gridColor: "rgba(0,255,65,0.12)",
    gridOpacity: 0.14,
    codeOpacity: 0.09,
    particleDensity: 0.75,
    goldBias: 0.3,
    temp: "neutral",
    vignette: "rgba(5,2,14,0.5)",
  },
  6: {
    id: 6,
    motif: "orbit",
    gradient:
      "radial-gradient(circle at 50% 48%, rgba(201,168,76,0.16), transparent 28%), radial-gradient(ellipse at 50% 50%, rgba(90,42,158,0.45), transparent 58%), radial-gradient(ellipse at 10% 10%, rgba(155,109,255,0.25), transparent 40%), #04030c",
    softGradient:
      "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.12), transparent 30%), radial-gradient(ellipse at 50% 50%, rgba(90,42,158,0.35), transparent 55%), #07060a",
    waveA: "rgba(201,168,76,0.28)",
    waveB: "rgba(155,109,255,0.3)",
    gridColor: "rgba(201,168,76,0.1)",
    gridOpacity: 0.1,
    codeOpacity: 0.05,
    particleDensity: 0.7,
    goldBias: 0.55,
    temp: "warm",
    vignette: "rgba(4,3,12,0.58)",
  },
  7: {
    id: 7,
    motif: "constellation",
    gradient:
      "radial-gradient(ellipse at 30% 30%, rgba(60,20,110,0.5), transparent 45%), radial-gradient(ellipse at 70% 20%, rgba(155,109,255,0.28), transparent 40%), radial-gradient(ellipse at 55% 85%, rgba(201,168,76,0.14), transparent 45%), #020108",
    softGradient:
      "radial-gradient(ellipse at 35% 30%, rgba(60,20,110,0.4), transparent 48%), radial-gradient(ellipse at 70% 75%, rgba(201,168,76,0.1), transparent 45%), #05030a",
    waveA: "rgba(80,40,150,0.45)",
    waveB: "rgba(201,168,76,0.16)",
    gridColor: "rgba(155,109,255,0.08)",
    gridOpacity: 0.07,
    codeOpacity: 0.1,
    particleDensity: 0.85,
    goldBias: 0.45,
    temp: "cool",
    vignette: "rgba(2,1,8,0.7)",
  },
  8: {
    id: 8,
    motif: "master",
    gradient:
      "radial-gradient(ellipse at 50% 35%, rgba(201,168,76,0.28), transparent 38%), radial-gradient(ellipse at 20% 70%, rgba(155,109,255,0.4), transparent 45%), radial-gradient(ellipse at 80% 75%, rgba(90,42,158,0.45), transparent 42%), linear-gradient(160deg, #0a0614 0%, #05030a 55%, #12081f 100%)",
    softGradient:
      "radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.2), transparent 42%), radial-gradient(ellipse at 70% 80%, rgba(90,42,158,0.35), transparent 48%), #07060a",
    waveA: "rgba(201,168,76,0.35)",
    waveB: "rgba(155,109,255,0.38)",
    gridColor: "rgba(201,168,76,0.14)",
    gridOpacity: 0.12,
    codeOpacity: 0.07,
    particleDensity: 1,
    goldBias: 0.7,
    temp: "hot",
    vignette: "rgba(6,3,14,0.45)",
  },
};

export function themeForLevel(id: number): LevelTheme {
  return LEVEL_THEMES[id] ?? LEVEL_THEMES[1]!;
}
