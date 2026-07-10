# Holive

Experiential corporate landing for **Holive** ([holive.org](https://holive.org)) — marketing, digitalization, and courses. Bilingual (ES/EN), dark/light, Matrix/3D hero, Supabase lead capture, and a hidden Holi minigame.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- next-intl (ES / EN)
- Framer Motion + React Three Fiber
- Supabase (`leads`, `course_waitlist`, `game_scores`)
- Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`)

## Local setup

```bash
npm install
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — default locale is `es` (`/es`, `/en`).

### Env vars

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (RLS-safe public inserts) |

Optional slots (not required to run): analytics, chat, CMS, payments — see `src/lib/integrations.ts` and `.env.example`.

### Supabase migrations

Apply SQL in `supabase/migrations/20260709000000_init.sql` via the Supabase SQL editor or CLI:

```bash
# if using Supabase CLI
supabase db push
```

Tables: `leads`, `course_waitlist`, `game_scores` — RLS allows **public insert only** (no public select).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Local Next.js (Turbopack) |
| `npm run build` | Production Next.js build |
| `npm run start` | Serve Next build |
| `npm run preview` | OpenNext Cloudflare local preview |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run lint` | ESLint |

## Deploy (Cloudflare)

1. Set secrets / vars in the Cloudflare project: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Authenticate: `npx wrangler login`
3. Deploy:

```bash
npm run deploy
```

Config: `wrangler.toml`, `open-next.config.ts`.

## Where to connect containers

| Concern | Hook |
|---|---|
| Leads / waitlist | Forms → `src/lib/supabase/client.ts` → tables above |
| CRM sync | Comment in `LeadForm` + `src/lib/integrations.ts` |
| Course payments | `payments` slot in `integrations.ts` (Stripe / Mercado Pago) |
| CMS copy | `cms` slot — replace teaser strings when ready |
| Analytics | `analytics` slot + env in `.env.example` |
| Live chat | Mount in `SiteChrome` when chat env is set |
| Brand assets | `public/brand/` + `docs/brand/` |
| Business docs | `docs/business/` (MD/PDF; not public routes) |

## Project layout

```
docs/brand/           # brand identity
docs/business/        # business plan MD/PDF
public/brand/         # logo, Holi assets
messages/             # ES / EN copy
src/app/[locale]/    # localized landing
src/components/       # sections, effects, Holi game, forms
src/lib/supabase/     # clients + types
src/lib/integrations.ts
supabase/migrations/  # SQL
wrangler.toml
open-next.config.ts
```

## Brand note

Palette: purple / white / gold / black with Matrix green as **effect only**. Placeholder mark + Holi SVG live under `/brand/`; replace when the brand agent ships final assets.
