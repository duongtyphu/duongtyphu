-- Sprint 13.4 (Story Becomes Memory): cho phép Memory Capsule ghi nhận một
-- Living Story đã được lưu, mà không phá schema hiện có. Tất cả cột mới đều
-- nullable — capsule cũ (tạo từ AddMemoryCapsuleForm) không bị ảnh hưởng.
-- Run this once in the Supabase SQL Editor, sau supabase-human-story-engine.sql.

alter table memory_capsules
  add column if not exists source text,
  add column if not exists story_id text,
  add column if not exists meaning_tags text[];

comment on column memory_capsules.source is
  'Nguồn gốc capsule, ví dụ "companion_living_story" — null cho capsule người dùng tự thêm.';
comment on column memory_capsules.story_id is
  'id của LivingStory (xem living-stories.ts) khi capsule này được lưu từ một Living Story.';
comment on column memory_capsules.meaning_tags is
  'meaningTags của LivingStory tại thời điểm lưu — chỉ để hiển thị, không dùng để chấm điểm.';
