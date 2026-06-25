-- Adds an editable VND price to the courses table so V-SOLO / V-SCALE
-- pricing can be changed from /admin/course-pricing instead of hardcoded in code.
-- Run once in the Supabase SQL Editor.

create table if not exists courses (
  id bigint generated always as identity primary key,
  name text not null,
  status text not null default 'coming',
  description text,
  price numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table courses add column if not exists price numeric not null default 0;

insert into courses (name, status, price)
select 'V-SOLO', 'open', 7800000
where not exists (select 1 from courses where name ilike '%solo%');

insert into courses (name, status, price)
select 'V-SCALE', 'open', 26000000
where not exists (select 1 from courses where name ilike '%scale%');
