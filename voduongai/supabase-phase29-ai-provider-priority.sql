-- Sprint "AI Provider Priority" — cho phép Founder chỉnh/kéo-thả thứ tự
-- ưu tiên AI Provider ngay trong Admin (giai đoạn đầu dùng nhiều API key
-- free, cần đổi ưu tiên linh hoạt mà không phải deploy code mới). Schema
-- generic id/data jsonb/status/order, đăng ký vào SUPABASE_COLLECTIONS
-- như mọi bảng generic khác — không viết API mới.
--
-- `id` = ĐÚNG providerId trong src/ai/providers/registry.ts (bắt buộc
-- khớp tuyệt đối, không tự đặt tên khác — ModelRouter tra theo đúng
-- chuỗi này). `data.displayName` chỉ để hiển thị đẹp trong Admin, không
-- ảnh hưởng logic chọn Provider. `order` = thứ tự ưu tiên (nhỏ hơn = ưu
-- tiên hơn, đúng thứ tự kéo-thả trên xuống). `status`:
--   - "Published" → Provider này được tính vào danh sách ưu tiên.
--   - "Draft"/"Hidden" → Provider bị loại khỏi danh sách ưu tiên (không
--     có nghĩa là tắt hẳn Provider — nếu vẫn có API key cấu hình, Provider
--     đó vẫn có thể được chọn ở bước xếp hạng tự động phía sau, chỉ là
--     không còn được ưu tiên tuyệt đối theo thứ tự thủ công này nữa).
--
-- LƯU Ý QUAN TRỌNG (Founder, đọc trước khi dùng "Thêm mới"/"Xoá" trong
-- Admin — trang này dùng VisualEditor, component dùng chung có sẵn 2 nút
-- này cho MỌI collection, không riêng bảng này):
-- CHỈ nên kéo-thả đổi thứ tự + đổi trạng thái Published/Hidden trên 12
-- dòng đã seed sẵn dưới đây — KHÔNG dùng "Thêm mới" để thêm 1 provider
-- lạ (id không khớp registry.ts sẽ không có tác dụng gì, ModelRouter chỉ
-- đọc id này để tra `providerRegistry.get(id)`, id không tồn tại bị bỏ
-- qua lặng lẽ) và KHÔNG "Xoá" hẳn 1 dòng (nếu muốn tạm ngừng ưu tiên 1
-- Provider, đổi trạng thái sang "Hidden" thay vì xoá — xoá sẽ mất luôn vị
-- trí thứ tự đã sắp, phải thêm lại thủ công đúng id cũ mới khôi phục
-- được).
create table if not exists ai_provider_priority (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Published',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ai_provider_priority enable row level security;
create policy "public read published" on ai_provider_priority
  for select using (status = 'Published');

-- Seed: đúng 12 providerId thật đã đăng ký trong registry.ts (không tính
-- "mock" — Provider nội bộ, luôn là lựa chọn cuối cùng, không cho Admin
-- sắp xếp). Thứ tự khởi tạo do Founder xác nhận trực tiếp — Gemini mặc
-- định → Groq (fallback nhanh) → OpenRouter (fallback nhiều model) →
-- phần còn lại làm lưới an toàn mở rộng (chỉ chạm tới nếu cả 3 provider
-- trên đều lỗi/hết quota) → Mock chỉ khi mọi Provider thật đều không khả
-- dụng. Khớp đúng `DEFAULT_PRIORITY_ORDER` trong `priority-store.ts` (đang
-- active NGAY CẢ KHI bảng này chưa apply) — 2 nơi phải luôn đồng bộ.
insert into ai_provider_priority (id, data, status, "order") values
  ('gemini', '{"displayName":"Google Gemini"}'::jsonb, 'Published', 1),
  ('groq', '{"displayName":"Groq"}'::jsonb, 'Published', 2),
  ('openrouter', '{"displayName":"OpenRouter"}'::jsonb, 'Published', 3),
  ('cerebras', '{"displayName":"Cerebras"}'::jsonb, 'Published', 4),
  ('anthropic', '{"displayName":"Anthropic (Claude)"}'::jsonb, 'Published', 5),
  ('openai', '{"displayName":"OpenAI (GPT)"}'::jsonb, 'Published', 6),
  ('deepseek', '{"displayName":"DeepSeek"}'::jsonb, 'Published', 7),
  ('grok', '{"displayName":"Grok (xAI)"}'::jsonb, 'Published', 8),
  ('perplexity', '{"displayName":"Perplexity"}'::jsonb, 'Published', 9),
  ('mistral', '{"displayName":"Mistral"}'::jsonb, 'Published', 10),
  ('cohere', '{"displayName":"Cohere"}'::jsonb, 'Published', 11),
  ('ollama', '{"displayName":"Ollama (local)"}'::jsonb, 'Published', 12)
on conflict (id) do nothing;
