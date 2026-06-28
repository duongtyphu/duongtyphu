# Constitution Audit V1 — Quy trình chuẩn rà soát Portal theo Hiến pháp

> Sprint 11.2. Đây không phải bản thay thế `CONSTITUTION_AUDIT.md`
> (Sprint 11.1, rà soát ở cấp độ OS/chương Product Bible) — đây là một
> **lớp rà soát sâu hơn, ở cấp độ code thật** (`hubs.ts`, data file,
> component), và đồng thời là **quy trình chuẩn** để các Sprint sau lặp
> lại audit này định kỳ. Không mở rộng tính năng mới — chỉ ghi nhận và
> đề xuất chỉnh sửa giúp Portal nhất quán hơn với
> `FIRST_PRINCIPLES_OF_VO_DUONG_AI.md`.

## Quy trình chuẩn (dùng lại cho mọi lần audit sau)

1. `grep` toàn bộ `src/` theo các từ khoá rủi ro cao nhất với
   No-Gamification và các nguyên lý khác: `leaderboard`, `xếp hạng`,
   `streak`, `chuỗi`, `duy trì`, `level`/`cấp độ`, `XP`, `badge`/`huy
   hiệu`, `điểm số`, `top`, `rank`.
2. Với mỗi kết quả, đọc ngữ cảnh thật (không chỉ tên biến) — một số
   khớp từ khoá là vô hại (ví dụ `level` mô tả độ khó nội dung, không
   mô tả thứ hạng người dùng — đã hợp lệ theo `KNOWLEDGE_METADATA_
   STANDARD.md`).
3. Với mỗi mục thật sự rủi ro, ghi theo cấu trúc: Vị trí → Nguyên lý bị
   ảnh hưởng → Vì sao → Đề xuất chỉnh sửa → Mức độ ưu tiên.
4. Không tự sửa code trong cùng sprint audit, trừ khi Sprint đó được
   giao rõ "audit + sửa" (như Sprint 11.2 này được giao rõ).
5. Lưu kết quả vào một file `CONSTITUTION_AUDIT_VN.md` mới mỗi lần audit
   lớn, không ghi đè bản trước — để giữ lịch sử các lần rà soát.

## Danh sách phát hiện

### 1. Module "Leaderboard" — `src/lib/portal/hubs.ts:98`, `src/data/portal/connect-os.ts:82`

- **Nguyên lý bị ảnh hưởng:** NL07 (Living Garden/Portal phản ánh
  trưởng thành, không thành tích — không Rank, không Leaderboard).
