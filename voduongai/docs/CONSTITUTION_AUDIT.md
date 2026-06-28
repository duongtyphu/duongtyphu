# Constitution Audit — Đối chiếu Product Bible & Portal với Hiến pháp

> Thực hiện theo Nhiệm vụ 05–06, Sprint 11.1. Mỗi chương Product Bible
> và mỗi phần chính của Portal được đối chiếu với 10 nguyên lý trong
> `FIRST_PRINCIPLES_OF_VO_DUONG_AI.md` — chỉ ghi nhận và đề xuất, không
> tự xoá/sửa code hay tài liệu nào (đúng giới hạn không-code của các
> Sprint chiến lược gần đây).

## Phần 1 — Product Bible

| Chương | Phục vụ nguyên lý nào | Đánh giá |
|---|---|---|
| `BOOK_METHOD.md` | NL02, NL04, NL08 | Đạt — mô tả trực tiếp phương pháp chống "hoàn thành", buộc Apply, dạy nguyên lý chuyển giao được. |
| `BOOK_THE_SCHOOL_OF_THOUGHT.md` | NL01, NL02, NL08, NL10 | Đạt — là bản tóm lược triết lý bao trùm, không cần chỉnh. |

Product Bible hiện chỉ có 2 chương — cả hai đều phục vụ rõ ràng ít nhất
một nguyên lý, không có chương nào cần loại bỏ hoặc viết lại ở thời
điểm này. Khi các chương sau được viết, phải đối chiếu Hiến pháp này
trước khi xuất bản.

## Phần 2 — Portal (OS / Module / Component / Flow / CTA / Copy)

### Journey OS

- **Phục vụ nguyên lý:** NL02 (trưởng thành, không hoàn thành), NL09
  (mỗi bước nhỏ có ý nghĩa — Mission 30 Day, Milestone).
- **Đánh giá:** Đạt phần lớn. Growth Path Timeline cần tiếp tục tránh
  hiển thị dạng "% hoàn thành lộ trình" thuần tuý nếu có trong tương
  lai — rủi ro nhẹ với NL02.

### Knowledge OS

- **Phục vụ nguyên lý:** NL08 (dạy tư duy, không chỉ Tool), NL04 (Practice
  Zone).
- **Đánh giá:** Đạt — đã có cấu trúc AI Foundation → Prompt → Workflow
  đúng tinh thần NL08 (`KNOWLEDGE_ARCHITECTURE.md`).

### Build OS

- **Phục vụ nguyên lý:** NL03 (giá trị trước thu nhập), NL04, NL09.
- **Đánh giá:** Đạt — nguyên lý "đừng bắt đầu bằng việc bán" đã được
  ghi nhận trong Hero copy.

### Connect OS

- **Phục vụ nguyên lý:** NL03 (đóng góp trước), NL06 (đồng hành, không
  ép buộc).
- **Đánh giá — CẦN XỬ LÝ:** Module **"Leaderboard"** trong `hubs.ts`
  ("Bảng xếp hạng những viên ngọc sáng nhất") **không phục vụ bất kỳ
  nguyên lý nào** — nó vi phạm trực tiếp NL07 (không Rank, không
  Leaderboard). Đây không phải phát hiện mới — đã được gắn cờ "Tension
  Point" từ Sprint 10.0 (`HUMAN_WISDOM_ARCHITECTURE.md` mục 4) và chưa
  được Product Team xử lý. Hiến pháp này tái xác nhận: module này cần
  được **đổi tên hoặc loại bỏ** (ví dụ: thay bằng "Đóng góp nổi bật"
  mô tả chất lượng đóng góp, không xếp hạng người dùng) — quyết định
  cuối cùng cần Product Team, không tự thực hiện trong sprint tài liệu
  này.

### Legacy OS

- **Phục vụ nguyên lý:** NL10 (di sản là con người tốt hơn).
- **Đánh giá:** Đạt — đã có `LegacyHero.tsx` từ Sprint 10.0 khớp đúng
  nguyên lý này.

### Companion (xuyên suốt mọi OS)

- **Phục vụ nguyên lý:** NL01, NL06, NL09, NL10.
- **Đánh giá:** Đạt — 13 Điều Constitution đã tương thích hoàn toàn với
  Hiến pháp này (xem ánh xạ chi tiết ở mục dưới).

### Living Garden (xuyên suốt mọi OS)

- **Phục vụ nguyên lý:** NL02, NL07, NL09.
- **Đánh giá:** Đạt — không có trạng thái Garden nào mang hình thức
  điểm số.

## Phần 3 — Hạng mục duy nhất không trả lời được "phục vụ nguyên lý nào"

Sau khi rà soát toàn bộ tài liệu hiện có, **chỉ một hạng mục** không
trả lời được câu hỏi "tôi đang phục vụ nguyên lý nào": module
**Leaderboard** (Connect OS, `hubs.ts`). Mọi OS, component, flow, CTA,
copy khác đã được kiểm tra đều có thể truy ngược tới ít nhất một trong
10 nguyên lý. Đây là phát hiện duy nhất cần Product Team quyết định ở
Sprint này.
