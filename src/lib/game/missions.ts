const STORAGE_KEY = "holive-neural-missions-v1";

export type MissionMode = "classic" | "freestyle";
export type MissionMetric = "classicClears" | "classicScore" | "freestyleHits" | "freestyleSeconds";

export type Mission = {
  id: string;
  day: string;
  mode: MissionMode;
  metric: MissionMetric;
  target: number;
  progress: number;
  completed: boolean;
};

export type MissionEvent =
  | { type: "classicClear"; count?: number }
  | { type: "classicScore"; score: number }
  | { type: "freestyleHit"; count?: number }
  | { type: "freestyleSession"; seconds: number };

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function loadDailyMissions(dateKey = todayKey()): Mission[] {
  if (typeof window === "undefined") return defaultMissions(dateKey);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = defaultMissions(dateKey);
      saveDailyMissions(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw) as { day?: string; missions?: Partial<Mission>[] };
    if (parsed.day !== dateKey || !Array.isArray(parsed.missions)) {
      const fresh = defaultMissions(dateKey);
      saveDailyMissions(fresh);
      return fresh;
    }
    return parsed.missions.map((mission, i) => normalizeMission(mission, defaultMissions(dateKey)[i]!));
  } catch {
    return defaultMissions(dateKey);
  }
}

export function saveDailyMissions(missions: Mission[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ day: missions[0]?.day ?? todayKey(), missions }),
    );
  } catch {
    /* ignore quota/private mode */
  }
}

export function recordMissionEvent(event: MissionEvent, dateKey = todayKey()) {
  const missions = loadDailyMissions(dateKey).map((mission) => applyEvent(mission, event));
  saveDailyMissions(missions);
  return missions;
}

export function missionPercent(mission: Mission) {
  return Math.min(100, Math.round((mission.progress / mission.target) * 100));
}

function defaultMissions(day: string): Mission[] {
  const seed = hashDay(day);
  const classicScore = [160, 220, 300][seed % 3]!;
  const freestyleHits = [32, 48, 64][seed % 3]!;

  return [
    {
      id: `${day}-classic-clear`,
      day,
      mode: "classic",
      metric: "classicClears",
      target: 1,
      progress: 0,
      completed: false,
    },
    {
      id: `${day}-classic-score`,
      day,
      mode: "classic",
      metric: "classicScore",
      target: classicScore,
      progress: 0,
      completed: false,
    },
    {
      id: `${day}-freestyle-hits`,
      day,
      mode: "freestyle",
      metric: "freestyleHits",
      target: freestyleHits,
      progress: 0,
      completed: false,
    },
    {
      id: `${day}-freestyle-heal`,
      day,
      mode: "freestyle",
      metric: "freestyleSeconds",
      target: 180,
      progress: 0,
      completed: false,
    },
  ];
}

function applyEvent(mission: Mission, event: MissionEvent): Mission {
  let progress = mission.progress;

  if (event.type === "classicClear" && mission.metric === "classicClears") {
    progress += event.count ?? 1;
  }
  if (event.type === "classicScore" && mission.metric === "classicScore") {
    progress = Math.max(progress, event.score);
  }
  if (event.type === "freestyleHit" && mission.metric === "freestyleHits") {
    progress += event.count ?? 1;
  }
  if (event.type === "freestyleSession" && mission.metric === "freestyleSeconds") {
    progress += Math.max(0, Math.round(event.seconds));
  }

  progress = Math.min(mission.target, progress);
  return {
    ...mission,
    progress,
    completed: progress >= mission.target,
  };
}

function normalizeMission(value: Partial<Mission>, fallback: Mission): Mission {
  const progress = Math.min(
    fallback.target,
    Math.max(0, Math.round(Number(value.progress) || 0)),
  );
  return {
    ...fallback,
    progress,
    completed: Boolean(value.completed) || progress >= fallback.target,
  };
}

function hashDay(day: string) {
  let hash = 0;
  for (const char of day) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}
