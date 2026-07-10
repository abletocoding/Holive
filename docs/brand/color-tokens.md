# Holive Color Tokens

Primary brand colors: **purple**, **white**, **gold**, **black**.  
**Matrix green** is an effect accent only — never a primary brand color.

CSS source of truth for the web app: [`src/styles/tokens.css`](../../src/styles/tokens.css).

Pantone codes below are coated (**C**) print references. Hex values are **screen approximations** for digital use — confirm production color against a physical Pantone guide.

---

## Pantone map

| Role | Pantone | Screen hex | Notes |
|------|---------|------------|-------|
| **Purple (primary)** | **2685 C** | `#330072` | Deep royal purple — brand primary |
| **Gold (metallic)** | **871 C** | `#C9A84C` | Metallic gold ink; warm metallic approx for screen (literal coated preview is duller brown — do not use that as UI gold) |
| **Gold (digital alt)** | **7406 C** | `#F1B500` | Digital-friendly gold; use as bright / dark-UI gold |
| **Black** | **Black 6 C** | `#101820` | Cool near-black |
| **White** | — | `#FFFFFF` | Clean white |
| **Paper white** | — | `#FAFAF8` | Soft light-mode ground alternate |

---

## Core palette

| Token | Hex | Pantone / role |
|-------|-----|----------------|
| `--holive-purple` | `#330072` | **2685 C** — brand primary (light surfaces) |
| `--holive-purple-bright` | `#6B3DB8` | Lifted 2685 for dark surfaces |
| `--holive-purple-deep` | `#1A003D` | Depth, gradients, hover |
| `--holive-gold` | `#C9A84C` | **871 C** warm metallic screen approx — sacred accent, halo, CTAs |
| `--holive-gold-bright` | `#F1B500` | **7406 C** — gold on dark / digital-friendly |
| `--holive-white` | `#FFFFFF` | Light ground / text on dark |
| `--holive-paper` | `#FAFAF8` | Paper white for soft light grounds |
| `--holive-black` | `#101820` | **Black 6 C** — dark ground / text on light |
| `--holive-ink` | `#16141C` | Soft black with purple undertone |

---

## Semantic (theme-aware)

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--background` | `#FFFFFF` | `#101820` | Page ground |
| `--foreground` | `#101820` | `#EDEDED` | Body text |
| `--surface` | `#F7F4FB` | `#16141C` | Subtle panels |
| `--muted` | `#6B6570` | `#A39EAB` | Secondary text |
| `--border` | `#E4DCEF` | `#2A2433` | Hairlines |
| `--accent` | gold (`#C9A84C`) | gold-bright (`#F1B500`) | Emphasis / CTA |
| `--brand` | purple (`#330072`) | purple-bright (`#6B3DB8`) | Links, brand UI |

---

## Matrix effect (non-brand)

Use only for rain, code trails, and temporary FX:

| Token | Hex | Notes |
|-------|-----|-------|
| `--matrix-green` | `#00FF41` | Classic terminal green |
| `--matrix-green-dim` | `#00FF4180` | Soft trails |
| `--matrix-green-fade` | `#00FF4120` | Atmosphere |

Rules:

- Never use Matrix green for logo, wordmark, primary buttons, or Holi fill.
- Prefer purple/gold for conversion UI; green for immersion only.
- Respect `prefers-reduced-motion`: reduce or remove green rain.

---

## Gradients (suggested)

```css
--gradient-holy: linear-gradient(145deg, #1A003D 0%, #330072 45%, #C9A84C 100%);
--gradient-void: linear-gradient(180deg, #101820 0%, #16141C 50%, #1A003D 100%);
--gradient-light: linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 50%, #EFE8F7 100%);
```

Avoid flat single-color heroes; use gradients or imagery for atmosphere while keeping purple / gold / black / white dominant.

---

## Contrast checklist

- Body text on background: aim WCAG AA (4.5:1).
- Gold on white: use sparingly for large type or icons; pair with purple or black for small text.
- Purple-bright on black: preferred for dark UI brand moments.
- **2685 C** (`#330072`) on white: large brand moments OK; small text may need black or purple-bright.
