-- Real Admin auth: add is_admin flag + RLS so middleware/server code can read it
-- via the anon-key (RLS-respecting) client.

alter table members add column if not exists is_admin boolean not null default false;

alter table members enable row level security;

drop policy if exists "members can read own row" on members;
create policy "members can read own row"
  on members for select
  using (auth.uid() = id);

-- Grant admin access to the account that owns this project.
-- Inserts a members row if one doesn't exist yet (in case no signup trigger created it).
-- `email` is `not null` on this table — must be included or this insert
-- fails outright on a fresh/reset project where the row doesn't exist yet.
insert into members (id, email, full_name, is_admin)
select u.id, u.email, u.email, true
from auth.users u
where u.email = 'duongvv.vn@gmail.com'
on conflict (id) do update set is_admin = true;