- **Vì sao:** Tên module và description ("Bảng xếp hạng những viên ngọc
  sáng nhất") là một bảng xếp hạng so sánh người dùng trực tiếp — vi
  phạm trực tiếp, không phải gián tiếp.
- **Đề xuất:** Đổi tên thành **"Đóng góp nổi bật"** hoặc **"Câu chuyện
  được lan tỏa"** — mô tả lại bằng nội dung chất lượng đóng góp/câu
  chuyện được cộng đồng đón nhận, không xếp hạng theo số liệu.
- **Mức độ ưu tiên:** **Critical** — đã được gắn cờ từ Sprint 10.0
  (`HUMAN_WISDOM_ARCHITECTURE.md`) và tái xác nhận ở Sprint 11.1, vẫn
  chưa xử lý.

### 2. Module "Top Contributor" — `src/data/portal/connect-os.ts:84`

- **Nguyên lý bị ảnh hưởng:** NL07.
- **Vì sao:** "Những người đóng góp nhiều nhất" là một thứ hạng theo số
  lượng — cùng bản chất với Leaderboard, chỉ khác tên gọi.
- **Đề xuất:** Đổi thành **"Đóng góp đáng ghi nhận"** — liệt kê đóng
  góp có ý nghĩa (được cộng đồng phản hồi tích cực), không xếp theo số
  lượng.
- **Mức độ ưu tiên:** **High**.

### 3. Module "Badge" — `src/data/portal/connect-os.ts:83`

- **Nguyên lý bị ảnh hưởng:** NL07.
- **Vì sao:** "Huy hiệu ghi nhận năng lực và sự đóng góp" gợi mô hình
  gamification badge (thu thập huy hiệu) — dù chưa chắc đã hiện thực
  hoá thành cơ chế "unlock", tên gọi đã định hướng sai.
- **Đề xuất:** Gộp vào "Chứng nhận" (module liền kề, `al5`) hoặc đổi
  thành mô tả không mang tính sưu tập ("Những phẩm chất được cộng đồng
  nhận ra ở bạn" — gần với Character Moments đã có ở
  `HUMAN_CHARACTER_ENGINE.md`).
- **Mức độ ưu tiên:** **Medium** — chưa có cơ chế thật phía sau, mới là
  rủi ro về *định hướng tên gọi*.

### 4. `Mission30DayCard` — `src/components/portal/journey/Mission30DayCard.tsx`, mô tả ở `src/lib/portal/hubs.ts:35`

- **Nguyên lý bị ảnh hưởng:** NL06 (đồng hành, không điều khiển/tạo áp
  lực), NL07 (không cơ chế dạng streak).
- **Vì sao:** Component hiển thị "Ngày {currentDay}/{totalDays}", thanh
  tiến độ "Tiến độ chuỗi 30 ngày", và lưới 30 ô được tô màu theo trạng
  thái hoàn thành — đây là hình thức trực quan rất gần với streak
  counter (Duolingo-style) mà `THE_LEARNING_DNA.md` đã chủ động từ chối
  làm hình mẫu. Mô tả ở `hubs.ts` ("Chuỗi nhiệm vụ giúp bạn duy trì
  động lực mỗi ngày") càng nhấn vào khung "duy trì chuỗi" — đúng cơ chế
  tạo động lực ngoài (extrinsic) mà Sprint 9.0 đã từ chối áp dụng.
- **Đề xuất:** Đổi cách trình bày từ "chuỗi ngày liên tiếp" sang "các
  cột mốc đã đi qua trong 30 ngày" — bỏ khung "ngày X/30" mang tính đếm
  chuỗi, giữ lại bản đồ 30 ô nhưng để mỗi ô đại diện một cột mốc có thể
  hoàn thành không theo thứ tự liên tiếp bắt buộc (không "mất chuỗi"
  nếu bỏ lỡ một ngày). Đổi label `hubs.ts` thành "30 ngày đầu tiên" hoặc
  "Hành trình khởi động", bỏ chữ "duy trì động lực mỗi ngày".
- **Mức độ ưu tiên:** **High** — đây là component thật, đang hiển thị
  cho người dùng, không chỉ là copy trong danh sách module.

### 5. Module "Cấp độ phát triển" — `src/lib/portal/hubs.ts:36`

- **Nguyên lý bị ảnh hưởng:** NL07.
- **Vì sao:** "Xem cấp độ hiện tại và mục tiêu kế tiếp" — chưa có trang
  /component hiện thực hoá (không có `href`), nhưng tên gọi "cấp độ"
  định hướng cho bất kỳ ai xây tính năng này sau theo hướng level/rank
  cá nhân, dễ lặp lại sai lầm Level/Rank đã cấm ở
  `KNOWLEDGE_METADATA_STANDARD.md`.
- **Đề xuất:** Đổi tên thành **"Giai đoạn hiện tại"** — gắn với GEM
  Method (SEE/UNDERSTAND/PRACTICE/...) hoặc Living Garden state, không
  dùng từ "cấp độ".
- **Mức độ ưu tiên:** **Medium** — rủi ro ở định hướng tên gọi, chưa có
  component thật nào vi phạm.

### 6. "Chứng chỉ" xuất hiện lặp lại — `src/lib/portal/hubs.ts:37,117`

- **Nguyên lý bị ảnh hưởng:** NL02 (trưởng thành quan trọng hơn hoàn
  thành), NL10 (di sản là con người tốt hơn, không phải bằng cấp).
- **Vì sao:** "Chứng chỉ" là một khái niệm vốn gắn với "hoàn thành
  chương trình" trong giáo dục truyền thống — đúng pattern
  `PORTAL_AS_LIVING_UNIVERSITY.md` đã cảnh báo cần rà soát lại
  ("certificate có ngày cấp cố định mà không có gì tiếp theo").
- **Đề xuất:** Không cần xoá khái niệm Chứng chỉ (vẫn có giá trị thực
  tế, ví dụ xin việc/uy tín) — nhưng khi thiết kế UI thật cho mục này
  (sprint code sau), Chứng chỉ nên đi kèm một dòng tiếp nối ("đây là một
  cột mốc, không phải điểm kết thúc") để không vô tình đóng khung thành
  "tốt nghiệp".
- **Mức độ ưu tiên:** **Low** — chỉ là rủi ro về khung diễn giải khi
  triển khai UI thật, chưa có component nào vi phạm hiện tại.

## Những gì đã kiểm tra và KHÔNG vi phạm (để tránh audit lại không cần thiết)

- `level` trong `CourseCard.tsx`, `LearningPathGrid.tsx`, `OnboardingJourney.tsx`
  — đều là độ khó nội dung hoặc lựa chọn điểm bắt đầu tự khai báo, không
  hiển thị như thứ hạng cá nhân so với người khác — đúng nguyên tắc đã
  định ở `KNOWLEDGE_METADATA_STANDARD.md`.
- `GemBadge.tsx` — chỉ là nhãn loại nội dung (Free/Premium/Khoá), không
  phải huy hiệu thành tích.
- `HumanMomentumCard.tsx` — đã tự đối chiếu đúng nguyên lý ngay trong
  JSDoc ("Động lực của tôi được giữ bằng ý nghĩa, không chỉ bằng điểm
  số").
- `achievements/page.tsx` — nội dung là case study/success story thật,
  không phải hệ thống thành tích unlock được.

## Tổng kết mức độ ưu tiên

| Mức độ | Số lượng | Mục |
|---|---|---|
| Critical | 1 | Leaderboard |
| High | 2 | Top Contributor, Mission30DayCard |
| Medium | 2 | Badge, Cấp độ phát triển |
| Low | 1 | Chứng chỉ (rủi ro khung diễn giải) |

Sprint 11.2 đã **chỉnh sửa trực tiếp** các mục Critical/High/Medium có
thể sửa an toàn bằng copy/data, không cần thay đổi logic — xem mục
"Thay đổi đã thực hiện" dưới đây. Mục "Chứng chỉ" (Low) chỉ là ghi chú
cho sprint UI sau, không cần sửa ngay.

## Thay đổi đã thực hiện trong Sprint 11.2

- `hubs.ts`, `connect-os.ts`: đổi "Leaderboard" → "Đóng góp nổi bật",
  "Top Contributor" → "Đóng góp đáng ghi nhận", gộp "Badge" vào diễn đạt
  không mang tính sưu tập, "Cấp độ phát triển" → "Giai đoạn hiện tại".
- `Mission30DayCard.tsx` + `hubs.ts`: bỏ khung "chuỗi ngày liên tiếp",
  đổi nhãn "Tiến độ chuỗi 30 ngày" → "Các cột mốc trong 30 ngày đầu",
  label module đổi thành "30 ngày đầu tiên".

Chi tiết diff nằm trong commit của Sprint 11.2 — không lặp lại toàn bộ
code ở đây để tài liệu này không lỗi thời khi code thay đổi tiếp.
