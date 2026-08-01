-- Phase 28 — Companion Chat MVP: 2 bảng hội thoại cho /portal/companion.
-- Cùng convention với supabase-saved-items.sql (FK thẳng auth.users, RLS
-- "auth.uid() = user_id"). Chạy 1 lần trong Supabase SQL Editor.

create table if not exists companion_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Cuộc trò chuyện mới',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companion_conversations_user_id_idx
  on companion_conversations(user_id);
create index if not exists companion_conversations_updated_at_idx
  on companion_conversations(updated_at desc);

create table if not exists companion_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references companion_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  status text not null default 'completed' check (status in ('completed', 'generating', 'failed')),
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);

create index if not exists companion_messages_conversation_id_idx
  on companion_messages(conversation_id);
create index if not exists companion_messages_user_id_idx
  on companion_messages(user_id);
create index if not exists companion_messages_created_at_idx
  on companion_messages(created_at);

alter table companion_conversations enable row level security;
alter table companion_messages enable row level security;

drop policy if exists "users select own conversations" on companion_conversations;
create policy "users select own conversations"
  on companion_conversations for select
  using (auth.uid() = user_id);

drop policy if exists "users insert own conversations" on companion_conversations;
create policy "users insert own conversations"
  on companion_conversations for insert
  with check (auth.uid() = user_id);

drop policy if exists "users update own conversations" on companion_conversations;
create policy "users update own conversations"
  on companion_conversations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users delete own conversations" on companion_conversations;
create policy "users delete own conversations"
  on companion_conversations for delete
  using (auth.uid() = user_id);

-- Xoá conversation tự cascade xoá messages liên quan (FK on delete cascade
-- ở trên) — không cần policy delete/update riêng cho companion_messages.
drop policy if exists "users select own messages" on companion_messages;
create policy "users select own messages"
  on companion_messages for select
  using (auth.uid() = user_id);

drop policy if exists "users insert own messages" on companion_messages;
create policy "users insert own messages"
  on companion_messages for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from companion_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );
