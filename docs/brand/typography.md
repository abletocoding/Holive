# Holive Typography

Expressive, purposeful fonts. **Do not** use Inter, Roboto, Arial, or bare system UI stacks as brand type.

---

## Roles

| Role | Family | CSS variable | Character |
|------|--------|--------------|-----------|
| **Display** | Syne | `--font-holive-display` | Geometric, modern, brand-forward headlines |
| **Body** | Fraunces | `--font-holive-body` | Soft contrast serif; human warmth under digital surfaces |
| **Mono** | IBM Plex Mono | `--font-holive-mono` | Code layers, Matrix captions, technical labels |

Fallbacks (after the brand face only): `ui-sans-serif` / `ui-serif` / `ui-monospace` — never as the primary choice.

---

## Loading (Next.js)

Prefer `next/font/google` in the locale layout:

```ts
import { Syne, Fraunces, IBM_Plex_Mono } from "next/font/google";

const syne = Syne({ subsets: ["latin"], variable: "--font-holive-display" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-holive-body" });
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-holive-mono",
});
```

Wire variables on `<body>` and map them in `tokens.css` / Tailwind `@theme`.

Until fonts are wired in layout, CSS tokens still declare the intended stacks so the web team can consume them.

---

## Scale (suggested)

| Step | Size | Use |
|------|------|-----|
| `display` | clamp(2.5rem, 6vw, 4.5rem) | Hero brand / one headline |
| `h2` | clamp(1.75rem, 3vw, 2.5rem) | Section titles |
| `h3` | 1.375rem | Subheads |
| `body` | 1.0625rem / 1.65 | Running copy |
| `small` | 0.875rem | Meta, captions |
| `code` | 0.875rem | Mono layers |

Tracking: display slightly tight (−0.02em); mono slightly open for rain/code readability.

---

## Pairing rules

1. First viewport: **display** for Holive / headline; **body** for one supporting sentence.
2. Matrix / system moments: **mono** for overlays, not for long marketing paragraphs.
3. Do not mix more than these three families on a single surface.
4. Wordmark in logo SVG is outlined paths — do not replace with a random web font in the SVG file.

---

## Language

ES and EN share the same type system. Prefer Fraunces for longer Spanish body copy (diacritics supported via Latin subset).
