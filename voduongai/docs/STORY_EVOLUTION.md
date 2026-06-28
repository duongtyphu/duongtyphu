# Story Evolution — Story kể hành trình, không chỉ Log sự kiện

> Sprint 12.0 — Nhiệm vụ 08. Thiết kế kiến trúc cho My Story
> (`src/app/portal/story/page.tsx`). Phục vụ NL09 (Mỗi hành động đều để
> lại dấu chân) và NL10 (Di sản lớn nhất là một con người tốt hơn).

## Log vs. Story

**Log** liệt kê sự kiện theo thời gian, độc lập với nhau:

> 12/05 — Đã đọc bài "Prompt cơ bản".
> 15/05 — Đã viết Reflection.
> 20/05 — Đã giúp một thành viên khác trong cộng đồng.

**Story** nối các sự kiện đó thành MỘT câu chuyện có hướng đi:

> "Từ một người chỉ học Prompt, bạn đã bắt đầu giúp người khác."

Sự khác biệt không nằm ở dữ liệu (cả hai đọc đúng các sự kiện giống
nhau) — nằm ở việc Story tìm ra MỐI LIÊN HỆ giữa các sự kiện cách nhau
về thời gian, còn Log chỉ liệt kê theo thứ tự xảy ra.

## Cách Story tìm ra một "hành trình" (không cần AI sinh văn bản thật)

Story Evolution không yêu cầu một mô hình ngôn ngữ viết văn — nó cần một
**mẫu hình so sánh** (pattern), áp dụng lên dữ liệu đã có (Reflection,
Garden, Mission, Knowledge đã học):

1. Xác định một **điểm đầu** — trạng thái/hành vi sớm nhất có thể nhận
   diện (ví dụ: loại nội dung đầu tiên người dùng tương tác nhiều —
   "chỉ học Prompt").
2. Xác định một **điểm chuyển** — một hành động khác hẳn về BẢN CHẤT so
   với điểm đầu, không chỉ khác về số lượng (ví dụ: từ "tiêu thụ nội
   dung" sang "đóng góp cho người khác" — `sharesCount`/Connect OS tăng
   sau một giai đoạn dài chỉ có `learningTouchpoints`).
3. Diễn đạt lại bằng một câu nối điểm đầu và điểm chuyển bằng từ "đã bắt
   đầu" / "từ... bạn đã..." — đúng mẫu ví dụ Sprint đưa ra.

Đây chính là loại mẫu hình `branches`/`flowers` trong `garden-model.ts`
đã ngầm chứa (hành động thật vs. chia sẻ) — Story Evolution chỉ là lớp
diễn đạt thành CÂU, thay vì chỉ thành YẾU TỐ VƯỜN.

## Quan hệ với Companion Memory và Garden Evolution

- Garden Evolution (`LIVING_GARDEN.md` mục Sprint 12.0) trả lời "đang
  lớn theo cách nào NGAY GIAI ĐOẠN NÀY".
- Companion Memory (`COMPANION_MEMORY_EVOLUTION.md`) giữ một bản tóm
  tắt ngắn, gần nhất, để Companion nói chuyện tự nhiên.
- **Story Evolution** là lớp duy nhất nhìn lại TOÀN BỘ chiều dài hành
  trình để tìm điểm chuyển — vì vậy My Story vẫn là "bộ nhớ dài hạn duy
  nhất" như `PORTAL_INTELLIGENCE_MAP.md` đã xác định, các lớp khác chỉ
  giữ phần gần nhất.

## Khi chưa có điểm chuyển nào rõ ràng

Không bịa ra một "câu chuyện" giả khi dữ liệu chưa đủ một điểm chuyển
thật (ví dụ người dùng mới, chỉ có 1 loại hành động). Story khi đó vẫn
hiển thị dạng Log đơn giản, trung thực ("Bạn đã bắt đầu với...") — không
thêm các cụm từ tạo cảm giác đã có một bước ngoặt lớn khi thực tế chưa
có.

## Điều tuyệt đối không làm

- Không tự sinh câu chuyện bằng văn phong cường điệu/marketing ("Bạn đã
  trở thành một chuyên gia thực sự!") khi dữ liệu chỉ thể hiện một vài
  hành động nhỏ — giữ đúng tông Companion: khiêm tốn, chân thành
  (`companion-identity.ts` → `voiceTone`).
- Không yêu cầu một mô hình AI viết văn tự do trong Sprint này — mẫu
  hình so sánh + template câu là đủ, đúng mức độ "thiết kế kiến trúc,
  không phải AI thật" Sprint đã giao.
- Không để Story Evolution thay thế hoàn toàn Log chi tiết — người dùng
  vẫn cần xem được từng sự kiện cụ thể nếu muốn (Story là một lớp tóm
  tắt thêm vào, không xoá Log).
