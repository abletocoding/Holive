-- Holive consulta funnel leads (automation advisory gate)
-- RLS: public insert only; no public select/update/delete

create table if not exists public.leads_consulta (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_type text not null,
  stage text not null,
  bottleneck text not null,
  revenue_range text not null,
  delegation text not null,
  tried_before text not null,
  priority_90d text not null,
  budget_quarter text not null,
  name text not null,
  email text not null,
  whatsapp text not null,
  zone text not null,
  locale text,
  source text not null default 'consulta',
  cal_booked boolean not null default false,
  path_interest text check (path_interest is null or path_interest in ('service', 'courses', 'advisory')),
  raw jsonb
);

create index if not exists leads_consulta_created_at_idx
  on public.leads_consulta (created_at desc);

create index if not exists leads_consulta_email_idx
  on public.leads_consulta (email);

alter table public.leads_consulta enable row level security;

create policy "Public can insert leads_consulta"
  on public.leads_consulta
  for insert
  to anon, authenticated
  with check (true);
