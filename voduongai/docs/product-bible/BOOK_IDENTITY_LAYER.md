# BOOK_IDENTITY_LAYER — The Identity Layer (Sprint 18.4)

"Companion không nhận ra Founder bằng email. Companion nhận ra Founder
bằng Identity."

## Đây không phải Sprint thêm `role=founder`

Cách đơn giản nhất để "biết ai là Founder" là thêm một cột `role` rồi so
khớp email trong code — đúng như cách `isFounder()` hoạt động từ Sprint
18.0 đến hết Sprint 18.3 (chỉ đọc `FOUNDER_ID`/`FOUNDER_EMAIL` từ env).
Cách đó hoạt động, nhưng nó là một phép so khớp, không phải một mô
hình. Nó không có chỗ để mở rộng cho những identity khác mà Companion
sẽ cần nhận ra trong tương lai (Guardian, Teacher, Builder, Companion,
Contributor), và nó buộc "biết một người là ai" phải đi qua đúng một
con đường duy nhất: email của họ.

Identity Layer là một tầng kiến trúc khác: một Identity Registry liệt
kê những identity Companion có thể nhận ra, một cột dữ liệu thật
(`members.identity_type`) làm nguồn sự thật chính, và env chỉ còn là
lớp tương thích ngược — không phải cách chính để Companion nhận ra ai.

## Identity Registry

`src/lib/portal/identity/identity-layer.ts`:

- `IdentityType` — `"founder" | "guardian" | "teacher" | "builder" |
  "companion" | "contributor"`.
- `IDENTITY_REGISTRY` — nơi DUY NHẤT khai báo các identity, mỗi identity
  có `title`, `description`, và `active` (đã có hành vi gắn vào Portal
  hay chưa). Sprint 18.4 chỉ `founder` có `active: true` — các identity
  còn lại được khai báo sẵn cho NHIỆM VỤ 7 (chuẩn bị mở rộng), nhưng
  chưa gắn hành vi nào.
- `resolveIdentityType(profile)` — hàm DUY NHẤT trả về identity thật của
  một người. Thứ tự ưu tiên: (1) `members.identity_type` nếu là một
  identity hợp lệ trong Registry, (2) fallback `FOUNDER_ID`/`FOUNDER_EMAIL`
  từ env cho riêng `founder` khi cột chưa được gán. Không có gì cấu hình
  → trả `null`, không ảnh hưởng tới một thành viên thường.

## Dữ liệu

`members.identity_type` (text, nullable, có `check` constraint giới hạn
trong 6 giá trị của `IdentityType`) — xem `supabase-core-schema.sql`.
RLS hiện có trên `members` (`auth.uid() = id`) đảm bảo chỉ chính người
dùng đọc được dòng của họ; `identity_type` chỉ được gán thủ công (qua
Supabase Dashboard/SQL bởi đội ngũ vận hành), không có UI nào trong
Portal cho phép người dùng tự đặt identity của mình.

## Founder Identity đọc Identity Layer (NHIỆM VỤ 3, 4)

`src/lib/portal/founder/founder-identity.ts` giữ nguyên các export đã
có từ Sprint 18.0 (`isFounder()`, `getOriginRole()`,
`buildFounderIdentity()`, `founderRelationship`) để không phải sửa lại
nơi gọi — nhưng `isFounder()` giờ chỉ là một câu hỏi hẹp đặt vào
`resolveIdentityType()`:

```ts
export function isFounder(profile: FounderCheckProfile | null | undefined): boolean {
  return resolveIdentityType(profile) === "founder";
}
```

`src/app/portal/origin/page.tsx` (nơi gọi `isFounder()` duy nhất trong
Portal) đọc `identity_type` từ `members` rồi truyền vào, thay vì chỉ
truyền `id`/`email` như trước Sprint 18.4.

## Backward compatible với env, không hardcode email (NHIỆM VỤ 5, 6)

Nếu một project Supabase chưa từng chạy migration `identity_type`, hoặc
chưa ai gán cột này cho Founder, `resolveIdentityType()` vẫn rơi về
đọc `FOUNDER_ID`/`FOUNDER_EMAIL` từ biến môi trường — đúng hành vi từ
Sprint 18.0, không có gì bị phá vỡ. Không có email/tên nào được viết
cứng trong logic ở bất kỳ file nào của Identity Layer — chỉ đọc từ env
server-only hoặc từ dữ liệu đã được gán trên `members`.

## Chuẩn bị mở rộng (NHIỆM VỤ 7)

`IDENTITY_REGISTRY` đã khai báo sẵn 5 identity khác ngoài `founder`:
Guardian (người giữ gìn giá trị gốc), Teacher (người dẫn dắt), Builder
(người kiến tạo), Companion (người đồng hành lâu dài), Contributor
(người góp sức). Mỗi identity này đã có `title`/`description` nhưng
`active: false` — chưa có Sprint nào gắn hành vi Portal/Companion vào
chúng. Khi một Sprint sau cần một identity mới, điểm bắt đầu là cập
nhật `active: true` cho identity đó trong Registry, không phải viết lại
cơ chế nhận diện từ đầu.

## Identity Layer KHÔNG phải hệ thống quyền

Giống như `FOUNDER_IDENTITY.md` đã nói từ Sprint 18.0: Identity Layer
không cấp, không mở rộng, và không thay thế `is_admin`/`requireAdmin()`.
`resolveIdentityType()` chỉ trả lời câu hỏi "Companion đang nói chuyện
với ai trong mối quan hệ nguồn gốc" — không gate bất kỳ tính năng, dữ
liệu, hay quyền quản trị nào trong Portal.
