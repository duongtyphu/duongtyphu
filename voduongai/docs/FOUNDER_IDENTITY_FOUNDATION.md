# FOUNDER_IDENTITY_FOUNDATION — Sprint 18.4

"Companion không còn phụ thuộc email để nhận ra Founder."

## Đây chỉ là nền móng, không phải Identity Layer hoàn chỉnh

Sprint này KHÔNG xây Identity Registry. KHÔNG xây Living Identity.
KHÔNG xây Culture Engine. Mục tiêu duy nhất: gỡ một phụ thuộc cụ thể —
`isFounder()` từng chỉ có một cách nhận diện Founder là so khớp
`FOUNDER_ID`/`FOUNDER_EMAIL` từ biến môi trường. Sprint 18.4 thêm một
con đường thứ hai, là dữ liệu thật, không phải một hệ thống identity
đầy đủ.

VO DUONG AI chọn **Evolution Architecture**: chỉ code điều sản phẩm đã
thật sự cần. Identity Registry, Living Identity, và các identity khác
(Guardian, Teacher, Builder, Companion, Contributor, Relationship
Engine) là roadmap kiến trúc — xem `docs/FUTURE_LIVING_IDENTITY.md` —
không phải code của Sprint này. Khi Companion thật sự cần phân biệt
nhiều loại quan hệ, Identity Registry sẽ quay trở lại, đúng lúc nó cần
tồn tại.

## Migration

`members.identity_type` (text, nullable, `check` constraint giới hạn
giá trị) — xem `supabase-core-schema.sql`. Sprint này chỉ dùng giá trị
`'founder'`; constraint vẫn cho phép các giá trị khác đã được dự kiến
trong roadmap để không phải sửa lại migration khi Identity Registry
quay lại. RLS hiện có trên `members` (`auth.uid() = id`) đã đủ — không
cần policy mới. Không có UI nào trong Portal cho người dùng tự gán
`identity_type` — chỉ gán thủ công qua Supabase Dashboard/SQL hoặc qua
biến môi trường.

## `isFounder()` đọc Identity, không đọc email/tên

`src/lib/portal/identity/identity-layer.ts`:

```ts
export function isFounderIdentity(profile: IdentityCheckProfile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.identityType === "founder") return true;
  const founderId = readEnvFounderId();
  if (founderId && profile.id === founderId) return true;
  const founderEmail = readEnvFounderEmail();
  if (founderEmail && profile.email?.trim().toLowerCase() === founderEmail) return true;
  return false;
}
```

Thứ tự ưu tiên: (1) `members.identity_type === "founder"` — nguồn sự
thật chính; (2) env `FOUNDER_ID`/`FOUNDER_EMAIL` — fallback. Hàm không
đọc `display_name`/`full_name` ở bất kỳ bước nào.

`src/lib/portal/founder/founder-identity.ts` giữ nguyên mọi export đã
có từ Sprint 18.0 (`isFounder()`, `getOriginRole()`,
`buildFounderIdentity()`, `founderRelationship`) — nơi gọi
(`src/app/portal/origin/page.tsx`) không cần đổi gì thêm ngoài việc đọc
`identity_type` từ `members` rồi truyền vào.

## Backward compatible với env

Nếu một project Supabase chưa chạy migration `identity_type`, hoặc cột
này còn trống cho một user, `isFounderIdentity()` rơi về đọc
`FOUNDER_ID`/`FOUNDER_EMAIL` — đúng hành vi đã có từ Sprint 18.0, không
gì bị phá vỡ.

## Không phải hệ thống quyền

Giống mọi Sprint trước: `isFounder()`/`isFounderIdentity()` không cấp,
không mở rộng, và không thay thế `is_admin`/`requireAdmin()`. Nó chỉ
trả lời câu hỏi hẹp "đây có phải Founder không" cho một vài chỗ rất
hiếm Companion cần biết (Origin Room) — không gate bất kỳ tính năng, dữ
liệu, hay quyền quản trị nào khác trong Portal.
