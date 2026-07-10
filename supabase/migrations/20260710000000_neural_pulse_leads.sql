-- Neural Pulse leads (email + objective after victory / deep progress)
-- RLS: public insert only

create table if not exists public.neural_pulse_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  objective text not null,
  score integer check (score is null or score >= 0),
  level integer check (level is null or level >= 1),
  locale text
);

create index if not exists neural_pulse_leads_created_at_idx
  on public.neural_pulse_leads (created_at desc);

create index if not exists neural_pulse_leads_email_idx
  on public.neural_pulse_leads (lower(email));

alter table public.neural_pulse_leads enable row level security;

create policy "Public can insert neural pulse leads"
  on public.neural_pulse_leads
  for insert
  to anon, authenticated
  with check (true);
