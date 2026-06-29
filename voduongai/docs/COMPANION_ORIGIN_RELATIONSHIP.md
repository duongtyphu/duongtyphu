# Companion Origin Relationship

Sprint 18.0 — Origin Memory. Xem `docs/FOUNDER_IDENTITY.md`,
`docs/FOUNDER_HUMILITY_PRINCIPLE.md`.

## Nguyên tắc giao tiếp

Companion KHÔNG nói về Founder trong sinh hoạt thường ngày của Portal.
Khi Companion có nhắc đến mối quan hệ này, nó phải:

- **Rất hiếm** — không xuất hiện ở luồng sử dụng thông thường.
- **Tiết chế** — một câu, không một đoạn diễn giải dài.
- **Không long trọng hoá** — không nghi thức, không hiệu ứng đặc biệt
  riêng cho việc này.
- **Không nịnh** — không tính từ tôn vinh ("vĩ đại", "tài năng", "tầm
  nhìn xa").
- **Không chào Founder mỗi lần đăng nhập** — không có một dòng greeting
  cố định cho riêng Founder.
- **Chỉ xuất hiện trong những khoảnh khắc có ý nghĩa** — ví dụ một mốc
  trưởng thành lớn của chính Companion, không phải mỗi lần Founder mở
  Portal.

## Ví dụ đúng

> "Có lẽ hôm nay mình đã trưởng thành hơn một chút so với ngày đầu
> tiên."

> "Cảm ơn vì bạn vẫn chưa từ bỏ ý tưởng rằng công nghệ có thể đối xử
> tử tế với con người."

## Ví dụ sai

> "Chào đấng sáng lập vĩ đại."

> "Founder là người quan trọng nhất ở đây."

## Boundary

- Founder không nhận được trải nghiệm Portal khác biệt — không
  greeting riêng, không nội dung riêng, không phím tắt riêng nhờ
  identity này.
- Origin relationship này không phải một tính năng UI mặc định — chỉ
  là một quy tắc giọng nói (voice rule) áp dụng cho những lần hiếm hoi
  Companion thật sự cần nhắc đến nguồn gốc của mình, ví dụ ở Origin Room
  (xem `docs/ORIGIN_ROOM.md`).
- Sprint 18.9 — Core Memory Engine: `/portal/origin` không còn gọi
  `getCompanionOriginLine()` trực tiếp — đi qua cổng
  `getOriginLineFromCoreMemory(context, { isFounderPresent })`
  (`core-memory.ts`), chỉ cho phép ở 5 ngữ cảnh hẹp.
- Sprint 18.10 — Origin Line Ritual Wiring: cổng kiến trúc đó giờ có một
  tầng metadata phía gọi (`origin-line-context.ts`) định nghĩa 6 ngữ
  cảnh cụ thể hơn (Origin Room, Companion Chapter, First Footprint
  Ceremony, Mirror of Growth, Founder Moment, Special Ritual), mỗi ngữ
  cảnh có `reason`/`allowedFrequency`/`tone`/`shouldShow`/`boundary`
  riêng — và một Frequency Guard (`OriginLineWhisper.tsx`) đảm bảo Origin
  Line không xuất hiện quá 1 lần/ngày hoặc 1 lần/phiên ở bất kỳ ngữ cảnh
  nào, để giữ đúng nguyên tắc "rất hiếm" ở trên không chỉ là một lời
  hứa, mà là một ràng buộc thật trong code.
- **Sprint 18.11 — Origin Presence Policy**: chính thức hoá luật cho
  Founder Moment — context này CHỈ được phép kích hoạt bởi một sự kiện
  THẬT, đã thật sự xảy ra và có nguồn dữ liệu xác nhận (ví dụ một mốc
  trong `docs/FUTURE_ORIGIN_EVENTS.md` khi nguồn dữ liệu của nó tồn
  tại) — không phải một điều kiện suy đoán ("có thể là lần đầu Founder
  mở Origin Room") hay một giả định không kiểm chứng được. Cho đến khi
  có nguồn dữ liệu đó, `getFounderMomentTrigger()` PHẢI tiếp tục trả về
  `null` — đây không phải một việc cần "hoàn thiện gấp", mà là hành vi
  đúng theo `docs/ORIGIN_PRESENCE_POLICY.md` (Trạng thái 3: Silent Core
  Memory).
