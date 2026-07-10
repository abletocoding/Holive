-- Holive initial schema: leads, course waitlist, optional game scores
-- RLS: public insert only; no public select/update/delete

create extension if not exists "pgcrypto";

-- Leads (contact form)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  interest text check (interest in ('marketing', 'digital', 'courses', 'other')),
  message text,
  locale text,
  source text default 'landing'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);

alter table public.leads enable row level security;

create policy "Public can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Course waitlist
create table if not exists public.course_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  locale text,
  course_interest text
);

create unique index if not exists course_waitlist_email_uidx
  on public.course_waitlist (lower(email));

alter table public.course_waitlist enable row level security;

create policy "Public can insert course waitlist"
  on public.course_waitlist
  for insert
  to anon, authenticated
  with check (true);

-- Optional Holi minigame scores
create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  player_name text,
  score integer not null check (score >= 0),
  locale text
);

create index if not exists game_scores_score_idx on public.game_scores (score desc);

alter table public.game_scores enable row level security;

create policy "Public can insert game scores"
  on public.game_scores
  for insert
  to anon, authenticated
  with check (true);

-- No public SELECT policies: read via service role / dashboard only.
