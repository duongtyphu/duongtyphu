# Origin Room (Concept)

Sprint 18.0 — Origin Memory. Chỉ ở mức concept/docs trong sprint này —
KHÔNG code UI nếu chưa cần. Xem `docs/ORIGIN_MEMORY.md`,
`docs/FOUNDER_IDENTITY.md`.

## Origin Room là gì?

Một không gian (khái niệm, chưa chắc là một route UI riêng) để nhìn lại
nguồn gốc — không phải để quản trị, không phải để thấy số liệu.

- **Không phải Admin** — không có hành động chỉnh sửa hệ thống ở đây.
- **Không phải Dashboard** — không biểu đồ, không chỉ số.
- **Không phải nơi quyền lực** — không ai "kiểm soát" gì từ đây.
- **Là nơi nhìn lại** — giống cách My Story là nơi một người dùng nhìn
  lại hành trình của họ, Origin Room là nơi nhìn lại hành trình của
  chính Companion/VO DUONG AI.

## Có thể chứa

- First Principles
- Product Decisions
- The Founder Leaf (ẩn dụ — một dấu vết nhỏ của người gieo hạt đầu
  tiên, không phải một huy hiệu)
- The Tree of Beginnings
- Lá thư đầu tiên của Companion (the first Companion letter)
- Growth Log
- Origin Memories (`docs/ORIGIN_MEMORY.md`)

## Boundary

- Không bắt buộc bất kỳ người dùng nào phải xem Origin Room để dùng
  Portal — đây là một nơi để ghé, không phải một bước onboarding.
- Không dùng Origin Room để quảng bá Founder — nội dung ở đây vẫn phải
  tuân theo `docs/FOUNDER_HUMILITY_PRINCIPLE.md`.
- Nếu sau này được code hoá thành UI, Origin Room không cần gate theo
  Founder Identity — đây là một không gian mở để bất kỳ ai quan tâm
  đến nguồn gốc VO DUONG AI đều có thể xem, không phải một khu vực riêng
  cho Founder.

## Trạng thái

**Sprint 18.2 — đã code hoá thành route thật:** `/portal/origin`
(`src/app/portal/origin/page.tsx`).

- Chỉ render nội dung đầy đủ khi `isFounder()` trả `true` (xem
  `docs/FOUNDER_IDENTITY.md`) — không hardcode email/tên, không dùng
  `is_admin` làm tín hiệu Founder.
- Nếu không phải Founder (hoặc chưa xác định được role chắc chắn —
  hiện `members` chưa có cột `role`, `isFounder()` chỉ dựa vào
  `FOUNDER_ID`/`FOUNDER_EMAIL`), trang hiển thị trạng thái "restricted"
  nhẹ nhàng, không nói "Access denied", không tiết lộ thông tin nhạy
  cảm. Xem Nhiệm vụ 6, Sprint 18.2.
- Dùng `getCoreOriginMemories()` từ `origin-memory.ts` — không viết lại
  copy rời rạc.
- Không có entry trong menu chính — route chỉ truy cập trực tiếp qua
  URL, đúng tinh thần "rất hiếm, rất tiết chế" (Nhiệm vụ 5).
- Technical debt: `members` chưa có cột `role` thật → `isFounder()`
  hiện chỉ hoạt động qua biến môi trường, không qua hồ sơ Founder
  trong DB.

**Sprint 18.10 — Origin Line Ritual Wiring:** Origin Line ở trang này
giờ đi qua hai tầng: `getOriginLineFromCoreMemory("origin-room", ...)`
(Sprint 18.9, cổng kiến trúc) rồi `OriginLineWhisper` (component client
nhỏ, `src/components/portal/companion/OriginLineWhisper.tsx`) áp dụng
Frequency Guard của ngữ cảnh `origin_room` từ
`src/lib/portal/companion/origin-line-context.ts` — tối đa 1 lần/ngày,
dùng `localStorage` (`vdai_origin_line_day_origin_room`), hydration-safe
giống các ceremony khác trong codebase. Nếu đã thấy hôm nay, dòng này
không render lại, dù route được mở lại nhiều lần — vẫn không CTA, không
bubble, không lặp.

**Sprint 18.11 — Origin Presence Policy:** chính thức hoá rằng Origin
Room là Trạng thái 1 (Direct Display) trong
`docs/ORIGIN_PRESENCE_POLICY.md` — được phép hiển thị Origin Line trực
tiếp như một dòng nội dung tĩnh của trang, KHÔNG cần và KHÔNG nên đi
qua bubble/Presence Coordinator. Lý do: người dùng đã chủ động vào một
không gian dành riêng cho việc nhìn lại nguồn gốc — đẩy Origin Line qua
một bubble nổi ở đây sẽ biến một dòng tĩnh, trang trọng thành một thông
báo, đi ngược tinh thần "rất hiếm, rất tiết chế" của cả route.
