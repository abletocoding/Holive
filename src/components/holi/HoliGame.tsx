"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { createBrowserClient } from "@/lib/supabase/client";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STORAGE_KEY = "holive-holi-highscore";
const GRAVITY = 0.55;
const JUMP = -9.2;
const GROUND_Y = 118;
const GAME_W = 320;
const GAME_H = 160;

type Coin = { x: number; y: number; taken: boolean; id: number };
type Hazard = { x: number; w: number; id: number };

type Snapshot = {
  running: boolean;
  over: boolean;
  score: number;
  y: number;
  coins: Coin[];
  hazards: Hazard[];
};

type Internal = Snapshot & {
  vy: number;
  distance: number;
  nextId: number;
};

function loadHighScore() {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem(STORAGE_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    /* ignore */
  }
}

function createInternal(): Internal {
  return {
    running: false,
    over: false,
    score: 0,
    y: GROUND_Y,
    vy: 0,
    distance: 0,
    nextId: 3,
    coins: [
      { id: 1, x: 180, y: 90, taken: false },
      { id: 2, x: 260, y: 70, taken: false },
    ],
    hazards: [{ id: 0, x: 300, w: 28 }],
  };
}

function toSnapshot(s: Internal): Snapshot {
  return {
    running: s.running,
    over: s.over,
    score: s.score,
    y: s.y,
    coins: s.coins.map((c) => ({ ...c })),
    hazards: s.hazards.map((h) => ({ ...h })),
  };
}

export function HoliGame() {
  const t = useTranslations("HoliGame");
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();
  const [highScore, setHighScore] = useState(0);
  const [snap, setSnap] = useState<Snapshot>(() => toSnapshot(createInternal()));
  const stateRef = useRef<Internal>(createInternal());
  const rafRef = useRef(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    setHighScore(loadHighScore());
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.running || s.over) return;
    if (s.y >= GROUND_Y - 1) {
      s.vy = JUMP;
    }
  }, []);

  const start = useCallback(() => {
    stateRef.current = { ...createInternal(), running: true };
    submittedRef.current = false;
    setSnap(toSnapshot(stateRef.current));
  }, []);

  useEffect(() => {
    if (reduced) return;

    let frame = 0;

    function tick() {
      const s = stateRef.current;
      if (s.running && !s.over) {
        s.distance += 1;
        s.vy += GRAVITY;
        s.y += s.vy;
        if (s.y > GROUND_Y) {
          s.y = GROUND_Y;
          s.vy = 0;
        }

        const speed = 3.2 + Math.min(s.distance / 400, 2.5);

        for (const c of s.coins) {
          c.x -= speed;
          if (
            !c.taken &&
            Math.abs(c.x - 48) < 18 &&
            Math.abs(c.y - (s.y - 20)) < 22
          ) {
            c.taken = true;
            s.score += 10;
          }
        }
        s.coins = s.coins.filter((c) => c.x > -20 && !c.taken);
        if (s.coins.length < 2) {
          s.coins.push({
            id: s.nextId++,
            x: GAME_W + Math.random() * 80,
            y: 55 + Math.random() * 50,
            taken: false,
          });
        }

        for (const h of s.hazards) {
          h.x -= speed;
        }
        s.hazards = s.hazards.filter((h) => h.x + h.w > -10);
        if (s.hazards.length < 1) {
          s.hazards.push({
            id: s.nextId++,
            x: GAME_W + 40 + Math.random() * 120,
            w: 22 + Math.random() * 18,
          });
        }

        for (const h of s.hazards) {
          if (s.y >= GROUND_Y - 2 && h.x < 58 && h.x + h.w > 36) {
            s.over = true;
            s.running = false;
            const best = Math.max(loadHighScore(), s.score);
            saveHighScore(best);
            setHighScore(best);

            if (!submittedRef.current && s.score > 0) {
              submittedRef.current = true;
              const supabase = createBrowserClient();
              if (supabase) {
                void supabase.from("game_scores").insert({
                  score: s.score,
                  locale,
                  player_name: "Holi",
                });
              }
            }
          }
        }

        if (s.distance % 30 === 0) {
          s.score += 1;
        }

        frame += 1;
        if (frame % 2 === 0 || s.over) {
          setSnap(toSnapshot(s));
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [locale, reduced]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        if (!stateRef.current.running) start();
        else jump();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, start]);

  if (reduced) {
    return (
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <HoliMascot className="mx-auto h-16 w-14" />
        <p className="font-display mt-3 text-lg font-semibold">{t("title")}</p>
        <p className="mt-1 text-sm opacity-70">
          {t("highScore")}: {highScore}
        </p>
      </div>
    );
  }

  const bottomPct = 10 + ((GAME_H - snap.y) / GAME_H) * 45;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold">{t("title")}</h3>
          <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">
            {t("subtitle")}
          </p>
        </div>
        <div className="font-mono-code text-right text-[0.7rem] tracking-wide">
          <div>
            {t("score")}: {snap.score}
          </div>
          <div className="text-[var(--holive-gold)]">
            {t("highScore")}: {highScore}
          </div>
        </div>
      </div>

      <div
        role="application"
        aria-label={t("title")}
        tabIndex={0}
        onClick={() => {
          if (!snap.running) start();
          else jump();
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (!snap.running) start();
            else jump();
          }
        }}
        className="focus-ring relative cursor-pointer overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,#12081f_0%,#07060a_70%)] select-none"
        style={{ aspectRatio: `${GAME_W}/${GAME_H}` }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-[18%] border-t border-[var(--holive-purple)]/40"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(155,109,255,0.12) 12px, rgba(155,109,255,0.12) 13px)",
          }}
        />

        <div
          className="absolute left-[11%] w-[14%]"
          style={{ bottom: `${bottomPct}%` }}
        >
          <HoliMascot className="h-auto w-full drop-shadow-[0_0_12px_rgba(224,195,90,0.35)]" />
        </div>

        {snap.coins.map((c) => (
          <span
            key={c.id}
            className="absolute h-2.5 w-2.5 rounded-full bg-[var(--holive-gold)] shadow-[0_0_10px_rgba(224,195,90,0.8)]"
            style={{
              left: `${(c.x / GAME_W) * 100}%`,
              top: `${(c.y / GAME_H) * 100}%`,
            }}
          />
        ))}

        {snap.hazards.map((h) => (
          <span
            key={h.id}
            className="absolute bottom-[18%] bg-[var(--holive-purple)]/80"
            style={{
              left: `${(h.x / GAME_W) * 100}%`,
              width: `${(h.w / GAME_W) * 100}%`,
              height: "12%",
              boxShadow: "0 0 12px rgba(155,109,255,0.5)",
            }}
          />
        ))}

        {!snap.running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 px-4 text-center">
            <p className="font-display text-lg text-[var(--holive-gold)]">
              {snap.over ? t("gameOver") : t("title")}
            </p>
            <p className="mt-2 text-xs text-white/70">{t("tap")}</p>
            <button
              type="button"
              className="focus-ring mt-4 bg-[var(--holive-gold)] px-4 py-2 text-xs font-semibold text-[var(--holive-black)]"
              onClick={(e) => {
                e.stopPropagation();
                start();
              }}
            >
              {snap.over ? t("restart") : t("start")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
