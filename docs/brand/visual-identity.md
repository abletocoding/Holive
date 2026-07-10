# Holive Visual Identity

Logo concept: **olive + eye + sacred (holy) halo**, drawn in the same **crayon / doodle** energy as Holi (hand-wobbly strokes, imperfect fills — not a flat corporate mark).

Production files live in `/public/brand/`.

**Palette (Pantone → screen):** purple **2685 C** (`#330072`), gold **871 C** warm metallic (`#C9A84C`) with **7406 C** (`#F1B500`) as digital gold, black **Black 6 C** (`#101820`), white / paper white. See `color-tokens.md`.

---

## Mark anatomy

```
        ╭── gold halo (crayon arc / sacred ring) ──╮
       ╱                                             ╲
      │     olive silhouette (2685 C purple, wobbly)  │
      │            ┌─────────┐                        │
      │            │  iris   │  ← gold (871 C approx) │
      │            │  pupil  │  ← Black 6 C           │
      │            └─────────┘                        │
      │         subtle leaf tip (optional)            │
       ╲                                             ╱
        ╰───────────────────────────────────────────╯
```

1. **Olive body** — Vertical oval with crayon wobble; primary fill is Holive purple **2685 C** (or black in mono).
2. **Eye** — Centered iris with gold ring and dark pupil; reads as “alive / watching / loyal.”
3. **Halo** — Incomplete sacred arc above the olive; gold stroke (**871 C** screen gold), never neon green.
4. **Wordmark** — `HOLIVE` optional beside the mark (see `typography.md`); subtle gold tick on the `I` allowed.

Style: same hand-drawn crayon grain as `holi.svg` — rough outlines, slightly uneven shapes. The logo is still the formal mark; Holi remains the stickman companion.

---

## Lockups

| Variant | File | Use |
|---------|------|-----|
| **Full** | `logo-full.svg` | Mark + wordmark horizontal; headers, decks, contracts |
| **Mark** | `logo-mark.svg` | Icon only; app icon, favicon source, social avatar |
| **Mono** | `logo-mono.svg` | Single-color (black or white via `currentColor`); stamps, emboss, dark/light flex |

Minimum digital size for the mark alone: **24×24 px**. Prefer **32×32** or larger for UI.

---

## Clear space

Clear space around any lockup equals the **height of the eye iris** (or at least **0.25×** the mark height) on all sides.

```
        ← clear →
     ┌──────────────┐
     │              │
     │   [ LOGO ]   │
     │              │
     └──────────────┘
```

Do not place text, UI chrome, or Matrix rain glyphs inside the clear space.

---

## Color usage on logo

| Surface | Treatment |
|---------|-----------|
| Dark backgrounds | Full color (purple olive, gold halo/iris) or white mono |
| Light backgrounds | Full color or black mono |
| Single-ink print | Mono only |
| Favicon | Mark, simplified if needed |

**Never** fill the olive or halo with Matrix green. Green may appear only in separate effect layers behind or around the logo, not as logo paint.

---

## Incorrect use

- Stretch, skew, or rotate beyond a slight doodle tilt (±8°).
- Add drop shadows, glows, or purple neon outlines as default.
- Place the mark inside a generic rounded “app card” unless the product UI requires an icon container.
- Replace the eye with a camera, AI spark, or unrelated symbol.
- Recreate the wordmark in Inter / Roboto / Arial.
- Clean the mark into a perfectly geometric corporate icon — keep crayon energy.

---

## Coexistence with Holi

- **Logo** = formal identity (crayon olive + eye + halo; wordmark optional).
- **Holi** = crayon stickman companion for delight, game, and soft moments.
- Same drawing language; different jobs. Do not substitute Holi for the logo in nav, favicon, or legal headers.

---

## Favicon

Source: `logo-mark.svg` → `favicon.svg` (and optional PNG exports later).  
Tab color / theme-color: Holive purple **2685 C** (`--holive-purple` / `#330072`).
