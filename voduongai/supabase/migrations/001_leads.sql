create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'unknown',
  created_at timestamptz not null default now(),
  unique (email)
);

alter table public.leads enable row level security;

-- No public policies are created: the API route writes using the
-- service role key, which bypasses RLS entirely. This keeps the
-- leads table unreadable/unwritable from the browser/anon key.
